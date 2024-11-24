import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { projectSchema } from "@/lib/validations/project"
import { deleteImage } from "@/lib/s3"
import { slugify } from "@/lib/utils"

interface RouteParams {
  params: {
    projectId: string
  }
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!project) {
      return new NextResponse("Project not found", { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("[PROJECT_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const session = await getSession()

    if (!session?.session?.user || session.session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = projectSchema.parse(json)

    // Create or get tags
    const tags = await Promise.all(
      (body.tags || []).map(async (tagName) => {
        const slug = slugify(tagName)
        return prisma.tag.upsert({
          where: { slug },
          update: {},
          create: {
            name: tagName,
            slug,
          },
        })
      })
    )

    // First, delete all existing project tags
    await prisma.projectTag.deleteMany({
      where: {
        projectId: params.projectId,
      },
    })

    const project = await prisma.project.update({
      where: {
        id: params.projectId,
      },
      data: {
        title: body.title,
        slug: slugify(body.title),
        description: body.description,
        content: body.content,
        image: body.image,
        demoUrl: body.demoUrl,
        githubUrl: body.githubUrl,
        category: body.category,
        status: body.status,
        featured: body.featured,
        publishedAt: body.publishedAt,
        tags: {
          create: tags.map((tag) => ({
            tagId: tag.id,
          })),
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("[PROJECT_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getSession()

    if (!session?.session?.user || session.session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
      },
      include: {
        tags: true,
      },
    })

    if (!project) {
      return new NextResponse("Project not found", { status: 404 })
    }

    // Delete project image from S3
    if (project.image) {
      await deleteImage(project.image)
    }

    // Delete project (ProjectTag records will be automatically deleted due to CASCADE)
    await prisma.project.delete({
      where: {
        id: params.projectId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[PROJECT_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

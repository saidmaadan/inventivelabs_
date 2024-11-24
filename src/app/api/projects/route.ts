import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { projectSchema } from "@/lib/validations/project"
import { slugify } from "@/lib/utils"

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.session?.user || session.session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = projectSchema.parse(json)

    // Create or get tags
    const tags = await Promise.all(
      body.tags.map(async (tagName) => {
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

    const project = await prisma.project.create({
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
        userId: session.session.user.id,
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
    console.error("[PROJECTS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("[PROJECTS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { blogSchema } from "@/lib/validations/blog"
import { slugify } from "@/lib/utils"
import { deleteFromS3 } from "@/lib/s3"

export async function GET(
  req: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id: params.blogId,
      },
      include: {
        category: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    if (!blog) {
      return new NextResponse("Blog not found", { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error fetching blog:", error)
    return new NextResponse("Error fetching blog", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const session = await getSession()

    if (!session?.session?.user || session.session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = blogSchema.parse(json)

    const blog = await prisma.blog.findUnique({
      where: {
        id: params.blogId,
      },
    })

    if (!blog) {
      return new NextResponse("Blog not found", { status: 404 })
    }

    const updatedBlog = await prisma.blog.update({
      where: {
        id: params.blogId,
      },
      data: {
        title: body.title,
        slug: body.title !== blog.title ? slugify(body.title) : blog.slug,
        excerpt: body.excerpt,
        content: body.content,
        image: body.image,
        categoryId: body.categoryId,
        status: body.status,
        featured: body.featured,
        publishedAt: body.publishedAt,
        published: body.published,
        seoTitle: body.seoTitle,
        seoDesc: body.seoDesc,
      },
      include: {
        category: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(updatedBlog)
  } catch (error) {
    console.error("Error updating blog:", error)
    return new NextResponse("Error updating blog", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const session = await getSession()

    if (!session?.session?.user || session.session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const blog = await prisma.blog.findUnique({
      where: {
        id: params.blogId,
      },
    })

    if (!blog) {
      return new NextResponse("Blog not found", { status: 404 })
    }

    // Delete image from S3 if it exists
    if (blog.image) {
      const fileName = blog.image.split("/").pop()
      if (fileName) {
        await deleteFromS3(fileName, "blogs")
      }
    }

    await prisma.blog.delete({
      where: {
        id: params.blogId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return new NextResponse("Error deleting blog", { status: 500 })
  }
}

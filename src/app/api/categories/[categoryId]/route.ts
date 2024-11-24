import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { categorySchema } from "@/lib/validations/category"
import { slugify } from "@/lib/utils"
import { deleteFromS3 } from "@/lib/s3"

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        blogs: {
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
            publishedAt: true,
          },
        },
      },
    })

    if (!category) {
      return new NextResponse("Category not found", { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return new NextResponse("Error fetching category", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const session = await getSession()

    if (!session?.session?.user || session.session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = categorySchema.parse(json)

    const category = await prisma.category.findUnique({
      where: {
        id: params.categoryId,
      },
    })

    if (!category) {
      return new NextResponse("Category not found", { status: 404 })
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name: body.name,
        slug: body.name !== category.name ? slugify(body.name) : category.slug,
        description: body.description,
        image: body.image,
        seoTitle: body.seoTitle,
        seoDesc: body.seoDesc,
      },
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Error updating category:", error)
    return new NextResponse("Error updating category", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const session = await getSession()

    if (!session?.session?.user || session.session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const category = await prisma.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        blogs: true,
      },
    })

    if (!category) {
      return new NextResponse("Category not found", { status: 404 })
    }

    if (category.blogs.length > 0) {
      return new NextResponse(
        "Cannot delete category with associated blogs",
        { status: 400 }
      )
    }

    // Delete image from S3 if it exists
    if (category.image) {
      const fileName = category.image.split("/").pop()
      if (fileName) {
        await deleteFromS3(fileName, "categories")
      }
    }

    await prisma.category.delete({
      where: {
        id: params.categoryId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting category:", error)
    return new NextResponse("Error deleting category", { status: 500 })
  }
}

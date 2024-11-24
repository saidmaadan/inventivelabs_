import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { blogSchema } from "@/lib/validations/blog"
import { slugify } from "@/lib/utils"

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.session?.user || session.session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = blogSchema.parse(json)

    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        slug: slugify(body.title),
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
        userId: session.session.user.id,
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

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error creating blog:", error)
    return new NextResponse("Error creating blog", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = 9
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const status = searchParams.get("status") || "PUBLISHED"
    const featured = searchParams.get("featured") === "true"

    // Build where clause
    const where = {
      status,
      ...(featured && { featured }),
      ...(category
        ? {
            category: {
              name: {
                equals: category.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' '),
                mode: "insensitive"
              }
            }
          }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { excerpt: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    }

    // Get paginated blogs
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          category: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          publishedAt: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.blog.count({ where }),
    ])

    const pageCount = Math.ceil(total / pageSize)

    return NextResponse.json({
      blogs,
      total,
      pageCount,
      currentPage: page,
      hasMore: page < pageCount,
    })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return new NextResponse("Error fetching blogs", { status: 500 })
  }
}

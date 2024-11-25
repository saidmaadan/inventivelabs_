import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BlogFilters } from "@/components/blog/blog-filters"
import { BlogList } from "@/components/blog/blog-list"

export const metadata: Metadata = {
  title: "Blog - InventiveLabs",
  description: "Latest news, insights, and updates from InventiveLabs.",
}

export const dynamic = "force-dynamic"

type SearchParams = {
  category?: string
  page?: string
  search?: string
}

type Props = {
  params: {}
  searchParams: SearchParams
}

async function getBlogs(searchParams?: SearchParams) {
  const category = searchParams?.category
  const search = searchParams?.search
  const page = searchParams?.page ? parseInt(searchParams.page) : 1
  const pageSize = 6 

  const where = {
    status: "PUBLISHED",
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

  const blogs = await prisma.blog.findMany({
    where,
    include: {
      category: true,
      user: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  })

  const total = await prisma.blog.count({ where })
  const pageCount = Math.ceil(total / pageSize)

  return {
    blogs,
    total,
    pageCount,
    currentPage: page,
  }
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  })
  return categories
}

export default async function BlogPage({ params, searchParams }: Props) {
  const [{ blogs, total, pageCount, currentPage }, categories] = await Promise.all([
    getBlogs(searchParams),
    getCategories(),
  ])

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground">
            Latest news, insights, and updates from InventiveLabs.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <BlogFilters categories={categories} />
        <BlogList 
          blogs={blogs}
          pageCount={pageCount}
          currentPage={currentPage}
          searchParams={searchParams || {}}
        />
      </div>
    </div>
  )
}

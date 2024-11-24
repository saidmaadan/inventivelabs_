"use client"

import * as React from "react"
import Link from "next/link"
import { BlogCard } from "@/components/blog/blog-card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Blog {
  id: string
  title: string
  excerpt: string
  image: string | null
  slug: string
  publishedAt: Date
  category: {
    name: string
  }
  user: {
    name: string | null
    image: string | null
  }
}

interface BlogListProps {
  blogs: Blog[]
  pageCount: number
  currentPage: number
  searchParams: {
    category?: string
    search?: string
  }
}

export function BlogList({ 
  blogs,
  pageCount,
  currentPage,
  searchParams,
}: BlogListProps) {
  if (blogs.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center">
        <p className="text-muted-foreground">No blog posts found.</p>
      </div>
    )
  }

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams()
    
    // Only add relevant search parameters
    if (searchParams.category) {
      params.set("category", searchParams.category)
    }
    if (searchParams.search) {
      params.set("search", searchParams.search)
    }
    params.set("page", pageNumber.toString())
    
    return `?${params.toString()}`
  }

  return (
    <div className="space-y-8">
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            title={blog.title}
            description={blog.excerpt}
            image={blog.image}
            category={blog.category.name}
            slug={blog.slug}
            author={{
              name: blog.user.name,
              image: blog.user.image,
            }}
            date={blog.publishedAt}
          />
        ))}
      </div>

      {pageCount > 1 && (
        <nav className="mt-8 flex justify-center gap-2" aria-label="Blog pagination">
          {currentPage > 1 && (
            <Link
              href={createPageUrl(currentPage - 1)}
              className={cn(buttonVariants({ variant: "outline" }), "gap-1 px-4")}
              aria-label="Previous page"
            >
              Previous
            </Link>
          )}
          
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={cn(
                buttonVariants({
                  variant: currentPage === page ? "default" : "outline",
                }),
                "px-4"
              )}
              aria-current={currentPage === page ? "page" : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </Link>
          ))}

          {currentPage < pageCount && (
            <Link
              href={createPageUrl(currentPage + 1)}
              className={cn(buttonVariants({ variant: "outline" }), "gap-1 px-4")}
              aria-label="Next page"
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}

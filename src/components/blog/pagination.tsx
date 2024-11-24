"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  pageCount: number
  query: {
    category?: string
    search?: string
  }
}

export function Pagination({ currentPage, pageCount, query }: PaginationProps) {
  const searchParams = useSearchParams()

  const createQueryString = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    
    // Only add defined query parameters
    if (query.category) {
      params.set("category", query.category)
    }
    if (query.search) {
      params.set("search", query.search)
    }
    
    return params.toString()
  }

  if (pageCount <= 1) return null

  return (
    <div className="mt-10 flex items-center justify-center gap-6">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        asChild={currentPage !== 1}
      >
        {currentPage === 1 ? (
          <div className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </div>
        ) : (
          <Link
            href={`/blog?${createQueryString(currentPage - 1)}`}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
        )}
      </Button>

      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {pageCount}
      </div>

      <Button
        variant="outline"
        disabled={currentPage === pageCount}
        asChild={currentPage !== pageCount}
      >
        {currentPage === pageCount ? (
          <div className="flex items-center gap-2">
            Next
            <ChevronRight className="h-4 w-4" />
          </div>
        ) : (
          <Link
            href={`/blog?${createQueryString(currentPage + 1)}`}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </Button>
    </div>
  )
}

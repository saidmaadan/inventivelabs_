"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Category } from "@prisma/client"
import Link from "next/link"

interface BlogFiltersProps {
  categories: Category[]
}

export function BlogFilters({ categories }: BlogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  // Get current filter values from URL
  const currentCategory = searchParams.get("category")
  const currentSearch = searchParams.get("search")

  // Initialize search input with URL value
  const [searchValue, setSearchValue] = useState(currentSearch || "")

  // Update URL with new search params
  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, value)
        }
      }

      return newSearchParams.toString()
    },
    [searchParams]
  )

  // Handle search input
  const handleSearch = useCallback(
    (search: string) => {
      const newQuery = createQueryString({
        search: search || null,
        page: null, // Reset page when searching
      })
      router.push(`${pathname}?${newQuery}`)
    },
    [router, pathname, createQueryString]
  )

  // Handle category selection
  const handleCategoryClick = useCallback(
    (category: Category) => {
      const categoryValue = category.name.toLowerCase().replace(/\s+/g, '-')
      const newQuery = createQueryString({
        category: categoryValue === currentCategory ? null : categoryValue,
        page: null, // Reset page when changing category
      })
      router.push(`${pathname}?${newQuery}`)
    },
    [router, pathname, createQueryString, currentCategory]
  )

  // Handle search input debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentSearch) {
        handleSearch(searchValue)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue, currentSearch, handleSearch])

  // Hydration fix
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search blog posts..."
          className="pl-10"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/blog"
          className="cursor-pointer capitalize bg-primary hover:text-primary-foreground py-[2px] px-[6px] rounded-md"
        >
          All
        </Link>
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={currentCategory === category.name.toLowerCase().replace(/\s+/g, '-') ? "default" : "outline"}
            className="cursor-pointer capitalize hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleCategoryClick(category)}
          >
            {category.name}
          </Badge>
        ))}
      </div>
    </div>
  )
}

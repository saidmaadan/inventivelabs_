"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Grid2X2, List, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type ProjectView = "grid" | "list"

interface ProjectFiltersProps {
  categories?: string[]
  view?: ProjectView
}

export function ProjectFilters({
  categories = [],
  view = "grid",
}: ProjectFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category")
  const currentSearch = searchParams.get("search")
  const currentView = searchParams.get("view") as ProjectView | null

  function updateSearchParams(key: string, value: string | null) {
    const current = new URLSearchParams(searchParams.toString())
    
    if (value) {
      current.set(key, value)
    } else {
      current.delete(key)
    }

    // Reset page when filters change
    if (key !== "page") {
      current.delete("page")
    }

    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.push(`${pathname}${query}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects..."
          className="pl-10"
          value={currentSearch || ""}
          onChange={(e) => updateSearchParams("search", e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={currentCategory === category ? "default" : "outline"}
              className="cursor-pointer capitalize hover:bg-primary hover:text-primary-foreground"
              onClick={() =>
                updateSearchParams(
                  "category",
                  currentCategory === category ? null : category
                )
              }
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              currentView === "grid" && "bg-muted hover:bg-muted"
            )}
            onClick={() => updateSearchParams("view", "grid")}
          >
            <Grid2X2 className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              currentView === "list" && "bg-muted hover:bg-muted"
            )}
            onClick={() => updateSearchParams("view", "list")}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

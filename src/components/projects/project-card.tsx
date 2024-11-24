"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Link2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { ProjectView } from "./project-filters"

interface ProjectCardProps {
  title: string
  description: string
  image?: string | null
  category: string
  demoUrl?: string | null
  githubUrl?: string | null
  slug: string
  tags: string[]
  author: {
    name: string | null
    image: string | null
  }
  view?: ProjectView
}

export function ProjectCard({
  title,
  description,
  image,
  category,
  demoUrl,
  githubUrl,
  slug,
  tags,
  author,
  view = "grid",
}: ProjectCardProps) {
  return (
    <Card className={cn(
      "group overflow-hidden",
      view === "list" && "flex gap-6"
    )}>
      <Link
        href={`/projects/${slug}`}
        className={cn(
          "relative block",
          view === "grid" && "aspect-video w-full",
          view === "list" && "aspect-[4/3] w-72 flex-shrink-0"
        )}
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </Link>

      <div className={cn(
        "flex flex-col",
        view === "grid" && "p-6",
        view === "list" && "py-6 pr-6"
      )}>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {category}
          </Badge>
          {(demoUrl || githubUrl) && (
            <div className="flex items-center gap-2">
              {demoUrl && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                >
                  <Link href={demoUrl} target="_blank">
                    <Link2 className="h-4 w-4" />
                    <span className="sr-only">Demo</span>
                  </Link>
                </Button>
              )}
              {githubUrl && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                >
                  <Link href={githubUrl} target="_blank">
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="mt-4">
          <Link
            href={`/projects/${slug}`}
            className="font-semibold hover:underline"
          >
            {title}
          </Link>
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="capitalize">
              {tag}
            </Badge>
          ))}
        </div>

        {author && (
          <div className="mt-6 flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={author.image || undefined} alt={author.name || ""} />
              <AvatarFallback>
                {author.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{author.name}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

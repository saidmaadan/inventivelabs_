"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"

import { Project } from "@/types/project"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

interface ProjectListItemProps {
  project: Project
  index: number
}

export function ProjectListItem({ project, index }: ProjectListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative flex gap-6 rounded-lg border p-4 hover:bg-muted/50"
    >
      <div className="relative aspect-video w-48 shrink-0 overflow-hidden rounded-md">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col">
        <div className="space-y-1">
          <h3 className="font-semibold leading-none tracking-tight">
            <Link
              href={`/projects/${project.slug}`}
              className="hover:underline"
            >
              {project.title}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            {project.description}
          </p>
        </div>
        <div className="mt-auto space-y-4">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatDate(project.completionDate)}</span>
            <span>·</span>
            <span>{project.category}</span>
            {project.demoUrl && (
              <>
                <span>·</span>
                <Link
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  <ExternalLink className="h-3 w-3" />
                  Demo
                </Link>
              </>
            )}
            {project.githubUrl && (
              <>
                <span>·</span>
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  <Github className="h-3 w-3" />
                  GitHub
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

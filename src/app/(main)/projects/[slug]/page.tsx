import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Github, Link2 } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SocialShare } from "@/components/shared/social-share"

interface ProjectPageProps {
  params: {
    slug: string
  }
}

async function getProject(slug: string) {
  const project = await prisma.project.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
      user: true,
    },
  })

  return project
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params.slug)

  if (!project) {
    return {}
  }

  return {
    title: `${project.title} - InventiveLabs`,
    description: project.description,
    openGraph: {
      title: `${project.title} - InventiveLabs`,
      description: project.description,
      images: project.image ? [project.image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} - InventiveLabs`,
      description: project.description,
      images: project.image ? [project.image] : [],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.slug)

  if (!project) {
    notFound()
  }

  return (
    <article className="container py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="mt-2 text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <SocialShare 
            url={`${process.env.NEXT_PUBLIC_APP_URL}/projects/${project.slug}`}
            title={project.title}
            description={project.description}
          />
          {project.demoUrl && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              asChild
            >
              <Link href={project.demoUrl} target="_blank">
                <Link2 className="h-4 w-4" />
                <span className="sr-only">Demo</span>
              </Link>
            </Button>
          )}
          {project.githubUrl && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              asChild
            >
              <Link href={project.githubUrl} target="_blank">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8">
        {project.image && (
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={project.user.image || undefined} alt={project.user.name || ""} />
            <AvatarFallback>
              {project.user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{project.user.name}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(project.publishedAt || "").toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap gap-2">
          <Badge variant="outline" className="capitalize">
            {project.category}
          </Badge>
          {project.tags.map((tag) => (
            <Badge key={tag.tag.id} variant="secondary" className="capitalize">
              {tag.tag.name}
            </Badge>
          ))}
        </div>
      </div>

      <div
        className="prose prose-slate dark:prose-invert mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: project.content }}
      />
    </article>
  )
}

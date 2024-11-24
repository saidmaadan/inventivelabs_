import { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProjectCard } from "@/components/projects/project-card"
import { ProjectFilters } from "@/components/projects/project-filters"
import { Button } from "@/components/ui/button"
import { projectCategories } from "@/config/projects"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Projects - InventiveLabs",
  description: "Explore our portfolio of innovative projects and solutions.",
}

export const dynamic = "force-dynamic"

interface ProjectsPageProps {
  searchParams: {
    category?: string
    page?: string
    search?: string
    view?: string
  }
}

async function getProjects(params: ProjectsPageProps["searchParams"]) {
  const where = {
    status: "PUBLISHED",
    ...(params.category
      ? {
          category: params.category,
        }
      : {}),
    ...(params.search
      ? {
          OR: [
            { title: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
          ],
        }
      : {}),
  }

  const page = Number(params.page) || 1
  const pageSize = 6

  const projects = await prisma.project.findMany({
    where,
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
      user: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  })

  const total = await prisma.project.count({ where })
  const pageCount = Math.ceil(total / pageSize)

  return {
    projects,
    total,
    pageCount,
  }
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { projects, total, pageCount } = await getProjects(searchParams)
  const currentPage = Number(searchParams.page) || 1
  const currentView = (searchParams.view || "grid") as "grid" | "list"

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Explore our portfolio of innovative projects and solutions
          </p>
        </div>
      </div>

      <div className="mt-8">
        <ProjectFilters 
          categories={projectCategories.map(c => c.id)} 
          view={currentView}
        />
      </div>

      {projects.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center">
          <p className="text-muted-foreground">No projects found.</p>
        </div>
      ) : (
        <>
          <div className={cn(
            "mt-10",
            currentView === "grid" 
              ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" 
              : "flex flex-col gap-6"
          )}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                image={project.image}
                category={project.category}
                demoUrl={project.demoUrl}
                githubUrl={project.githubUrl}
                slug={project.slug}
                tags={project.tags.map((t) => t.tag.name)}
                author={{
                  name: project.user.name,
                  image: project.user.image,
                }}
                view={currentView}
              />
            ))}
          </div>

          {pageCount > 1 && (
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
                    href={{
                      pathname: "/projects",
                      query: {
                        ...searchParams,
                        page: currentPage - 1,
                      },
                    }}
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
                    href={{
                      pathname: "/projects",
                      query: {
                        ...searchParams,
                        page: currentPage + 1,
                      },
                    }}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

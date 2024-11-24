import Link from "next/link"
import { Plus } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProjectsTable } from "@/components/admin/projects/projects-table"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

async function getProjects() {
  return await prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your portfolio projects here
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Link>
        </Button>
      </div>
      <ProjectsTable projects={projects} />
    </div>
  )
}

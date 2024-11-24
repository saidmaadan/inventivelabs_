import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProjectForm } from "@/components/admin/projects/project-form"

interface ProjectPageProps {
  params: {
    projectId: string
  }
}

async function getProject(projectId: string) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  if (!project) {
    notFound()
  }

  return project
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = params.projectId === "new" ? null : await getProject(params.projectId)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          {project ? "Edit Project" : "Create Project"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {project
            ? "Edit your project information."
            : "Add a new project to your portfolio."}
        </p>
      </div>
      <ProjectForm project={project} />
    </div>
  )
}

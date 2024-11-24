import { ProjectForm } from "@/components/admin/projects/project-form"

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Create Project</h3>
        <p className="text-sm text-muted-foreground">
          Add a new project to your portfolio.
        </p>
      </div>
      <ProjectForm />
    </div>
  )
}

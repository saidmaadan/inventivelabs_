import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

import { TemplateForm } from "@/components/admin/newsletter/template-form"

export default async function NewTemplatePage() {
  const session = await getSession()

  if (!session?.session?.user || session.session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Template</h1>
        <p className="text-muted-foreground">
          Create a new email template
        </p>
      </div>
      <TemplateForm />
    </div>
  )
}

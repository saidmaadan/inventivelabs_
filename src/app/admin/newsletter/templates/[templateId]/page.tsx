import { notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

import { TemplateForm } from "@/components/admin/newsletter/template-form"

interface EditTemplatePageProps {
  params: {
    templateId: string
  }
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const session = await getSession()

  if (!session?.session?.user || session.session.user.role !== "ADMIN") {
    redirect("/")
  }

  const template = await prisma.emailTemplate.findUnique({
    where: {
      id: params.templateId,
    },
  })

  if (!template) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Template</h1>
        <p className="text-muted-foreground">
          Make changes to your email template
        </p>
      </div>
      <TemplateForm template={template} />
    </div>
  )
}

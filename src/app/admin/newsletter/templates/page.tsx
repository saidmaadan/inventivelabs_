import Link from "next/link"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

import { TemplatesTable } from "@/components/admin/newsletter/templates-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function TemplatesPage() {
  const session = await getSession()

  if (!session?.session?.user || session.session.user.role !== "ADMIN") {
    redirect("/")
  }

  const templates = await prisma.emailTemplate.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-muted-foreground">
            Create and manage email templates for your newsletters
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/newsletter/templates/new">
            <Plus className="mr-2 h-4 w-4" /> New Template
          </Link>
        </Button>
      </div>
      <TemplatesTable templates={templates} />
    </div>
  )
}

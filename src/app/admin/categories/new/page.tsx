import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"

import { CategoryForm } from "@/components/admin/categories/category-form"

export const metadata = {
  title: "New Category | Admin",
  description: "Create a new blog category",
}

export default async function NewCategoryPage() {
  const session = await getSession()

  if (!session?.session?.user || session.session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Category</h1>
        <p className="text-muted-foreground">
          Create a new blog category
        </p>
      </div>

      <CategoryForm />
    </div>
  )
}

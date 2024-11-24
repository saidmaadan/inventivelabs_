import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

import { CategoryForm } from "@/components/admin/categories/category-form"

interface CategoryPageProps {
  params: {
    categoryId: string
  }
}

export const metadata = {
  title: "Edit Category | Admin",
  description: "Edit a blog category",
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const session = await getSession()

  if (!session?.session?.user || session.session.user.role !== "ADMIN") {
    redirect("/")
  }

  const category = await prisma.category.findUnique({
    where: {
      id: params.categoryId,
    },
  })

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
        <p className="text-muted-foreground">
          Edit your blog category
        </p>
      </div>

      <CategoryForm category={category} />
    </div>
  )
}

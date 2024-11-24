import Link from "next/link"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

import { Button } from "@/components/ui/button"
import { CategoriesTable } from "@/components/admin/categories/categories-table"

export const metadata = {
  title: "Categories | Admin",
  description: "Manage your blog categories",
}

export default async function CategoriesPage() {
  const session = await getSession()

  if (!session?.session?.user || session.session.user.role !== "ADMIN") {
    redirect("/")
  }

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          blogs: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your blog categories here
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">Create Category</Link>
        </Button>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  )
}

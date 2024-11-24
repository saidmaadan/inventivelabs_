import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

import { BlogForm } from "@/components/admin/blogs/blog-form"

export default async function NewBlogPage() {
  const session = await getSession()

  if (!session?.session?.user || session.session.user.role !== "ADMIN") {
    redirect("/")
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Blog</h1>
        <p className="text-muted-foreground">
          Create a new blog post
        </p>
      </div>
      <BlogForm categories={categories} />
    </div>
  )
}

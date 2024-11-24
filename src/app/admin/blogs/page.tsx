import Link from "next/link"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

import { BlogsTable } from "@/components/admin/blogs/blogs-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function BlogsPage() {
  const session = await getSession()

  if (!session?.session?.user || session.session.user.role !== "ADMIN") {
    redirect("/")
  }

  const blogs = await prisma.blog.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground">
            Create and manage blog posts
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blogs/new">
            <Plus className="mr-2 h-4 w-4" /> New Blog
          </Link>
        </Button>
      </div>
      <BlogsTable blogs={blogs} />
    </div>
  )
}

import { notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

import { BlogForm } from "@/components/admin/blogs/blog-form"

interface EditBlogPageProps {
  params: {
    blogId: string
  }
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const session = await getSession()

  if (!session?.session?.user || session.session.user.role !== "ADMIN") {
    redirect("/")
  }

  const [blog, categories] = await Promise.all([
    prisma.blog.findUnique({
      where: {
        id: params.blogId,
      },
    }),
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ])

  if (!blog) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Blog</h1>
        <p className="text-muted-foreground">
          Make changes to your blog post
        </p>
      </div>
      <BlogForm blog={blog} categories={categories} />
    </div>
  )
}

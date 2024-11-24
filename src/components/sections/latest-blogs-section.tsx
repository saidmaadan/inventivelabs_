import { prisma } from "@/lib/prisma"
import { LatestBlogsSection } from "./latest-blogs"

async function getLatestBlogs() {
  const blogs = await prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      category: true,
      user: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3,
  })
  return blogs
}

export async function LatestBlogsSectionWrapper() {
  const blogs = await getLatestBlogs()
  return <LatestBlogsSection blogs={blogs} />
}

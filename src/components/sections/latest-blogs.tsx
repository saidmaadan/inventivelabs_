"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Blog {
  id: string
  title: string
  excerpt: string
  image: string | null
  slug: string
  publishedAt: Date
  category: {
    name: string
  } | null
  user: {
    name: string | null
    image: string | null
  } | null
}

interface LatestBlogsSectionProps {
  blogs: Blog[]
}

export function LatestBlogsSection({ blogs }: LatestBlogsSectionProps) {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest from Our Blog</h2>
          <p className="text-muted-foreground">
            Stay updated with our latest insights and news
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link href={`/blog/${blog.slug}`}>
                <Card>
                  {blog.image && (
                    <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  )}

                  <CardHeader>
                    <div className="space-y-2">
                      {blog.category && (
                        <Badge variant="outline" className="capitalize">
                          {blog.category.name}
                        </Badge>
                      )}
                      <h3 className="line-clamp-2 text-2xl font-bold">
                        {blog.title}
                      </h3>
                      <p className="line-clamp-2 text-muted-foreground">
                        {blog.excerpt}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {blog.user?.image ? (
                          <Image
                            src={blog.user.image}
                            alt={blog.user.name || ""}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-muted" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {blog.user?.name}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            View All Posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

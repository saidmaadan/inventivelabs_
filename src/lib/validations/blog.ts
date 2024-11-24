import * as z from "zod"

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  image: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  featured: z.boolean().default(false),
  publishedAt: z.date().nullable(),
  published: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
})

export type Blog = z.infer<typeof blogSchema>

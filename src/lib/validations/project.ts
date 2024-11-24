import * as z from "zod"

const urlSchema = z.string().url("Please enter a valid URL").or(z.string().length(0))

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  image: z.string().optional(),
  demoUrl: urlSchema.optional(),
  githubUrl: urlSchema.optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  featured: z.boolean().default(false),
  publishedAt: z.date().nullable(),
})

export type Project = z.infer<typeof projectSchema>

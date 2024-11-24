import * as z from "zod"

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
})

export type Category = z.infer<typeof categorySchema>

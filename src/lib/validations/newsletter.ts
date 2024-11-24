import * as z from "zod"

export const templateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
})

export const campaignSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  templateId: z.string().optional(),
  scheduledAt: z.date().optional(),
})

export const subscriberSchema = z.object({
  email: z.string().email("Invalid email address"),
  active: z.boolean().default(true),
})

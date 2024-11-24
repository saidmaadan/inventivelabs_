import * as z from "zod"

export const subscriberSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  status: z.enum(["ACTIVE", "UNSUBSCRIBED", "BOUNCED", "COMPLAINED"]).default("ACTIVE"),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string()).optional(),
})

export const subscriberCreateSchema = subscriberSchema.omit({ status: true })

export const subscriberUpdateSchema = subscriberSchema.partial()

export const subscriberBulkImportSchema = z.object({
  file: z.instanceof(File),
  tags: z.array(z.string()).optional(),
})

export type Subscriber = z.infer<typeof subscriberSchema>
export type SubscriberCreate = z.infer<typeof subscriberCreateSchema>
export type SubscriberUpdate = z.infer<typeof subscriberUpdateSchema>
export type SubscriberBulkImport = z.infer<typeof subscriberBulkImportSchema>

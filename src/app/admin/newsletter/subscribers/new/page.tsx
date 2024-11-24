import { Metadata } from "next"
import { auth } from "@/auth"
import { SubscriberForm } from "@/components/admin/newsletter/subscriber-form"
import { type SubscriberCreate } from "@/lib/validations/subscriber"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const metadata: Metadata = {
  title: "New Subscriber | Admin Dashboard",
  description: "Add a new newsletter subscriber",
}

export default async function NewSubscriberPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return null
  }

  async function createSubscriber(data: SubscriberCreate) {
    'use server'

    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized")
    }

    try {
      const existingSubscriber = await prisma.newsletter.findUnique({
        where: { email: data.email },
      })

      if (existingSubscriber) {
        throw new Error("Subscriber already exists")
      }

      await prisma.newsletter.create({
        data: {
          email: data.email,
          firstName: data.firstName || null,
          lastName: data.lastName || null,
          status: "ACTIVE",
          tags: data.tags || [],
          metadata: data.metadata || {},
        },
      })

      revalidatePath('/admin/newsletter/subscribers')
      return { success: true }
    } catch (error) {
      console.error('Error creating subscriber:', error)
      throw error
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">New Subscriber</h3>
        <p className="text-sm text-muted-foreground">
          Add a new subscriber to your newsletter
        </p>
      </div>
      <div className="max-w-2xl">
        <SubscriberForm onSubmit={createSubscriber} />
      </div>
    </div>
  )
}

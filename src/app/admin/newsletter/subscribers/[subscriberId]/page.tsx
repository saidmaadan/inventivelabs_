import { Metadata } from "next"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { SubscriberForm } from "@/components/admin/newsletter/subscriber-form"

interface SubscriberPageProps {
  params: {
    subscriberId: string
  }
}

export async function generateMetadata({
  params,
}: SubscriberPageProps): Promise<Metadata> {
  const subscriber = await prisma.newsletter.findUnique({
    where: { id: params.subscriberId },
  })

  if (!subscriber) {
    return {
      title: "Subscriber Not Found | Admin Dashboard",
    }
  }

  return {
    title: `${subscriber.email} | Admin Dashboard`,
    description: `Manage subscriber ${subscriber.email}`,
  }
}

export default async function SubscriberPage({ params }: SubscriberPageProps) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return null
  }

  const subscriber = await prisma.newsletter.findUnique({
    where: { id: params.subscriberId },
  })

  if (!subscriber) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Edit Subscriber</h3>
        <p className="text-sm text-muted-foreground">
          Update subscriber information
        </p>
      </div>
      <div className="max-w-2xl">
        <SubscriberForm
          initialData={{
            email: subscriber.email,
            firstName: subscriber.firstName ?? undefined,
            lastName: subscriber.lastName ?? undefined,
            tags: subscriber.tags ?? [],
            metadata: subscriber.metadata ?? {},
          }}
          onSubmit={async (data) => {
            "use server"
            const response = await fetch(
              `/api/newsletter/subscribers/${params.subscriberId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              }
            )

            if (!response.ok) {
              throw new Error("Failed to update subscriber")
            }
          }}
        />
      </div>
    </div>
  )
}

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { auth } from "@/auth"

import { prisma } from "@/lib/prisma"
import { SubscriberTags } from "@/components/admin/newsletter/subscriber-tags"

interface SubscriberTagsPageProps {
  params: {
    subscriberId: string
  }
}

export async function generateMetadata({
  params,
}: SubscriberTagsPageProps): Promise<Metadata> {
  const subscriber = await prisma.newsletter.findUnique({
    where: { id: params.subscriberId },
  })

  if (!subscriber) {
    return {
      title: "Subscriber Not Found | Admin Dashboard",
    }
  }

  return {
    title: `${subscriber.email} Tags | Admin Dashboard`,
    description: `Manage tags for subscriber ${subscriber.email}`,
  }
}

export default async function SubscriberTagsPage({
  params,
}: SubscriberTagsPageProps) {
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
        <h3 className="text-lg font-medium">Manage Tags</h3>
        <p className="text-sm text-muted-foreground">
          Manage tags for {subscriber.email}
        </p>
      </div>
      <div className="max-w-2xl">
        <SubscriberTags
          subscriberId={params.subscriberId}
          initialTags={subscriber.tags ?? []}
        />
      </div>
    </div>
  )
}

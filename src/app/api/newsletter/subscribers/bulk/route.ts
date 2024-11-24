import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { action, subscriberIds, data } = await req.json()

    switch (action) {
      case "delete":
        await prisma.newsletter.deleteMany({
          where: {
            id: {
              in: subscriberIds,
            },
          },
        })
        return NextResponse.json({ message: "Subscribers deleted successfully" })

      case "update_status":
        await prisma.newsletter.updateMany({
          where: {
            id: {
              in: subscriberIds,
            },
          },
          data: {
            status: data.status,
          },
        })
        return NextResponse.json({ message: "Status updated successfully" })

      case "add_tags":
        // Get existing subscribers with their tags
        const subscribers = await prisma.newsletter.findMany({
          where: {
            id: {
              in: subscriberIds,
            },
          },
          select: {
            id: true,
            tags: true,
          },
        })

        // Update each subscriber's tags
        await Promise.all(
          subscribers.map((subscriber) => {
            const updatedTags = Array.from(
              new Set([...(subscriber.tags || []), ...data.tags])
            )
            return prisma.newsletter.update({
              where: { id: subscriber.id },
              data: { tags: updatedTags },
            })
          })
        )
        return NextResponse.json({ message: "Tags added successfully" })

      case "remove_tags":
        // Get existing subscribers with their tags
        const subscribersToUpdate = await prisma.newsletter.findMany({
          where: {
            id: {
              in: subscriberIds,
            },
          },
          select: {
            id: true,
            tags: true,
          },
        })

        // Update each subscriber's tags
        await Promise.all(
          subscribersToUpdate.map((subscriber) => {
            const updatedTags = (subscriber.tags || []).filter(
              (tag) => !data.tags.includes(tag)
            )
            return prisma.newsletter.update({
              where: { id: subscriber.id },
              data: { tags: updatedTags },
            })
          })
        )
        return NextResponse.json({ message: "Tags removed successfully" })

      default:
        return NextResponse.json(
          { message: "Invalid action specified" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Error processing bulk action:", error)
    return NextResponse.json(
      { message: "Failed to process bulk action" },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: { subscriberId: string } }
) {
  try {
    const { subscriberId } = params
    const data = await req.json()

    // Validate the subscriber exists
    const subscriber = await prisma.newsletter.findUnique({
      where: { id: subscriberId },
    })

    if (!subscriber) {
      return NextResponse.json(
        { message: "Subscriber not found" },
        { status: 404 }
      )
    }

    // Update subscriber
    const updatedSubscriber = await prisma.newsletter.update({
      where: { id: subscriberId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        status: data.status,
        tags: data.tags,
        metadata: data.metadata,
      },
    })

    return NextResponse.json(updatedSubscriber)
  } catch (error) {
    console.error("Error updating subscriber:", error)
    return NextResponse.json(
      { message: "Failed to update subscriber" },
      { status: 500 }
    )
  }
}

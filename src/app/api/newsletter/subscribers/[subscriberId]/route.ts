import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { subscriberUpdateSchema } from "@/lib/validations/subscriber"

export async function GET(
  req: NextRequest,
  { params }: { params: { subscriberId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const subscriber = await prisma.newsletter.findUnique({
      where: { id: params.subscriberId },
    })

    if (!subscriber) {
      return new NextResponse("Subscriber not found", { status: 404 })
    }

    return NextResponse.json(subscriber)
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { subscriberId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = subscriberUpdateSchema.parse(json)

    const subscriber = await prisma.newsletter.update({
      where: { id: params.subscriberId },
      data: body,
    })

    return NextResponse.json(subscriber)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }

    return new NextResponse(null, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { subscriberId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    await prisma.newsletter.delete({
      where: { id: params.subscriberId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}

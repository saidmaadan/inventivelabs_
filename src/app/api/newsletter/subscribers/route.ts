import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { subscriberCreateSchema } from "@/lib/validations/subscriber"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      )
    }

    const json = await req.json()
    const body = subscriberCreateSchema.parse(json)

    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email: body.email },
    })

    if (existingSubscriber) {
      return NextResponse.json(
        { message: "Subscriber already exists" },
        { status: 400 }
      )
    }

    const subscriber = await prisma.newsletter.create({
      data: {
        email: body.email,
        firstName: body.firstName || null,
        lastName: body.lastName || null,
        status: "ACTIVE",
        tags: body.tags || [],
        metadata: body.metadata || {},
      },
    })

    return NextResponse.json(subscriber)
  } catch (error) {
    console.error('Error in POST /api/newsletter/subscribers:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 422 }
      )
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") ?? "1")
    const limit = parseInt(searchParams.get("limit") ?? "10")
    const search = searchParams.get("search") ?? ""
    const status = searchParams.get("status") ?? undefined
    const tag = searchParams.get("tag") ?? undefined

    const where = {
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(status ? { status } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
    }

    const [subscribers, total] = await Promise.all([
      prisma.newsletter.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.newsletter.count({ where }),
    ])

    return NextResponse.json({
      subscribers,
      pageCount: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error in GET /api/newsletter/subscribers:', error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

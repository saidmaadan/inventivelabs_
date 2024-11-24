import { NextRequest, NextResponse } from "next/server"

// import { parse } from "csv-parse/sync"
import { parse } from "csv-parse";

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { subscriberCreateSchema } from "@/lib/validations/subscriber"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const tags = formData.get("tags")
      ? (JSON.parse(formData.get("tags") as string) as string[])
      : undefined

    if (!file) {
      return new NextResponse("No file provided", { status: 400 })
    }

    const text = await file.text()
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
    })

    const subscribers = []
    const errors = []

    for (const record of records) {
      try {
        const data = subscriberCreateSchema.parse({
          email: record.email,
          firstName: record.firstName,
          lastName: record.lastName,
          tags,
        })

        const existingSubscriber = await prisma.newsletter.findUnique({
          where: { email: data.email },
        })

        if (!existingSubscriber) {
          subscribers.push(data)
        }
      } catch (error) {
        errors.push({
          row: record,
          error: "Invalid subscriber data",
        })
      }
    }

    if (subscribers.length === 0) {
      return new NextResponse("No valid subscribers found", { status: 400 })
    }

    await prisma.newsletter.createMany({
      data: subscribers,
      skipDuplicates: true,
    })

    return NextResponse.json({
      imported: subscribers.length,
      errors: errors.length,
    })
  } catch (error) {
    console.error("Error importing subscribers:", error)
    return new NextResponse(null, { status: 500 })
  }
}

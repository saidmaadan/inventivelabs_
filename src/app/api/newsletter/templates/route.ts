import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { templateSchema } from "@/lib/validations/newsletter"

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.session?.user || session.session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = templateSchema.parse(json)

    const template = await prisma.emailTemplate.create({
      data: {
        name: body.name,
        subject: body.subject,
        content: body.content,
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error creating template:", error)
    return new NextResponse("Error creating template", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession()

    if (!session?.session?.user || session.session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const templates = await prisma.emailTemplate.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching templates:", error)
    return new NextResponse("Error fetching templates", { status: 500 })
  }
}

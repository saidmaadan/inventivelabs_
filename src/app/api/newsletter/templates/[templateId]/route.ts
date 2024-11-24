import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { templateSchema } from "@/lib/validations/newsletter"

export async function GET(
  req: Request,
  { params }: { params: { templateId: string } }
) {
  try {
    const session = await getSession()

    if (!session?.session?.user || session.session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const template = await prisma.emailTemplate.findUnique({
      where: {
        id: params.templateId,
      },
    })

    if (!template) {
      return new NextResponse("Template not found", { status: 404 })
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error fetching template:", error)
    return new NextResponse("Error fetching template", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { templateId: string } }
) {
  try {
    const session = await getSession()

    if (!session?.session?.user || session.session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = templateSchema.parse(json)

    const template = await prisma.emailTemplate.findUnique({
      where: {
        id: params.templateId,
      },
    })

    if (!template) {
      return new NextResponse("Template not found", { status: 404 })
    }

    const updatedTemplate = await prisma.emailTemplate.update({
      where: {
        id: params.templateId,
      },
      data: {
        name: body.name,
        subject: body.subject,
        content: body.content,
      },
    })

    return NextResponse.json(updatedTemplate)
  } catch (error) {
    console.error("Error updating template:", error)
    return new NextResponse("Error updating template", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { templateId: string } }
) {
  try {
    const session = await getSession()

    if (!session?.session?.user || session.session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const template = await prisma.emailTemplate.findUnique({
      where: {
        id: params.templateId,
      },
    })

    if (!template) {
      return new NextResponse("Template not found", { status: 404 })
    }

    await prisma.emailTemplate.delete({
      where: {
        id: params.templateId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting template:", error)
    return new NextResponse("Error deleting template", { status: 500 })
  }
}

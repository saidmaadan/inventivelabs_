import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.session?.user || session.session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || "uploads"

    if (!file) {
      return new NextResponse("No file provided", { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const key = `${folder}/${uuidv4()}-${file.name}`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    )

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

    return NextResponse.json({ url: imageUrl })
  } catch (error) {
    console.error("Upload error:", error)
    return new NextResponse("Failed to upload file", { status: 500 })
  }
}

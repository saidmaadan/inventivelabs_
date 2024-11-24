import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("AWS credentials are not properly configured")
}

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

export type UploadFolder = "projects" | "blogs" | "categories"

export async function uploadToS3(
  file: Buffer,
  fileName: string,
  contentType: string,
  folder: UploadFolder = "projects"
) {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folder}/${fileName}`,
      Body: file,
      ContentType: contentType,
      ACL: "public-read",
    })

    await s3Client.send(command)
    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${folder}/${fileName}`
  } catch (error) {
    console.error("Error uploading to S3:", error)
    throw new Error("Failed to upload file to S3")
  }
}

export async function deleteFromS3(fileName: string, folder: UploadFolder = "projects") {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folder}/${fileName}`,
    })

    await s3Client.send(command)
  } catch (error) {
    console.error("Error deleting from S3:", error)
    throw new Error("Failed to delete file from S3")
  }
}

export async function getSignedUploadUrl(fileName: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `projects/${fileName}`,
    ContentType: contentType,
    ACL: "public-read",
  })

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    return {
      uploadUrl: signedUrl,
      publicUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/projects/${fileName}`,
    }
  } catch (error) {
    console.error("Error generating signed URL:", error)
    throw new Error("Failed to generate upload URL")
  }
}

export async function deleteImage(imageUrl: string) {
  try {
    if (!imageUrl) {
      console.warn("No image URL provided for deletion");
      return;
    }

    // Extract the key from the URL
    // Example URL: https://bucket-name.s3.amazonaws.com/projects/image.jpg
    const matches = imageUrl.match(/amazonaws\.com\/(.+)$/);
    if (!matches || !matches[1]) {
      console.warn("Invalid S3 URL format:", imageUrl);
      return;
    }

    const key = matches[1];
    console.log("Deleting S3 object with key:", key);

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    await s3Client.send(command);
    console.log("Successfully deleted image from S3:", imageUrl);
  } catch (error) {
    console.error("Error deleting image from S3:", error);
    // Don't throw the error, just log it and continue
    // This prevents the project deletion from failing if image deletion fails
  }
}

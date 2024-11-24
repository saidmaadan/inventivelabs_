"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { ImageIcon, Loader2 } from "lucide-react"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  folder?: string
}

export function ImageUpload({ value, onChange, disabled, folder = "projects" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true)
        const file = acceptedFiles[0]

        if (!file) {
          return
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", folder)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to upload image")
        }

        const { url } = await response.json()
        onChange(url)
        toast.success("Image uploaded successfully")
      } catch (error) {
        console.error("Error uploading image:", error)
        toast.error("Failed to upload image")
      } finally {
        setIsUploading(false)
      }
    },
    [onChange, folder]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
    disabled: disabled || isUploading,
  })

  return (
    <div
      {...getRootProps()}
      className="group relative mt-4 grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25"
    >
      <input {...getInputProps()} />
      {value ? (
        <div className="relative h-full w-full">
          <Image
            src={value}
            alt="Upload"
            fill
            className="rounded-lg object-cover"
          />
        </div>
      ) : (
        <div className="grid place-items-center gap-2">
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <ImageIcon className="h-8 w-8" />
          )}
          <div className="text-sm">
            {isDragActive
              ? "Drop the image here"
              : "Drag & drop an image here, or click to select"}
          </div>
        </div>
      )}
    </div>
  )
}

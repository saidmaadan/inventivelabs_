"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface SubscriberTagsProps {
  subscriberId: string
  initialTags: string[]
}

export function SubscriberTags({
  subscriberId,
  initialTags,
}: SubscriberTagsProps) {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>(initialTags)
  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function addTag(tag: string) {
    if (!tag) return

    try {
      setIsLoading(true)
      const response = await fetch(
        `/api/newsletter/subscribers/${subscriberId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tags: [...tags, tag],
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to add tag")
      }

      setTags([...tags, tag])
      setNewTag("")
      toast.success("Tag added successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to add tag")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function removeTag(tagToRemove: string) {
    try {
      setIsLoading(true)
      const response = await fetch(
        `/api/newsletter/subscribers/${subscriberId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tags: tags.filter((tag) => tag !== tagToRemove),
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to remove tag")
      }

      setTags(tags.filter((tag) => tag !== tagToRemove))
      toast.success("Tag removed successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to remove tag")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Add a tag..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addTag(newTag)
            }
          }}
          disabled={isLoading}
        />
        <Button
          onClick={() => addTag(newTag)}
          disabled={!newTag || isLoading}
        >
          Add Tag
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-transparent"
              onClick={() => removeTag(tag)}
              disabled={isLoading}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag} tag</span>
            </Button>
          </Badge>
        ))}
        {tags.length === 0 && (
          <p className="text-sm text-muted-foreground">No tags added yet</p>
        )}
      </div>
    </div>
  )
}

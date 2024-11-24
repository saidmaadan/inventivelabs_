"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const subscriberFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  status: z.enum(["PENDING", "ACTIVE", "UNSUBSCRIBED", "BOUNCED"]),
  tags: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof subscriberFormSchema>

interface SubscriberEditFormProps {
  subscriber: {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    status: string
    tags?: string[]
  }
}

export function SubscriberEditForm({ subscriber }: SubscriberEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(subscriberFormSchema),
    defaultValues: {
      firstName: subscriber.firstName || "",
      lastName: subscriber.lastName || "",
      status: subscriber.status as "PENDING" | "ACTIVE" | "UNSUBSCRIBED" | "BOUNCED",
      tags: subscriber.tags || [],
    },
  })

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true)
      const response = await fetch(
        `/api/newsletter/subscribers/${subscriber.id}/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update subscriber")
      }

      toast.success("Subscriber updated successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to update subscriber")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="UNSUBSCRIBED">Unsubscribed</SelectItem>
                  <SelectItem value="BOUNCED">Bounced</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { subscriberCreateSchema } from "@/lib/validations/subscriber"

type FormData = z.infer<typeof subscriberCreateSchema>

interface SubscriberFormProps {
  initialData?: Partial<FormData>
  onSubmit: (data: FormData) => Promise<{ success: boolean } | void>
}

export function SubscriberForm({ initialData, onSubmit }: SubscriberFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(subscriberCreateSchema),
    defaultValues: {
      email: initialData?.email ?? "",
      firstName: initialData?.firstName ?? "",
      lastName: initialData?.lastName ?? "",
      tags: initialData?.tags ?? [],
      metadata: initialData?.metadata ?? {},
    },
  })

  async function handleSubmit(data: FormData) {
    try {
      setIsLoading(true)
      await onSubmit(data)
      toast.success("Subscriber saved successfully")
      router.push("/admin/newsletter/subscribers")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="john@example.com" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                The subscriber&apos;s email address
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="John" 
                  {...field} 
                  disabled={isLoading}
                />
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
                <Input 
                  placeholder="Doe" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Subscriber"}
        </Button>
      </form>
    </Form>
  )
}

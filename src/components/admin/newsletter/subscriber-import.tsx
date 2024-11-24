"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Upload } from "lucide-react"

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
import { subscriberBulkImportSchema } from "@/lib/validations/subscriber"

type FormData = z.infer<typeof subscriberBulkImportSchema>

interface SubscriberImportProps {
  onImport: (data: FormData) => Promise<void>
}

export function SubscriberImport({ onImport }: SubscriberImportProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(subscriberBulkImportSchema),
  })

  async function handleSubmit(data: FormData) {
    try {
      setIsLoading(true)
      await onImport(data)
      toast.success("Subscribers imported successfully")
      router.push("/admin/newsletter/subscribers")
      router.refresh()
    } catch (error) {
      toast.error("Failed to import subscribers")
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
          name="file"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>CSV File</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        onChange(file)
                      }
                    }}
                    {...field}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      "Importing..."
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                      </>
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                Upload a CSV file containing subscriber data. The file should have
                the following columns: email (required), firstName, lastName
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

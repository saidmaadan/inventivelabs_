import { Metadata } from "next"
import { auth } from "@/auth"
import { SubscriberImport } from "@/components/admin/newsletter/subscriber-import"

export const metadata: Metadata = {
  title: "Import Subscribers | Admin Dashboard",
  description: "Import newsletter subscribers from a CSV file",
}

export default async function ImportSubscribersPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Import Subscribers</h3>
        <p className="text-sm text-muted-foreground">
          Import subscribers from a CSV file
        </p>
      </div>
      <div className="max-w-2xl">
        <SubscriberImport
          onImport={async (data) => {
            "use server"
            const formData = new FormData()
            formData.append("file", data.file)
            if (data.tags) {
              formData.append("tags", JSON.stringify(data.tags))
            }

            const response = await fetch("/api/newsletter/subscribers/import", {
              method: "POST",
              body: formData,
            })

            if (!response.ok) {
              throw new Error("Failed to import subscribers")
            }
          }}
        />
      </div>
    </div>
  )
}

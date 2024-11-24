import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = await getSession()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/signin")
  }

  return (
    <div className="relative flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1">
        <AdminHeader user={session.user} />
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}

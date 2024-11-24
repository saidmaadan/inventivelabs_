import { Suspense } from "react"
import { Metadata } from "next"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Skeleton } from "@/components/ui/skeleton"
import { SubscribersTable } from "@/components/admin/newsletter/subscribers-table"
import { deleteSubscriber } from "./actions"
import { SubscriberFilters } from "@/components/admin/newsletter/subscriber-filters"

export const metadata: Metadata = {
  title: "Subscribers | Admin Dashboard",
  description: "Manage your newsletter subscribers",
}

type SearchParams = {
  page?: string | string[]
  search?: string | string[]
  status?: string | string[]
  tag?: string | string[]
}

interface PageProps {
  searchParams: SearchParams
}

function parseSearchParams(params: SearchParams) {
  return {
    page: Array.isArray(params.page) ? params.page[0] : params.page,
    search: Array.isArray(params.search) ? params.search[0] : params.search,
    status: Array.isArray(params.status) ? params.status[0] : params.status,
    tag: Array.isArray(params.tag) ? params.tag[0] : params.tag,
  }
}

async function getSubscribers(searchParams: SearchParams) {
  const params = parseSearchParams(searchParams)
  
  // Parse and validate page number
  const pageNumber = parseInt(params.page || "1")
  const page = isNaN(pageNumber) ? 1 : Math.max(1, pageNumber)
  
  // Get search parameters with fallbacks
  const search = params.search || ""
  const status = params.status === "all" ? undefined : params.status
  const tag = params.tag || ""

  const where = {
    ...(search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
    ...(tag ? { tags: { has: tag } } : {}),
  }

  const [subscribers, total] = await Promise.all([
    prisma.newsletter.findMany({
      where,
      take: 10,
      skip: (page - 1) * 10,
      orderBy: { createdAt: "desc" },
    }),
    prisma.newsletter.count({ where }),
  ])

  return {
    subscribers,
    pageCount: Math.ceil(total / 10),
    currentPage: page,
  }
}

async function SubscribersContent({ searchParams }: PageProps) {
  const { subscribers, pageCount, currentPage } = await getSubscribers(searchParams)
  const params = parseSearchParams(searchParams)

  return (
    <div className="space-y-4">
      <SubscriberFilters />
      <SubscribersTable
        subscribers={subscribers}
        deleteAction={deleteSubscriber}
      />
      {pageCount > 1 && (
        <div className="flex items-center justify-center space-x-2">
          {Array.from({ length: pageCount }).map((_, i) => {
            const pageNumber = i + 1
            const isCurrentPage = pageNumber === currentPage

            // Create a new URLSearchParams object with current parameters
            const urlParams = new URLSearchParams()
            if (params.search) urlParams.set("search", params.search)
            if (params.status && params.status !== "all") urlParams.set("status", params.status)
            if (params.tag) urlParams.set("tag", params.tag)
            urlParams.set("page", pageNumber.toString())

            return (
              <a
                key={i}
                href={`?${urlParams.toString()}`}
                className={`px-3 py-1 rounded-md ${
                  isCurrentPage
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {pageNumber}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default async function SubscribersPage({
  searchParams,
}: PageProps) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Subscribers</h3>
        <p className="text-sm text-muted-foreground">
          Manage your newsletter subscribers
        </p>
      </div>
      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-8 w-[200px]" />
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        }
      >
        <SubscribersContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

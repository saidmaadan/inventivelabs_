"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SubscriberFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }
    router.push(`?${params.toString()}`)
  }, [router, searchParams])

  const handleStatusChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value !== "all") {
      params.set("status", value)
    } else {
      params.delete("status")
    }
    router.push(`?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="flex items-center gap-4">
      <Input
        placeholder="Search subscribers..."
        className="max-w-xs"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Select
        defaultValue={searchParams.get("status") ?? "all"}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="UNSUBSCRIBED">Unsubscribed</SelectItem>
          <SelectItem value="BOUNCED">Bounced</SelectItem>
          <SelectItem value="COMPLAINED">Complained</SelectItem>
        </SelectContent>
      </Select>
      <Button asChild className="ml-auto">
        <Link href="/admin/newsletter/subscribers/import">Import Subscribers</Link>
      </Button>
      <Button asChild>
        <Link href="/admin/newsletter/subscribers/new">Add Subscriber</Link>
      </Button>
    </div>
  )
}

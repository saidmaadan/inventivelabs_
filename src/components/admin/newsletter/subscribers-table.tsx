"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Mail, Tag, Trash } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { SubscriberBulkActions } from "./subscriber-bulk-actions"

interface SubscribersTableProps {
  subscribers: {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    status: string
    tags?: string[]
    createdAt: Date
    updatedAt: Date
  }[]
  deleteAction: (id: string) => Promise<{ success: boolean; error?: string }>
}

export function SubscribersTable({
  subscribers,
  deleteAction,
}: SubscribersTableProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleDelete = async (id: string) => {
    try {
      setLoading(id)
      const result = await deleteAction(id)
      if (result.success) {
        toast.success("Subscriber deleted successfully")
      } else {
        toast.error(result.error || "Failed to delete subscriber")
      }
    } catch (error) {
      toast.error("Failed to delete subscriber")
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? subscribers.map((s) => s.id) : [])
  }

  const handleSelectOne = (checked: boolean, id: string) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    )
  }

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedIds.length} subscribers selected
          </p>
          <SubscriberBulkActions
            selectedIds={selectedIds}
            onActionComplete={() => {
              setSelectedIds([])
              window.location.reload()
            }}
          />
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    subscribers.length > 0 &&
                    selectedIds.length === subscribers.length
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(subscriber.id)}
                    onCheckedChange={(checked) =>
                      handleSelectOne(checked, subscriber.id)
                    }
                    aria-label={`Select ${subscriber.email}`}
                  />
                </TableCell>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell>
                  {subscriber.firstName || subscriber.lastName
                    ? `${subscriber.firstName || ""} ${subscriber.lastName || ""}`
                    : "-"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      subscriber.status === "ACTIVE"
                        ? "success"
                        : subscriber.status === "UNSUBSCRIBED"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {subscriber.status.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  {subscriber.tags?.length ? (
                    <div className="flex gap-1">
                      {subscriber.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{formatDate(subscriber.createdAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        disabled={loading === subscriber.id}
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          window.location.href = `/admin/newsletter/subscribers/${subscriber.id}`
                        }
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          window.location.href = `/admin/newsletter/subscribers/${subscriber.id}/tags`
                        }
                      >
                        <Tag className="mr-2 h-4 w-4" />
                        Manage Tags
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(subscriber.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

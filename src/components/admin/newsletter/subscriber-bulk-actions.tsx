import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface SubscriberBulkActionsProps {
  selectedIds: string[]
  onActionComplete: () => void
}

export function SubscriberBulkActions({
  selectedIds,
  onActionComplete,
}: SubscriberBulkActionsProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [actionType, setActionType] = useState("")
  const [status, setStatus] = useState("")
  const [tags, setTags] = useState("")

  const handleAction = async () => {
    if (selectedIds.length === 0) {
      toast.error("No subscribers selected")
      return
    }

    try {
      let data = {}
      switch (actionType) {
        case "update_status":
          data = { status }
          break
        case "add_tags":
        case "remove_tags":
          data = { tags: tags.split(",").map((tag) => tag.trim()) }
          break
      }

      const response = await fetch("/api/newsletter/subscribers/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: actionType,
          subscriberIds: selectedIds,
          data,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to perform bulk action")
      }

      toast.success("Bulk action completed successfully")
      setShowDialog(false)
      onActionComplete()
    } catch (error) {
      console.error("Error performing bulk action:", error)
      toast.error("Failed to perform bulk action")
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={selectedIds.length === 0}>
            Bulk Actions ({selectedIds.length})
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setActionType("delete")
              setShowDialog(true)
            }}
          >
            Delete Selected
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setActionType("update_status")
              setShowDialog(true)
            }}
          >
            Update Status
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setActionType("add_tags")
              setShowDialog(true)
            }}
          >
            Add Tags
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setActionType("remove_tags")
              setShowDialog(true)
            }}
          >
            Remove Tags
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "delete"
                ? "Delete Subscribers"
                : actionType === "update_status"
                ? "Update Status"
                : actionType === "add_tags"
                ? "Add Tags"
                : "Remove Tags"}
            </DialogTitle>
            <DialogDescription>
              This action will affect {selectedIds.length} selected subscribers.
            </DialogDescription>
          </DialogHeader>

          {actionType === "update_status" && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="UNSUBSCRIBED">Unsubscribed</SelectItem>
                    <SelectItem value="BOUNCED">Bounced</SelectItem>
                    <SelectItem value="COMPLAINED">Complained</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {(actionType === "add_tags" || actionType === "remove_tags") && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === "delete" ? "destructive" : "default"}
              onClick={handleAction}
            >
              {actionType === "delete"
                ? "Delete"
                : actionType === "update_status"
                ? "Update"
                : actionType === "add_tags"
                ? "Add Tags"
                : "Remove Tags"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

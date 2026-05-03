"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Goal, Priority } from "@/lib/types/goal"

interface GoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal?: Goal | null
  onSave: (goal: Partial<Goal>) => void
}

export function GoalDialog({ open, onOpenChange, goal, onSave }: GoalDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [dueDate, setDueDate] = useState("")

  const isEditing = !!goal

  useEffect(() => {
    if (goal) {
      setTitle(goal.title)
      setDescription(goal.description)
      setPriority(goal.priority)
      setDueDate(goal.dueDate)
    } else {
      setTitle("")
      setDescription("")
      setPriority("medium")
      setDueDate("")
    }
  }, [goal, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...(goal && { id: goal.id }),
      title,
      description,
      priority,
      dueDate,
      ...(isEditing ? {} : { progress: 0, status: "active", milestones: [], tasks: [] }),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Goal" : "Create Goal"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your goal details below."
                : "Set a new goal to track your progress."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Learn a new language"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your goal..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Save Changes" : "Create Goal"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

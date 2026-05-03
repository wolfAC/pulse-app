"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Calendar, Flag, ListTodo, Milestone } from "lucide-react"
import type { Goal, Priority } from "@/lib/types/goal"
import { formatSimpleDate } from "@/lib/utils"

interface GoalDetailsSheetProps {
  goal: Goal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggleMilestone: (goalId: string, milestoneId: string) => void
  onToggleTask: (goalId: string, taskId: string) => void
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", className: "bg-chart-3/20 text-chart-3" },
  high: { label: "High", className: "bg-destructive/20 text-destructive" },
}

export function GoalDetailsSheet({
  goal,
  open,
  onOpenChange,
  onToggleMilestone,
  onToggleTask,
}: GoalDetailsSheetProps) {
  if (!goal) return null

  const priority = priorityConfig[goal.priority]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-xl">{goal.title}</SheetTitle>
          <SheetDescription>{goal.description}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={priority.className} variant="secondary">
              <Flag className="mr-1 size-3" />
              {priority.label} Priority
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Calendar className="size-3" />
              Due {formatSimpleDate(goal.dueDate)}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-muted-foreground">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-3" />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Milestone className="size-4 text-primary" />
              <h4 className="font-semibold">Milestones</h4>
            </div>
            {goal.milestones.length === 0 ? (
              <p className="text-sm text-muted-foreground">No milestones added yet.</p>
            ) : (
              <div className="space-y-3">
                {goal.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`milestone-${milestone.id}`}
                      checked={milestone.completed}
                      onCheckedChange={() => onToggleMilestone(goal.id, milestone.id)}
                    />
                    <label
                      htmlFor={`milestone-${milestone.id}`}
                      className={`text-sm cursor-pointer ${
                        milestone.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {milestone.title}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ListTodo className="size-4 text-accent" />
              <h4 className="font-semibold">Tasks</h4>
            </div>
            {goal.tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks added yet.</p>
            ) : (
              <div className="space-y-3">
                {goal.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => onToggleTask(goal.id, task.id)}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`text-sm cursor-pointer ${
                        task.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {task.title}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, MoreVertical, Pencil, Trash2, Target, Flag, CheckCircle2 } from "lucide-react"
import type { Goal, Priority } from "@/lib/types/goal"
import { formatSimpleDate } from "@/lib/utils"

interface GoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
  onDelete: (id: string) => void
  onSelect: (goal: Goal) => void
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", className: "bg-chart-3/20 text-chart-3" },
  high: { label: "High", className: "bg-destructive/20 text-destructive" },
}

const statusIcons = {
  active: Target,
  completed: CheckCircle2,
  paused: Flag,
}

export function GoalCard({ goal, onEdit, onDelete, onSelect }: GoalCardProps) {
  const priority = priorityConfig[goal.priority]
  const StatusIcon = statusIcons[goal.status]
  const isCompleted = goal.status === "completed"

  return (
    <Card
      className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${
        isCompleted ? "opacity-70" : ""
      }`}
      onClick={() => onSelect(goal)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <StatusIcon
              className={`size-4 ${
                isCompleted ? "text-accent" : "text-primary"
              }`}
            />
            <h3 className={`font-semibold leading-tight ${isCompleted ? "line-through" : ""}`}>
              {goal.title}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="size-8 shrink-0">
                <MoreVertical className="size-4" />
                <span className="sr-only">Goal actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(goal)
                }}
              >
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(goal.id)
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {goal.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
        <div className="flex items-center justify-between">
          <Badge className={priority.className} variant="secondary">
            {priority.label}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            <span>{formatSimpleDate(goal.dueDate)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  Pencil,
  Trash2,
  Target,
  Flag,
  CheckCircle2,
} from "lucide-react";
import type { Goal, Priority } from "@/lib/types/goal";
import { formatSimpleDate } from "@/lib/utils";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", className: "bg-chart-3/20 text-chart-3" },
  high: { label: "High", className: "bg-destructive/20 text-destructive" },
};

const statusIcons = {
  active: Target,
  completed: CheckCircle2,
  paused: Flag,
};

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const priority = priorityConfig[goal.priority];
  const StatusIcon = statusIcons[goal.status];
  const isCompleted = goal.status === "completed";

  return (
    <Card
      className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${
        isCompleted ? "opacity-70" : ""
      }`}
      onClick={() => onEdit(goal)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <StatusIcon
              className={`size-4 shrink-0 ${
                isCompleted ? "text-accent" : "text-primary"
              }`}
            />
            <h3
              className={`font-semibold leading-tight truncate ${
                isCompleted ? "line-through" : ""
              }`}
            >
              {goal.title}
            </h3>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(goal);
              }}
            >
              <Pencil className="size-3.5" />
              <span className="sr-only">Edit goal</span>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="size-3.5" />
                  <span className="sr-only">Delete goal</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete goal?</AlertDialogTitle>
                  <AlertDialogDescription>
                    &quot;{goal.title}&quot; and all its milestones and tasks
                    will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(goal.id);
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Clock,
  Flame,
  Route,
  Dumbbell,
  Bike,
  Waves,
  PersonStanding,
  Zap,
  Footprints,
  Activity,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { Workout, WorkoutType } from "@/lib/types/health";

const workoutConfig: Record<
  WorkoutType,
  { icon: typeof Dumbbell; color: string; bgColor: string; label: string }
> = {
  running: {
    icon: Footprints,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    label: "Running",
  },
  cycling: {
    icon: Bike,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    label: "Cycling",
  },
  swimming: {
    icon: Waves,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    label: "Swimming",
  },
  strength: {
    icon: Dumbbell,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    label: "Strength",
  },
  yoga: {
    icon: PersonStanding,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    label: "Yoga",
  },
  hiit: {
    icon: Zap,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    label: "HIIT",
  },
  walking: {
    icon: Footprints,
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
    label: "Walking",
  },
  other: {
    icon: Activity,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    label: "Other",
  },
};

interface WorkoutCardProps {
  workout: Workout;
  onEdit?: (workout: Workout) => void;
  onDelete?: (id: string) => void;
}

export function WorkoutCard({ workout, onEdit, onDelete }: WorkoutCardProps) {
  const config = workoutConfig[workout.type];
  const Icon = config.icon;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatWorkoutDate = (dateValue: number) => {
    return formatDate(dateValue, { includeWeekday: true });
  };

  return (
    <Card className="overflow-hidden group hover:border-primary/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-xl",
                config.bgColor,
              )}
            >
              <Icon className={cn("size-6", config.color)} />
            </div>
            <div>
              <h3 className="font-semibold">{workout.name}</h3>
              <p className="text-xs text-muted-foreground">
                {formatWorkoutDate(workout.createdAt)}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(workout)}>
                <Pencil className="size-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(workout.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Badge variant="secondary" className="mb-4">
          {config.label}
        </Badge>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
            <Clock className="size-4 text-muted-foreground mb-1" />
            <span className="text-sm font-semibold">
              {formatDuration(workout.duration)}
            </span>
            <span className="text-[10px] text-muted-foreground">Duration</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
            <Flame className="size-4 text-orange-500 mb-1" />
            <span className="text-sm font-semibold">
              {workout.caloriesBurned}
            </span>
            <span className="text-[10px] text-muted-foreground">Calories</span>
          </div>

          {workout.distance !== undefined && (
            <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
              <Route className="size-4 text-sky-500 mb-1" />
              <span className="text-sm font-semibold">
                {workout.distance}km
              </span>
              <span className="text-[10px] text-muted-foreground">
                Distance
              </span>
            </div>
          )}
        </div>

        {workout.notes && (
          <p className="mt-3 text-xs text-muted-foreground border-t border-border pt-3">
            {workout.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

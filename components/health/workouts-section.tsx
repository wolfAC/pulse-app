"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkoutCard } from "./workout-card";
import { Dumbbell, TrendingUp, Flame, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { deleteWorkout } from "@/store/slices/health";

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function WorkoutsSection() {
  const dispatch = useDispatch();
  const workouts = useSelector((state: RootState) => state.health.workouts);

  const totalCalories = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);

  const handleDelete = (id: string) => {
    dispatch(deleteWorkout(id));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Dumbbell className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{workouts.length}</p>
                <p className="text-xs text-muted-foreground">
                  Workouts this week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Flame className="size-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {totalCalories.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Calories burned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Clock className="size-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatDuration(totalDuration)}
                </p>
                <p className="text-xs text-muted-foreground">Total duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <TrendingUp className="size-4 text-muted-foreground" />
            Recent Workouts
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {workouts.length} workouts
          </Badge>
        </CardHeader>
        <CardContent>
          {workouts.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No workouts yet. Add one to get started!
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

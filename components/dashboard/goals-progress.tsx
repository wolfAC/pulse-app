"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useMemo } from "react";

const statusColors = {
  "on-track": "bg-accent/20 text-accent",
  "in-progress": "bg-primary/20 text-primary",
  behind: "bg-destructive/20 text-destructive",
};

const statusLabels = {
  "on-track": "On Track",
  "in-progress": "In Progress",
  behind: "Behind",
};

export function GoalsProgress() {
  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );
  const allGoals = useSelector((state: RootState) => state.goals.goals ?? []);
  const goals = useMemo(
    () => allGoals.filter((g) => g.userEmail === currentEmail),
    [allGoals, currentEmail],
  );
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Goals Progress
        </CardTitle>
        <div className="flex size-9 items-center justify-center rounded-lg bg-chart-3/10">
          <Target className="size-5 text-chart-3" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Target className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                No goals yet
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Create a goal to start tracking your progress
              </p>
            </div>
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {goal.progress === 100 ? (
                    <CheckCircle2 className="size-4 text-accent" />
                  ) : (
                    <div className="size-2 rounded-full bg-muted-foreground/40" />
                  )}
                  <span className="text-sm font-medium">{goal.title}</span>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    statusColors[goal.status as keyof typeof statusColors]
                  }
                >
                  {statusLabels[goal.status as keyof typeof statusLabels]}
                </Badge>
              </div>
              <Progress value={goal.progress} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{goal.progress}% complete</span>
                <span>Due {goal.dueDate}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

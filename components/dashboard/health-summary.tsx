"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RootState } from "@/store";
import { Heart, Moon, Footprints, Droplets, Flame } from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export function HealthSummary() {
  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );
  const allEntries = useSelector(
    (state: RootState) => state.health.entries ?? [],
  );
  const entries = useMemo(
    () =>
      allEntries
        .filter((e) => e.userEmail === currentEmail)
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt),
    [allEntries, currentEmail],
  );

  const latestDate = entries[0]?.createdAt;
  const latestEntries = entries.filter((e) => e.createdAt === latestDate);

  const get = (type: string) => latestEntries.find((e) => e.type === type);

  const sleep = get("sleep");
  const steps = get("steps");
  const calories = get("calories");
  const water = get("water");

  const healthMetrics = [
    {
      id: 1,
      title: "Sleep",
      value: sleep ? `${sleep.value}h` : "—",
      target: "8h goal",
      progress: sleep ? Math.min(100, (sleep.value / 8) * 100) : 0,
      icon: Moon,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      id: 2,
      title: "Steps",
      value: steps ? steps.value.toLocaleString() : "—",
      target: "10k goal",
      progress: steps ? Math.min(100, (steps.value / 10000) * 100) : 0,
      icon: Footprints,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      id: 3,
      title: "Calories",
      value: calories ? calories.value.toLocaleString() : "—",
      target: "2,200 goal",
      progress: calories ? Math.min(100, (calories.value / 2200) * 100) : 0,
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      id: 4,
      title: "Water",
      value: water ? `${water.value}L` : "—",
      target: "3L goal",
      progress: water ? Math.min(100, (water.value / 3) * 100) : 0,
      icon: Droplets,
      color: "text-sky-500",
      bgColor: "bg-sky-500/10",
    },
  ];

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-destructive/10 via-transparent to-transparent" />
      <CardHeader className="relative flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Health Summary
        </CardTitle>
        <div className="flex size-9 items-center justify-center rounded-lg bg-destructive/10">
          <Heart className="size-5 text-destructive" />
        </div>
      </CardHeader>
      <CardContent className="relative space-y-6">
        {healthMetrics.map((metric) => (
          <div key={metric.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-8 items-center justify-center rounded-lg ${metric.bgColor}`}
                >
                  <metric.icon className={`size-4 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{metric.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {metric.target}
                  </p>
                </div>
              </div>
              <span className="text-lg font-semibold">{metric.value}</span>
            </div>
            <Progress value={metric.progress} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

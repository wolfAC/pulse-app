"use client";

import { useMemo, useState } from "react";
import { MetricCard } from "./metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Footprints, Flame, Droplets, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/index";
import type { HealthEntry } from "@/lib/types/health";

interface HealthOverviewProps {
  viewMode?: string;
  userEmail: string | null;
}

function getLatestByType(entries: HealthEntry[], type: string) {
  return entries
    .filter((e) => e.type === type)
    .sort((a, b) => b.createdAt - a.createdAt)[0];
}

function buildWeeklyData(entries: HealthEntry[]) {
  const sorted = [...entries].sort((a, b) => a.createdAt - b.createdAt);
  const uniqueDates = [...new Set(sorted.map((e) => e.createdAt))].slice(-7);
  return uniqueDates.map((date) => {
    const day = new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    const dayEntries = entries.filter((e) => e.createdAt === date);
    const get = (type: string) =>
      dayEntries.find((e) => e.type === type)?.value ?? 0;
    return {
      day,
      sleep: get("sleep"),
      steps: get("steps"),
      calories: get("calories"),
      water: get("water"),
    };
  });
}

const METRICS = [
  {
    key: "sleep",
    color: "#6366f1",
    gradientId: "colorSleep",
    label: "Sleep",
    formatter: (v: number) => `${v}h`,
  },
  {
    key: "steps",
    color: "#10b981",
    gradientId: "colorSteps",
    label: "Steps",
    formatter: (v: number) => `${(v / 1000).toFixed(1)}k`,
  },
  {
    key: "calories",
    color: "#f97316",
    gradientId: "colorCalories",
    label: "Calories",
    formatter: (v: number) => `${v} kcal`,
  },
  {
    key: "water",
    color: "#0ea5e9",
    gradientId: "colorWater",
    label: "Water",
    formatter: (v: number) => `${v}L`,
  },
] as const;

export function HealthOverview({
  viewMode = "grid",
  userEmail,
}: HealthOverviewProps) {
  const allEntries = useSelector(
    (state: RootState) => state.health.entries ?? [],
  );

  // Filter to current user only
  const entries = useMemo(
    () => allEntries.filter((e) => e.userEmail === userEmail),
    [allEntries, userEmail],
  );

  const [selectedMetric, setSelectedMetric] = useState<
    (typeof METRICS)[number]
  >(METRICS[0]);

  const weeklyData = useMemo(() => buildWeeklyData(entries), [entries]);

  const latest = {
    sleep: getLatestByType(entries, "sleep"),
    steps: getLatestByType(entries, "steps"),
    calories: getLatestByType(entries, "calories"),
    water: getLatestByType(entries, "water"),
  };

  const metrics = [
    {
      title: "Sleep",
      value: latest.sleep ? `${latest.sleep.value}h` : "—",
      target: "8h daily goal",
      progress: latest.sleep ? Math.round((latest.sleep.value / 8) * 100) : 0,
      trend: 5,
      icon: Moon,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Steps",
      value: latest.steps ? latest.steps.value.toLocaleString() : "—",
      target: "10,000 daily goal",
      progress: latest.steps
        ? Math.round((latest.steps.value / 10000) * 100)
        : 0,
      trend: 12,
      icon: Footprints,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Calories",
      value: latest.calories ? latest.calories.value.toLocaleString() : "—",
      target: "2,200 daily goal",
      progress: latest.calories
        ? Math.round((latest.calories.value / 2200) * 100)
        : 0,
      trend: -3,
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Water",
      value: latest.water ? `${latest.water.value}L` : "—",
      target: "3L daily goal",
      progress: latest.water ? Math.round((latest.water.value / 3) * 100) : 0,
      trend: 8,
      icon: Droplets,
      color: "text-sky-500",
      bgColor: "bg-sky-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div
        className={
          viewMode === "grid"
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            : "flex flex-col gap-4"
        }
      >
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">Weekly Trends</CardTitle>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500">
            <TrendingUp className="size-4" />
            <span className="font-medium">Overall improving</span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id={selectedMetric.gradientId}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={selectedMetric.color}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor={selectedMetric.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  formatter={(value: number) => [
                    selectedMetric.formatter(value),
                    selectedMetric.label,
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric.key}
                  stroke={selectedMetric.color}
                  strokeWidth={3}
                  fill={`url(#${selectedMetric.gradientId})`}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 border-t border-border pt-4">
            {METRICS.map((metric) => {
              const active = selectedMetric.key === metric.key;
              return (
                <button
                  key={metric.key}
                  type="button"
                  onClick={() => setSelectedMetric(metric)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all ${
                    active
                      ? "border-border bg-muted text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: metric.color }}
                  />
                  <span>{metric.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

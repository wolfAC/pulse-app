"use client";

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

const weeklyData = [
  { day: "Mon", sleep: 7.2, steps: 8500, calories: 2100, water: 2.4 },
  { day: "Tue", sleep: 6.8, steps: 9200, calories: 1950, water: 2.8 },
  { day: "Wed", sleep: 7.5, steps: 7800, calories: 2200, water: 2.2 },
  { day: "Thu", sleep: 8.0, steps: 10200, calories: 2050, water: 3.0 },
  { day: "Fri", sleep: 6.5, steps: 6500, calories: 2400, water: 2.0 },
  { day: "Sat", sleep: 8.5, steps: 12000, calories: 1800, water: 2.6 },
  { day: "Sun", sleep: 7.8, steps: 8432, calories: 1845, water: 2.5 },
];

const metrics = [
  {
    title: "Sleep",
    value: "7h 32m",
    target: "8h daily goal",
    progress: 94,
    trend: 5,
    icon: Moon,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    title: "Steps",
    value: "8,432",
    target: "10,000 daily goal",
    progress: 84,
    trend: 12,
    icon: Footprints,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Calories",
    value: "1,845",
    target: "2,200 daily goal",
    progress: 84,
    trend: -3,
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Water",
    value: "2.5L",
    target: "3L daily goal",
    progress: 83,
    trend: 8,
    icon: Droplets,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
];

export function HealthOverview({ viewMode = "grid" }) {
  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
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

      {/* Weekly Trends Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">Weekly Trends</CardTitle>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500">
            <TrendingUp className="size-4" />
            <span className="font-medium">Overall improving</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-50 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-2))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-2))"
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
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Area
                  type="monotone"
                  dataKey="steps"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  fill="url(#colorSteps)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-indigo-500" />
              <span className="text-xs text-muted-foreground">Sleep</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Steps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-orange-500" />
              <span className="text-xs text-muted-foreground">Calories</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-sky-500" />
              <span className="text-xs text-muted-foreground">Water</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

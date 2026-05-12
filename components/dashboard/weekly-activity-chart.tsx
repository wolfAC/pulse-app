"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { RootState } from "@/store";

export function WeeklyActivityChart() {
  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );
  const allWorkouts = useSelector(
    (state: RootState) => state.health.workouts ?? [],
  );
  const workouts = useMemo(
    () => allWorkouts.filter((w) => w.userEmail === currentEmail),
    [allWorkouts, currentEmail],
  );

  // Build last-7-days chart data from workouts
  const sorted = [...workouts].sort((a, b) => b.createdAt - a.createdAt);
  const last7 = sorted.slice(0, 7).reverse();
  const prev7 = sorted.slice(7, 14);

  const totalHours = last7.reduce((sum, w) => sum + w.duration, 0) / 60;
  const prevHours = prev7.reduce((sum, w) => sum + w.duration, 0) / 60;
  const percentChange =
    prevHours > 0 ? ((totalHours - prevHours) / prevHours) * 100 : 0;
  const isPositive = percentChange >= 0;

  const data = last7.map((w) => ({
    name: new Date(w.createdAt).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    productivity: w.caloriesBurned ?? 0,
    focus: w.duration ?? 0,
  }));

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Weekly Activity
          </CardTitle>
          <CardDescription className="mt-1 flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">
              {totalHours.toFixed(1)}h
            </span>
            {prevHours > 0 && (
              <Badge
                variant="secondary"
                className={`gap-1 ${isPositive ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"}`}
              >
                {isPositive ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {isPositive ? "+" : ""}
                {percentChange.toFixed(1)}%
              </Badge>
            )}
          </CardDescription>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg bg-chart-1/10">
          <BarChart3 className="size-5 text-chart-1" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-50 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="colorProductivity"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="oklch(0.65 0.2 250)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.65 0.2 250)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.65 0.15 165)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.65 0.15 165)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.22 0 0)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.55 0 0)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.55 0 0)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.12 0 0)",
                  border: "1px solid oklch(0.22 0 0)",
                  borderRadius: "8px",
                  color: "oklch(0.95 0 0)",
                }}
                labelStyle={{ color: "oklch(0.95 0 0)" }}
              />
              <Area
                type="monotone"
                dataKey="productivity"
                stroke="oklch(0.65 0.2 250)"
                fillOpacity={1}
                fill="url(#colorProductivity)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="focus"
                stroke="oklch(0.65 0.15 165)"
                fillOpacity={1}
                fill="url(#colorFocus)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-chart-1" />
            <span className="text-muted-foreground">Productivity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-chart-2" />
            <span className="text-muted-foreground">Focus Time</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

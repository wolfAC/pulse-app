"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", productivity: 65, focus: 45 },
  { name: "Tue", productivity: 72, focus: 58 },
  { name: "Wed", productivity: 85, focus: 70 },
  { name: "Thu", productivity: 78, focus: 62 },
  { name: "Fri", productivity: 92, focus: 85 },
  { name: "Sat", productivity: 55, focus: 40 },
  { name: "Sun", productivity: 48, focus: 35 },
];

export function WeeklyActivityChart() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Weekly Activity
          </CardTitle>
          <CardDescription className="mt-1 flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">42.5h</span>
            <Badge
              variant="secondary"
              className="bg-accent/20 text-accent gap-1"
            >
              <TrendingUp className="size-3" />
              +8.2%
            </Badge>
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

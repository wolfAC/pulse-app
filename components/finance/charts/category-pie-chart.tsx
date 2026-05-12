"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface CategoryPieChartProps {
  data: { category: string; amount: number }[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const COLORS = [
  "#6366f1", // indigo
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
];

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const chartData = useMemo(() => {
    const top5 = data.slice(0, 5);
    const othersTotal = data
      .slice(5)
      .reduce((sum, item) => sum + item.amount, 0);
    return othersTotal > 0
      ? [...top5, { category: "Others", amount: othersTotal }]
      : top5;
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-75 items-center justify-center text-sm text-muted-foreground">
        No expense data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <defs>
          {COLORS.map((color, i) => (
            <radialGradient
              key={i}
              id={`pieGrad${i}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor={color} stopOpacity={0.9} />
              <stop offset="100%" stopColor={color} stopOpacity={0.7} />
            </radialGradient>
          ))}
        </defs>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="amount"
          nameKey="category"
          strokeWidth={0}
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={`url(#pieGrad${index % COLORS.length})`} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
          formatter={(value: number, name: string) => [fmt(value), name]}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ color: "hsl(var(--foreground))", fontSize: "12px" }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

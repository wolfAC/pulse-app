"use client";

import { Transaction } from "@/lib/types/budgets";
import { useMemo } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const TREND_COLOR = "#6366f1";

export function SpendingTrendChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const data = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const dateStr = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
      const amount = transactions
        .filter((t) => t.type === "expense" && t.date === dateStr)
        .reduce((s, t) => s + t.amount, 0);
      return { date: dateStr, label, amount };
    });
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={TREND_COLOR} stopOpacity={0.25} />
            <stop offset="95%" stopColor={TREND_COLOR} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          interval="preserveStartEnd"
          tickMargin={8}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
          formatter={(value: number) => [fmt(value), "Spending"]}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke={TREND_COLOR}
          strokeWidth={2.5}
          fill="url(#trendGrad)"
          dot={false}
          activeDot={{ r: 5, strokeWidth: 0, fill: TREND_COLOR }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

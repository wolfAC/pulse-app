"use client";

import { Transaction } from "@/lib/types/finance";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const INCOME_COLOR = "#10b981";
const EXPENSE_COLOR = "#f43f5e";

export function OverviewChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const data = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));

      const month = d.toISOString().slice(0, 7);

      const label = d.toLocaleString("en-IN", {
        month: "short",
      });

      const monthTx = transactions.filter((t) => {
        const txMonth = new Date(t.createdAt).toISOString().slice(0, 7);

        return txMonth === month;
      });

      return {
        month: label,

        income: monthTx
          .filter((t) => t.type === "income")
          .reduce((s, t) => s + t.amount, 0),

        expenses: monthTx
          .filter((t) => t.type === "expense")
          .reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barGap={4}>
        <defs>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={INCOME_COLOR} stopOpacity={1} />
            <stop offset="100%" stopColor={INCOME_COLOR} stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={EXPENSE_COLOR} stopOpacity={1} />
            <stop offset="100%" stopColor={EXPENSE_COLOR} stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
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
          formatter={(value: number, name: string) => [
            fmt(value),
            name === "income" ? "Income" : "Expenses",
          ]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ color: "hsl(var(--foreground))", fontSize: "12px" }}>
              {value === "income" ? "Income" : "Expenses"}
            </span>
          )}
        />
        <Bar
          dataKey="income"
          name="income"
          fill="url(#incomeGrad)"
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
        <Bar
          dataKey="expenses"
          name="expenses"
          fill="url(#expenseGrad)"
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

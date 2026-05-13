"use client";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RootState } from "@/store/index";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function SpendingTrendChart() {
  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );
  const allTransactions = useSelector(
    (state: RootState) => state.finance.transactions ?? [],
  );

  const { data, totalIncome, totalExpenses } = useMemo(() => {
    const userTx = allTransactions.filter(
      (tx) => tx.userEmail === currentEmail,
    );

    // Build last 6 months
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return d.toISOString().slice(0, 7);
    });

    const data = months.map((month) => {
      const monthTx = userTx.filter((tx) => {
        const txMonth = new Date(tx.createdAt).toISOString().slice(0, 7);

        return txMonth === month;
      });
      const income = monthTx
        .filter((tx) => tx.type === "income")
        .reduce((s, tx) => s + tx.amount, 0);
      const expenses = monthTx
        .filter((tx) => tx.type === "expense")
        .reduce((s, tx) => s + tx.amount, 0);
      const [year, m] = month.split("-");
      const label = new Date(+year, +m - 1).toLocaleString("en-IN", {
        month: "short",
      });
      return { name: label, income, expenses };
    });

    const totalIncome = data.reduce((s, d) => s + d.income, 0);
    const totalExpenses = data.reduce((s, d) => s + d.expenses, 0);
    return { data, totalIncome, totalExpenses };
  }, [allTransactions, currentEmail]);

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Income vs Expenses
          </CardTitle>
          <CardDescription className="mt-1 flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">
              {fmt(totalIncome)}
            </span>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 gap-1"
            >
              <TrendingUp className="size-3" />
              6-month
            </Badge>
          </CardDescription>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg bg-chart-1/10">
          <BarChart3 className="size-5 text-chart-1" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
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
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.65 0.2 25)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.65 0.2 25)"
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
                tick={{ fill: "oklch(0.55 0 0)", fontSize: 11 }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => fmt(value)}
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
                dataKey="income"
                stroke="oklch(0.65 0.15 165)"
                fill="url(#colorIncome)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="oklch(0.65 0.2 25)"
                fill="url(#colorExpenses)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-orange-400" />
            <span className="text-muted-foreground">Expenses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

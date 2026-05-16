"use client";

import { CategoryPieChart } from "@/components/finance/charts/category-pie-chart";
import { OverviewChart } from "@/components/finance/charts/overview-chart";
import { SpendingTrendChart } from "@/components/finance/charts/spending-trend-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RootState } from "@/store/index";
import { cn } from "@/lib/utils";
import {
  TrendingDown,
  TrendingUp,
  ArrowLeftRight,
  PiggyBank,
} from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useIsMobile } from "@/hooks/use-mobile";

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtCompact = (n: number) => {
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${Math.round(n)}`;
};

// ─── Summary strip (mobile) ───────────────────────────────────────────────────

function SummaryStrip({
  thisMonthExpenses,
  thisMonthIncome,
  expenseChange,
  incomeChange,
  savingsRate,
  saved,
}: {
  thisMonthExpenses: number;
  thisMonthIncome: number;
  expenseChange: number;
  incomeChange: number;
  savingsRate: number;
  saved: number;
}) {
  const cells = [
    {
      icon: TrendingDown,
      label: "Spending",
      value: fmtCompact(thisMonthExpenses),
      sub: `${expenseChange > 0 ? "+" : ""}${expenseChange.toFixed(1)}% vs last`,
      color: "text-destructive",
      subColor: expenseChange <= 0 ? "text-green-600" : "text-destructive",
    },
    {
      icon: TrendingUp,
      label: "Income",
      value: fmtCompact(thisMonthIncome),
      sub: `${incomeChange > 0 ? "+" : ""}${incomeChange.toFixed(1)}% vs last`,
      color: "text-green-600",
      subColor: incomeChange >= 0 ? "text-green-600" : "text-destructive",
    },
    {
      icon: PiggyBank,
      label: "Saved",
      value: fmtCompact(Math.abs(saved)),
      sub: `${Math.round(savingsRate)}% rate`,
      color: saved >= 0 ? "text-green-600" : "text-destructive",
      subColor: "text-muted-foreground",
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-3 divide-x divide-border">
          {cells.map(({ icon: Icon, label, value, sub, color, subColor }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-0.5 p-3 text-center"
            >
              <Icon className="h-3.5 w-3.5 text-muted-foreground mb-0.5" />
              <p className="text-[11px] text-muted-foreground leading-none">
                {label}
              </p>
              <p className={cn("text-base font-bold leading-tight", color)}>
                {value}
              </p>
              <p className={cn("text-[10px] leading-none mt-0.5", subColor)}>
                {sub}
              </p>
            </div>
          ))}
        </div>
        {/* Savings rate bar */}
        <div className="px-4 pb-3 pt-1">
          <Progress
            value={Math.max(0, Math.min(savingsRate, 100))}
            className={cn("h-1.5", savingsRate < 0 && "[&>div]:bg-destructive")}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BudgetAnalytics() {
  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );
  const allTransactions = useSelector(
    (state: RootState) => state.finance.transactions ?? [],
  );
  const isMobile = useIsMobile();

  const transactions = useMemo(
    () => allTransactions.filter((tx) => tx.userEmail === currentEmail),
    [allTransactions, currentEmail],
  );

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1)
      .toISOString()
      .slice(0, 7);

    const thisMonthTx = transactions.filter((t) => {
      const date = new Date(t.createdAt);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      return month === currentMonth;
    });

    const lastMonthTx = transactions.filter((t) => {
      const date = new Date(t.createdAt);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      return month === prevMonth;
    });

    const sum = (txs: typeof transactions, type: "income" | "expense") =>
      txs.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);

    const thisMonthExpenses = sum(thisMonthTx, "expense");
    const lastMonthExpenses = sum(lastMonthTx, "expense");
    const thisMonthIncome = sum(thisMonthTx, "income");
    const lastMonthIncome = sum(lastMonthTx, "income");

    const expenseChange =
      lastMonthExpenses > 0
        ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
        : 0;

    const incomeChange =
      lastMonthIncome > 0
        ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100
        : 0;

    const avgTransaction =
      thisMonthTx.length > 0
        ? thisMonthTx.reduce((s, t) => s + t.amount, 0) / thisMonthTx.length
        : 0;

    const savingsRate =
      thisMonthIncome > 0
        ? ((thisMonthIncome - thisMonthExpenses) / thisMonthIncome) * 100
        : 0;

    return {
      thisMonthExpenses,
      thisMonthIncome,
      expenseChange,
      incomeChange,
      avgTransaction,
      transactionCount: thisMonthTx.length,
      savingsRate,
      saved: thisMonthIncome - thisMonthExpenses,
    };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const map: Record<string, number> = {};
    transactions
      .filter((t) => {
        const txMonth = new Date(t.createdAt).toISOString().slice(0, 7);
        return t.type === "expense" && txMonth === currentMonth;
      })
      .forEach((t) => {
        map[t.category] = (map[t.category] ?? 0) + t.amount;
      });
    return Object.entries(map)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const topCategories = categoryData.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary — strip on mobile, 4-card grid on desktop */}
      {isMobile ? (
        <SummaryStrip {...stats} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>This Month's Spending</CardDescription>
              <CardTitle className="text-2xl">
                {fmt(stats.thisMonthExpenses)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-sm ${stats.expenseChange <= 0 ? "text-green-600" : "text-destructive"}`}
              >
                {stats.expenseChange > 0 ? "+" : ""}
                {stats.expenseChange.toFixed(1)}% vs last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>This Month's Income</CardDescription>
              <CardTitle className="text-2xl">
                {fmt(stats.thisMonthIncome)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-sm ${stats.incomeChange >= 0 ? "text-green-600" : "text-destructive"}`}
              >
                {stats.incomeChange > 0 ? "+" : ""}
                {stats.incomeChange.toFixed(1)}% vs last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Transaction</CardDescription>
              <CardTitle className="text-2xl">
                {fmt(stats.avgTransaction)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {stats.transactionCount} transactions this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Savings Rate</CardDescription>
              <CardTitle className="text-2xl">
                {Math.round(stats.savingsRate)}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {fmt(stats.saved)} saved
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>
              6-month comparison of your cash flow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OverviewChart transactions={transactions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Where your money goes</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={categoryData} />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spending Trend</CardTitle>
            <CardDescription>
              Daily spending pattern over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SpendingTrendChart transactions={transactions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Spending Categories</CardTitle>
            <CardDescription>Your biggest expense areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No expense data yet
                </p>
              ) : (
                topCategories.map((cat, index) => (
                  <div key={cat.category} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {cat.category}
                      </p>
                    </div>
                    <div className="text-right font-semibold text-foreground">
                      {fmt(cat.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

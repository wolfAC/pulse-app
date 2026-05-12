"use client";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RootState } from "@/store/index";

export function FinanceScoreCard() {
  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );
  const allTransactions = useSelector(
    (state: RootState) => state.finance.transactions ?? [],
  );

  const currentMonth = new Date().toISOString().slice(0, 7);
  const prevMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString()
    .slice(0, 7);

  const { score, trend, trendPositive, savingsRate } = useMemo(() => {
    const userTx = allTransactions.filter(
      (tx) => tx.userEmail === currentEmail,
    );

    const calc = (month: string) => {
      const monthTx = userTx.filter((tx) => tx.date.startsWith(month));
      const income = monthTx
        .filter((tx) => tx.type === "income")
        .reduce((s, tx) => s + tx.amount, 0);
      const expenses = monthTx
        .filter((tx) => tx.type === "expense")
        .reduce((s, tx) => s + tx.amount, 0);
      return { income, expenses };
    };

    const curr = calc(currentMonth);
    const prev = calc(prevMonth);

    const savingsRate =
      curr.income > 0
        ? Math.round(((curr.income - curr.expenses) / curr.income) * 100)
        : 0;

    // Score: 0–100 based on savings rate (50%+ = 100, 0% = 0, negative = penalised)
    const score = Math.max(0, Math.min(100, savingsRate * 2));

    const prevSavings =
      prev.income > 0
        ? Math.round(((prev.income - prev.expenses) / prev.income) * 100)
        : 0;
    const trend = prevSavings !== 0 ? savingsRate - prevSavings : 0;

    return { score, trend, trendPositive: trend >= 0, savingsRate };
  }, [allTransactions, currentEmail, currentMonth, prevMonth]);

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-green-500/10 via-transparent to-transparent" />
      <CardHeader className="relative flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Finance Score
        </CardTitle>
        <div className="flex size-9 items-center justify-center rounded-lg bg-green-500/10">
          <Wallet className="size-5 text-green-600" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight">{score}</span>
          <span className="text-lg text-muted-foreground">/100</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Badge
            variant="secondary"
            className={`${trendPositive ? "bg-green-100 text-green-700" : "bg-destructive/20 text-destructive"} gap-1`}
          >
            {trendPositive ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {trendPositive ? "+" : ""}
            {trend}pp
          </Badge>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Savings rate this month:{" "}
          <span className="font-semibold text-foreground">{savingsRate}%</span>
        </p>
      </CardContent>
    </Card>
  );
}

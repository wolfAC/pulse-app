"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RootState } from "@/store/index";
import { deleteBudget } from "@/store/slices/finance";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Pencil,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BudgetDialog } from "./budget-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

/** Compact: ₹1.2L / ₹45K / ₹800 — used inside the narrow summary strip */
const fmtCompact = (n: number) => {
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface BudgetsOverviewProps {
  viewMode: string;
  userEmail: string | null;
  onAddBudget: () => void;
}

// ─── Summary strip ────────────────────────────────────────────────────────────

function SummaryStrip({
  totalBudget,
  totalSpent,
  overBudgetCount,
}: {
  totalBudget: number;
  totalSpent: number;
  overBudgetCount: number;
}) {
  const remaining = totalBudget - totalSpent;
  const pct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const cells = [
    {
      icon: Wallet,
      label: "Budget",
      value: fmtCompact(totalBudget),
      sub: "this month",
      color: "text-foreground",
    },
    {
      icon: TrendingDown,
      label: "Spent",
      value: fmtCompact(totalSpent),
      sub: `${pct.toFixed(0)}% used`,
      color: pct >= 100 ? "text-destructive" : "text-foreground",
    },
    {
      icon: TrendingUp,
      label: remaining >= 0 ? "Left" : "Over",
      value: fmtCompact(Math.abs(remaining)),
      sub: overBudgetCount > 0 ? `${overBudgetCount} over limit` : "on track",
      color: remaining >= 0 ? "text-green-600" : "text-destructive",
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-3 divide-x divide-border">
          {cells.map(({ icon: Icon, label, value, sub, color }) => (
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
              <p className="text-[10px] text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
        <div className="px-4 pb-3 pt-1">
          <Progress
            value={Math.min(pct, 100)}
            className={cn(
              "h-1.5",
              pct >= 100 && "[&>div]:bg-destructive",
              pct >= 80 && pct < 100 && "[&>div]:bg-amber-500",
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BudgetsOverview({
  viewMode,
  userEmail,
  onAddBudget,
}: BudgetsOverviewProps) {
  const dispatch = useDispatch();
  const allBudgets = useSelector((state: RootState) => state.finance.budgets);
  const allTransactions = useSelector(
    (state: RootState) => state.finance.transactions,
  );
  const isMobile = useIsMobile();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const budgets = useMemo(
    () =>
      allBudgets.filter(
        (b) => b.userEmail === userEmail && b.month === currentMonth,
      ),
    [allBudgets, userEmail, currentMonth],
  );

  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    allTransactions
      .filter((tx) => {
        const txMonth = new Date(tx.createdAt).toISOString().slice(0, 7);
        return (
          tx.userEmail === userEmail &&
          tx.type === "expense" &&
          txMonth === currentMonth
        );
      })
      .forEach((tx) => {
        map[tx.category] = (map[tx.category] ?? 0) + tx.amount;
      });
    return map;
  }, [allTransactions, userEmail, currentMonth]);

  const enriched = useMemo(
    () =>
      budgets.map((b) => ({ ...b, spent: spentByCategory[b.category] ?? 0 })),
    [budgets, spentByCategory],
  );

  const stats = useMemo(() => {
    const totalBudget = enriched.reduce((s, b) => s + b.limit, 0);
    const totalSpent = enriched.reduce((s, b) => s + b.spent, 0);
    const overBudgetCount = enriched.filter((b) => b.spent > b.limit).length;
    return { totalBudget, totalSpent, overBudgetCount };
  }, [enriched]);

  const openEdit = (id: string) => {
    setEditingBudgetId(id);
    setEditDialogOpen(true);
  };

  const overAlert = stats.overBudgetCount > 0 && (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        {stats.overBudgetCount} budget
        {stats.overBudgetCount > 1 ? "s have" : " has"} exceeded the limit this
        month.
      </AlertDescription>
    </Alert>
  );

  // ── LIST MODE ──────────────────────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {overAlert}

        <SummaryStrip {...stats} />

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Budgets — {currentMonth}</CardTitle>
              <Button variant="link" onClick={onAddBudget}>
                Add budget
              </Button>
            </div>
            <CardDescription>
              {fmt(stats.totalSpent)} spent of {fmt(stats.totalBudget)} budgeted
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 pt-0">
            {enriched.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No budgets set for this month.
              </p>
            ) : (
              enriched.map((b) => {
                const pct = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
                const over = pct > 100;
                return (
                  <div
                    key={b.id}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg px-2 py-2 hover:bg-muted/50 transition-colors"
                  >
                    {/* Category + mobile actions */}
                    <div className="flex w-full items-center gap-2 sm:w-28 sm:shrink-0">
                      <span className="flex-1 truncate text-sm font-medium">
                        {b.category}
                      </span>
                      <div className="flex gap-0.5 sm:hidden shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => openEdit(b.id)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => dispatch(deleteBudget(b.id))}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Progress */}
                    <Progress
                      value={Math.min(pct, 100)}
                      className={cn(
                        "h-2 w-full sm:flex-1",
                        over && "[&>div]:bg-destructive",
                      )}
                    />

                    {/* Amounts */}
                    <div
                      className={cn(
                        "w-full text-sm sm:w-32 sm:shrink-0 sm:text-right",
                        over ? "text-destructive" : "text-muted-foreground",
                      )}
                    >
                      {fmt(b.spent)} / {fmt(b.limit)}
                    </div>

                    {/* Desktop actions */}
                    <div className="hidden sm:flex gap-0.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEdit(b.id)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => dispatch(deleteBudget(b.id))}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <BudgetDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          editingBudgetId={editingBudgetId}
        />
      </div>
    );
  }

  // ── GRID MODE ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {overAlert}

      {/* Summary — conditionally rendered based on screen size */}
      {isMobile ? (
        <SummaryStrip {...stats} />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold">{fmt(stats.totalBudget)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">{fmt(stats.totalSpent)}</p>
              <Progress
                value={
                  stats.totalBudget > 0
                    ? (stats.totalSpent / stats.totalBudget) * 100
                    : 0
                }
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p
                className={cn(
                  "text-2xl font-bold",
                  stats.totalBudget - stats.totalSpent >= 0
                    ? "text-green-600"
                    : "text-destructive",
                )}
              >
                {fmt(Math.abs(stats.totalBudget - stats.totalSpent))}
                {stats.totalBudget - stats.totalSpent < 0 && (
                  <span className="text-sm font-normal ml-1">over</span>
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Budget cards — original design */}
      {enriched.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No budgets set for {currentMonth}.
            </p>
            <Button variant="link" onClick={onAddBudget}>
              Add your first Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {enriched.map((b) => {
            const pct = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
            const over = pct > 100;
            const remaining = b.limit - b.spent;
            return (
              <Card
                key={b.id}
                className={cn(
                  "transition-colors",
                  over && "border-destructive/50",
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{b.category}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(b.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => dispatch(deleteBudget(b.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{b.month}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spent</span>
                      <span
                        className={cn(
                          "font-medium",
                          over ? "text-destructive" : "text-foreground",
                        )}
                      >
                        {fmt(b.spent)} / {fmt(b.limit)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(pct, 100)}
                      className={cn("h-3", over && "[&>div]:bg-destructive")}
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={cn(
                          "font-medium",
                          over ? "text-destructive" : "text-green-600",
                        )}
                      >
                        {over ? "−" : "+"}
                        {fmt(Math.abs(remaining))}
                      </span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          over
                            ? "bg-destructive/10 text-destructive"
                            : pct >= 80
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700",
                        )}
                      >
                        {pct.toFixed(0)}% used
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <BudgetDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editingBudgetId={editingBudgetId}
      />
    </div>
  );
}

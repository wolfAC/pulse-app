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
import { deleteBudget } from "@/store/slices/budgets";
import { cn } from "@/lib/utils";
import { AlertTriangle, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BudgetDialog } from "./budget-dialog";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

interface BudgetsOverviewProps {
  viewMode: string;
  userEmail: string | null;
  onAddBudget: () => void;
}

export function BudgetsOverview({
  viewMode,
  userEmail,
  onAddBudget,
}: BudgetsOverviewProps) {
  const dispatch = useDispatch();
  const allBudgets = useSelector((state: RootState) => state.budgets.budgets);
  const allTransactions = useSelector(
    (state: RootState) => state.budgets.transactions,
  );

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
      .filter(
        (tx) =>
          tx.userEmail === userEmail &&
          tx.type === "expense" &&
          tx.date.startsWith(currentMonth),
      )
      .forEach((tx) => {
        map[tx.category] = (map[tx.category] ?? 0) + tx.amount;
      });
    return map;
  }, [allTransactions, userEmail, currentMonth]);

  const enriched = useMemo(
    () =>
      budgets.map((b) => ({
        ...b,
        spent: spentByCategory[b.category] ?? 0,
      })),
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

  // List mode: table-style rows
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {stats.overBudgetCount > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {stats.overBudgetCount} budget
              {stats.overBudgetCount > 1 ? "s have" : " has"} exceeded the limit
              this month.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Budgets — {currentMonth}</CardTitle>
              <Button size="sm" variant="outline" onClick={onAddBudget}>
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add
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
                    className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-28 shrink-0 text-sm font-medium truncate">
                      {b.category}
                    </div>
                    <Progress
                      value={Math.min(pct, 100)}
                      className={cn(
                        "flex-1 h-2",
                        over && "[&>div]:bg-destructive",
                      )}
                    />
                    <div
                      className={cn(
                        "w-32 shrink-0 text-right text-sm",
                        over ? "text-destructive" : "text-muted-foreground",
                      )}
                    >
                      {fmt(b.spent)} / {fmt(b.limit)}
                    </div>
                    <div className="flex gap-0.5 shrink-0">
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

  // Grid mode (default)
  return (
    <div className="space-y-4">
      {stats.overBudgetCount > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {stats.overBudgetCount} budget
            {stats.overBudgetCount > 1 ? "s have" : " has"} exceeded the limit
            this month.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary row */}
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

      {/* Budget cards */}
      {enriched.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No budgets set for {currentMonth}.
            </p>
            <Button onClick={onAddBudget}>
              <Plus className="mr-2 h-4 w-4" />
              Create Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {over ? "Over budget" : "Remaining"}
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          over ? "text-destructive" : "text-green-600",
                        )}
                      >
                        {over && "−"}
                        {fmt(Math.abs(remaining))}
                      </span>
                    </div>
                    <div className="flex justify-end">
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

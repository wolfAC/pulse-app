"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RootState } from "@/store/index";
import { deleteSavingsGoal, updateSavingsGoal } from "@/store/slices/finance";
import { cn } from "@/lib/utils";
import { Pencil, Plus, PiggyBank, Target, Trash2, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { ICON_MAP, SavingsGoalDialog } from "./saving-dialog";
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
  return `₹${n}`;
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// ─── Summary strip (mobile) ───────────────────────────────────────────────────

function SummaryStrip({
  totalSaved,
  totalTarget,
  completed,
  total,
}: {
  totalSaved: number;
  totalTarget: number;
  completed: number;
  total: number;
}) {
  const pct = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const cells = [
    {
      icon: PiggyBank,
      label: "Saved",
      value: fmtCompact(totalSaved),
      color: "text-green-600",
    },
    {
      icon: Target,
      label: "Target",
      value: fmtCompact(totalTarget),
      color: "text-foreground",
    },
    {
      icon: Trophy,
      label: "Done",
      value: `${completed}/${total}`,
      color: "text-primary",
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-3 divide-x divide-border">
          {cells.map(({ icon: Icon, label, value, color }) => (
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
            </div>
          ))}
        </div>
        <div className="px-4 pb-3 pt-1">
          <Progress value={Math.min(pct, 100)} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SavingsSectionProps {
  viewMode: string;
  userEmail: string | null;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SavingsSection({ viewMode, userEmail }: SavingsSectionProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const allGoals = useSelector(
    (state: RootState) => state.finance.savingsGoals,
  );
  const isMobile = useIsMobile();

  const [contributionGoalId, setContributionGoalId] = useState<string | null>(
    null,
  );
  const [contributionAmount, setContributionAmount] = useState("");

  const savingsGoals = useMemo(
    () => allGoals.filter((g) => g.userEmail === userEmail),
    [allGoals, userEmail],
  );

  const stats = useMemo(() => {
    const totalTarget = savingsGoals.reduce((s, g) => s + g.targetAmount, 0);
    const totalSaved = savingsGoals.reduce((s, g) => s + g.currentAmount, 0);
    const completed = savingsGoals.filter(
      (g) => g.currentAmount >= g.targetAmount,
    ).length;
    return { totalTarget, totalSaved, completed, total: savingsGoals.length };
  }, [savingsGoals]);

  const handleContribution = (goalId: string) => {
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) return;
    const goal = savingsGoals.find((g) => g.id === goalId);
    if (goal) {
      dispatch(
        updateSavingsGoal({
          ...goal,
          currentAmount: goal.currentAmount + amount,
        }),
      );
    }
    setContributionGoalId(null);
    setContributionAmount("");
  };

  const isGrid = viewMode === "grid";

  return (
    <div className="space-y-4">
      {/* Summary — strip on mobile, 3 cards on desktop */}
      {isMobile ? (
        <SummaryStrip {...stats} />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Saved</p>
              <p className="text-2xl font-bold text-green-600">
                {fmt(stats.totalSaved)}
              </p>
              <Progress
                value={
                  stats.totalTarget > 0
                    ? (stats.totalSaved / stats.totalTarget) * 100
                    : 0
                }
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Target</p>
              <p className="text-2xl font-bold">{fmt(stats.totalTarget)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Goals Completed</p>
              <p className="text-2xl font-bold text-primary">
                {stats.completed} / {stats.total}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Goals */}
      {savingsGoals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No savings goals yet. Create one to start saving.
            </p>
            <Button onClick={() => router.push("/finance/savings/add")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            "gap-4",
            isGrid ? "grid md:grid-cols-2 lg:grid-cols-3" : "flex flex-col",
          )}
        >
          {savingsGoals.map((goal) => {
            const pct =
              goal.targetAmount > 0
                ? (goal.currentAmount / goal.targetAmount) * 100
                : 0;
            const isCompleted = pct >= 100;
            const remaining = goal.targetAmount - goal.currentAmount;
            const Icon = ICON_MAP[(goal as any).icon ?? "Target"] ?? Target;

            return (
              <Card
                key={goal.id}
                className={cn(
                  "transition-colors",
                  isCompleted && "border-green-500/50 bg-green-50/30",
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          isCompleted
                            ? "bg-green-100 text-green-600"
                            : "bg-primary/10 text-primary",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {goal.title}
                        </CardTitle>
                        {goal.deadline && (
                          <CardDescription>
                            Due {fmtDate(goal.deadline)}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() =>
                          router.push(`/finance/savings/edit/${goal.id}`)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => dispatch(deleteSavingsGoal(goal.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span
                        className={cn(
                          "font-medium",
                          isCompleted ? "text-green-600" : "text-foreground",
                        )}
                      >
                        {Math.min(pct, 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.min(pct, 100)}
                      className={cn(
                        "h-3",
                        isCompleted && "[&>div]:bg-green-500",
                      )}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{fmt(goal.currentAmount)}</span>
                      <span>{fmt(goal.targetAmount)}</span>
                    </div>

                    {isCompleted ? (
                      <p className="text-center text-sm font-medium text-green-600">
                        🎉 Goal Achieved!
                      </p>
                    ) : (
                      <>
                        <p className="text-center text-sm text-muted-foreground">
                          {fmt(remaining)} to go
                        </p>
                        {contributionGoalId === goal.id ? (
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="Amount"
                              value={contributionAmount}
                              onChange={(e) =>
                                setContributionAmount(e.target.value)
                              }
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleContribution(goal.id)}
                            >
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setContributionGoalId(null);
                                setContributionAmount("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setContributionGoalId(goal.id)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Contribution
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

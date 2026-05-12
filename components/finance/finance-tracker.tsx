"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState } from "@/store/index";
import { LayoutGrid, List, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BudgetDialog } from "./budget-dialog";
import { TransactionDialog } from "./transactions-dialog";
import { BudgetsOverview } from "./finance-overview";
import { TransactionsSection } from "./finance-transaction";
import { SavingsSection } from "./finance-savings";
import BudgetAnalytics from "./finance-analytics";

export function FinanceTracker() {
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("grid");

  // Dialog state — only one dialog open at a time
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [txDialogOpen, setTxDialogOpen] = useState(false);

  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );
  const allTransactions = useSelector(
    (state: RootState) => state.finance.transactions,
  );
  const allBudgets = useSelector((state: RootState) => state.finance.budgets);
  const allGoals = useSelector(
    (state: RootState) => state.finance.savingsGoals,
  );

  const currentMonth = new Date().toISOString().slice(0, 7);

  // Scope to current user
  const transactions = useMemo(
    () => allTransactions.filter((tx) => tx.userEmail === currentEmail),
    [allTransactions, currentEmail],
  );
  const budgets = useMemo(
    () =>
      allBudgets.filter(
        (b) => b.userEmail === currentEmail && b.month === currentMonth,
      ),
    [allBudgets, currentEmail, currentMonth],
  );
  const savingsGoals = useMemo(
    () => allGoals.filter((g) => g.userEmail === currentEmail),
    [allGoals, currentEmail],
  );

  // Derived stats (shown in the top summary card)
  const stats = useMemo(() => {
    const monthTx = transactions.filter((tx) =>
      tx.date.startsWith(currentMonth),
    );

    const income = monthTx
      .filter((tx) => tx.type === "income")
      .reduce((s, tx) => s + tx.amount, 0);

    const expenses = monthTx
      .filter((tx) => tx.type === "expense")
      .reduce((s, tx) => s + tx.amount, 0);

    const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
    const overBudgetCount = budgets.filter((b) => {
      const spent = monthTx
        .filter((tx) => tx.type === "expense" && tx.category === b.category)
        .reduce((s, tx) => s + tx.amount, 0);
      return spent > b.limit;
    }).length;

    const totalSaved = savingsGoals.reduce((s, g) => s + g.currentAmount, 0);

    return {
      income: income ? `₹${income.toLocaleString("en-IN")}` : "—",
      expenses: expenses ? `₹${expenses.toLocaleString("en-IN")}` : "—",
      budget: totalBudget ? `₹${totalBudget.toLocaleString("en-IN")}` : "—",
      overBudget: overBudgetCount > 0 ? `${overBudgetCount} over` : "On track",
      saved: totalSaved ? `₹${totalSaved.toLocaleString("en-IN")}` : "—",
    };
  }, [transactions, budgets, savingsGoals, currentMonth]);

  // CTA button changes per tab
  const handleAdd = () => {
    if (activeTab === "overview") setBudgetDialogOpen(true);
    else if (activeTab === "transactions") setTxDialogOpen(true);
    else setBudgetDialogOpen(true); // savings uses its own inline button
  };

  const addLabel =
    activeTab === "overview"
      ? "Add Budget"
      : activeTab === "transactions"
        ? "Add Transaction"
        : "Add Goal";

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Finance"
          description="Manage your budgets, transactions and savings"
        />
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Quick Stats Card                                                     */}
      {/* ------------------------------------------------------------------ */}
      <Card>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 px-6 py-4">
          <Stat label="Income (month)" value={stats.income} />
          <Stat label="Expenses (month)" value={stats.expenses} />
          <Stat label="Budget set" value={stats.budget} />
          <Stat label="Budget status" value={stats.overBudget} />
          <Stat label="Total saved" value={stats.saved} />
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Tabs + View toggle                                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Budgets</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-1 rounded-lg border p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="gap-1.5"
          >
            <LayoutGrid className="size-4" />
            <span className="sr-only sm:not-sr-only">Grid</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="gap-1.5"
          >
            <List className="size-4" />
            <span className="sr-only sm:not-sr-only">List</span>
          </Button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Tab content                                                          */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "overview" && (
        <BudgetsOverview
          viewMode={viewMode}
          userEmail={currentEmail}
          onAddBudget={() => setBudgetDialogOpen(true)}
        />
      )}
      {activeTab === "transactions" && (
        <TransactionsSection
          viewMode={viewMode}
          userEmail={currentEmail}
          onAddTransaction={() => setTxDialogOpen(true)}
        />
      )}
      {activeTab === "savings" && (
        <SavingsSection viewMode={viewMode} userEmail={currentEmail} />
      )}

      {activeTab === "analytics" && <BudgetAnalytics />}

      {/* ------------------------------------------------------------------ */}
      {/* Dialogs                                                              */}
      {/* ------------------------------------------------------------------ */}
      <BudgetDialog
        open={budgetDialogOpen}
        onOpenChange={setBudgetDialogOpen}
      />
      <TransactionDialog open={txDialogOpen} onOpenChange={setTxDialogOpen} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

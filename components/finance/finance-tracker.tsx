"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { RootState } from "@/store/index";
import { LayoutGrid, List, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import BudgetAnalytics from "./finance-analytics";
import { BudgetsOverview } from "./finance-overview";
import { SavingsSection } from "./finance-savings";
import { TransactionsSection } from "./finance-transaction";
import { StatementImportDialog } from "./statement-import-dialog";
export function FinanceTracker() {
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("grid");
  const [stDialogOpen, setStDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const router = useRouter();

  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );

  const handleAdd = () => {
    if (activeTab === "overview") router.push("/finance/budget/add");
    else if (activeTab === "transactions")
      router.push("/finance/transaction/add");
    else router.push("/finance/savings/add");
  };

  const addLabel =
    activeTab === "overview"
      ? "Add Budget"
      : activeTab === "transactions"
        ? "Add Transaction"
        : "Add Goal";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sticky top section */}
      <div className="flex flex-col gap-4">
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

        {/* Tabs + View toggle */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList
              className={`h-auto bg-transparent border p-1 ${
                isMobile ? "w-full" : ""
              }`}
            >
              <TabsTrigger value="overview" className="px-3 py-1.5">
                Budgets
              </TabsTrigger>

              <TabsTrigger value="transactions" className="px-3 py-1.5">
                Transactions
              </TabsTrigger>

              <TabsTrigger value="savings" className="px-3 py-1.5">
                Savings
              </TabsTrigger>

              <TabsTrigger value="analytics" className="px-3 py-1.5">
                Analytics
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {!isMobile && (
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as "grid" | "list")}
            >
              <TabsList className="h-auto bg-transparent border p-1">
                <TabsTrigger value="grid" className="gap-1.5 px-3 py-1.5">
                  <LayoutGrid className="size-4" />
                  <span className="sr-only sm:not-sr-only">Grid</span>
                </TabsTrigger>

                <TabsTrigger value="list" className="gap-1.5 px-3 py-1.5">
                  <List className="size-4" />
                  <span className="sr-only sm:not-sr-only">List</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "overview" && (
          <BudgetsOverview
            viewMode={viewMode}
            userEmail={currentEmail}
            onAddBudget={() => router.push("/finance/budget/add")}
          />
        )}
        {activeTab === "transactions" && (
          <TransactionsSection
            viewMode={viewMode}
            userEmail={currentEmail}
            onImportTransaction={() => setStDialogOpen(true)}
          />
        )}
        {activeTab === "savings" && (
          <SavingsSection viewMode={viewMode} userEmail={currentEmail} />
        )}
        {activeTab === "analytics" && <BudgetAnalytics />}
      </div>

      <StatementImportDialog
        open={stDialogOpen}
        onOpenChange={setStDialogOpen}
      />
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

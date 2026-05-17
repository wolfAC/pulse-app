"use client";

import { Button } from "@/components/ui/button";
import { NavTabs } from "@/components/ui/nav-tabs";
import { PageHeader } from "@/components/ui/page-header";
import { useIsMobile } from "@/hooks/use-mobile";
import { RootState } from "@/store/index";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ViewToggle } from "../ui/view-toggle";
import BudgetAnalytics from "./finance-analytics";
import { BudgetsOverview } from "./finance-overview";
import { SavingsSection } from "./finance-savings";
import { TransactionsSection } from "./finance-transaction";
import { StatementImportDialog } from "./statement-import-dialog";

export function FinanceTracker() {
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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
          <NavTabs
            value={activeTab}
            onValueChange={setActiveTab}
            tabs={[
              { value: "overview", label: "Budgets" },
              { value: "transactions", label: "Transactions" },
              { value: "savings", label: "Savings" },
              { value: "analytics", label: "Analytics" },
            ]}
          />

          {!isMobile && (
            <ViewToggle value={viewMode} onValueChange={setViewMode} />
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

"use client";

import { BudgetDialog } from "@/components/finance/budget-dialog";
import type { RootState } from "@/store/index";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function EditBudgetModal() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const budget = useSelector((state: RootState) =>
    state.finance.budgets.find((b) => b.id === id),
  );

  if (!budget) return null;

  return (
    <BudgetDialog
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
      editingBudgetId={id}
    />
  );
}

"use client";
import { useRouter } from "next/navigation";
import { BudgetDialog } from "@/components/finance/budget-dialog";

export default function AddBudgetModal() {
  const router = useRouter();
  return (
    <BudgetDialog
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    />
  );
}

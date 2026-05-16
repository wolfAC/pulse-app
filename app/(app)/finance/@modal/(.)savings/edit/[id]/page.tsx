"use client";

import { SavingsGoalDialog } from "@/components/finance/saving-dialog";
import type { RootState } from "@/store/index";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function EditSavingsGoalModal() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const goal = useSelector((state: RootState) =>
    state.finance.savingsGoals.find((g) => g.id === id),
  );

  if (!goal) return null;

  return (
    <SavingsGoalDialog
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
      editingGoalId={id}
    />
  );
}

"use client";
import { useRouter } from "next/navigation";
import { SavingsGoalDialog } from "@/components/finance/saving-dialog";

export default function AddSavingsModal() {
  const router = useRouter();
  return (
    <SavingsGoalDialog
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    />
  );
}

"use client";
import { useRouter } from "next/navigation";
import { TransactionDialog } from "@/components/finance/transactions-dialog";

export default function AddTransactionModal() {
  const router = useRouter();
  return (
    <TransactionDialog
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    />
  );
}

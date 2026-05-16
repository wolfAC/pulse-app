"use client";

import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateTransaction } from "@/store/slices/finance";
import type { Transaction } from "@/lib/types/finance";
import type { RootState } from "@/store/index";
import { TransactionDialog } from "@/components/finance/transactions-dialog";

export default function EditTransactionModal() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const transaction = useSelector((state: RootState) =>
    state.finance.transactions.find((tx) => tx.id === id),
  );

  const handleSave = (
    data: Omit<Transaction, "id" | "userEmail" | "source" | "createdAt"> & {
      date: string;
    },
  ) => {
    if (!transaction) return;
    dispatch(
      updateTransaction({
        ...transaction,
        type: data.type,
        amount: data.amount,
        category: data.category,
        note: data.note,
        counterParty: data.counterParty,
        createdAt: new Date(data.date).getTime(),
      }),
    );
    router.back();
  };

  if (!transaction) return null;

  return (
    <TransactionDialog
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
      transaction={transaction}
      onSave={handleSave}
    />
  );
}

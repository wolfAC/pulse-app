"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, TransactionType } from "@/lib/types/finance";
import type { Transaction } from "@/lib/types/finance";
import type { RootState } from "@/store/index";
import { addTransaction } from "@/store/slices/finance";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TransactionFormData {
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  counterParty?: string;
  date: string;
}

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  onSave?: (data: TransactionFormData) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const emptyForm = {
  type: "expense" as TransactionType,
  category: "",
  amount: "",
  note: "",
  date: new Date().toISOString().split("T")[0],
  counterParty: "",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSave,
}: TransactionDialogProps) {
  const dispatch = useDispatch();
  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );

  const isEditing = !!transaction;
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      if (transaction) {
        setForm({
          type: transaction.type,
          category: transaction.category,
          amount: String(transaction.amount),
          note: transaction.note ?? "",
          date: new Date(transaction.createdAt).toISOString().split("T")[0],
          counterParty: transaction.counterParty ?? "",
        });
      } else {
        setForm(emptyForm);
      }
    }
  }, [transaction, open]);

  const setField =
    (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const reset = () => {
    setForm(emptyForm);
    onOpenChange(false);
  };

  const handleTypeChange = (type: TransactionType) => {
    setForm((f) => ({ ...f, type, category: "" }));
  };

  const handleSubmit = () => {
    if (!form.category || !form.amount) return;

    // If a custom onSave handler is provided (e.g. from edit route), delegate to it
    if (onSave) {
      onSave({
        type: form.type,
        amount: parseFloat(form.amount),
        category: form.category,
        note: form.note || undefined,
        counterParty: form.counterParty || undefined,
        date: form.date,
      });
      return; // caller is responsible for closing / navigating
    }

    // Default: add new transaction via dispatch
    if (!currentEmail) return;
    dispatch(
      addTransaction({
        id: Date.now().toString(),
        userEmail: currentEmail as "wolf8132609@gmail.com",
        type: form.type,
        amount: parseFloat(form.amount),
        category: form.category,
        note: form.note || undefined,
        counterParty: form.counterParty || undefined,
        source: "manual",
        createdAt: new Date(form.date).getTime(),
      }),
    );

    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this transaction."
              : "Record a new income or expense transaction."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={form.type === "income" ? "default" : "outline"}
              onClick={() => handleTypeChange("income")}
              className="w-full"
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Income
            </Button>
            <Button
              type="button"
              variant={form.type === "expense" ? "default" : "outline"}
              onClick={() => handleTypeChange("expense")}
              className="w-full"
            >
              <ArrowDownRight className="mr-2 h-4 w-4" />
              Expense
            </Button>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories[form.type].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={form.amount}
              onChange={setField("amount")}
            />
          </div>

          {/* Counter Party */}
          <div className="space-y-2">
            <Label htmlFor="counterParty">
              {form.type === "income" ? "From" : "To / Merchant"}
            </Label>
            <Input
              id="counterParty"
              placeholder={
                form.type === "income" ? "e.g. Acme Corp" : "e.g. Swiggy"
              }
              value={form.counterParty}
              onChange={setField("counterParty")}
            />
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Input
              id="note"
              placeholder="Add a note..."
              value={form.note}
              onChange={setField("note")}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={setField("date")}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={reset}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!form.category || !form.amount}
          >
            {isEditing ? "Save Changes" : "Add Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
import type { RootState } from "@/store/index";
import { addBudget, updateBudget } from "@/store/slices/finance";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Education",
  "Travel",
  "Personal Care",
  "Subscriptions",
  "Other",
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass a budget id to open in edit mode; omit / pass null for add mode */
  editingBudgetId?: string | null;
}

const emptyForm = {
  category: "",
  limit: "",
  month: new Date().toISOString().slice(0, 7), // "YYYY-MM"
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BudgetDialog({
  open,
  onOpenChange,
  editingBudgetId = null,
}: BudgetDialogProps) {
  const dispatch = useDispatch();

  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );
  const budgets = useSelector((state: RootState) => state.finance.budgets);

  const editingBudget = editingBudgetId
    ? budgets.find((b) => b.id === editingBudgetId)
    : null;

  const isEditing = Boolean(editingBudget);

  const [form, setForm] = useState(emptyForm);

  // Pre-fill form when editing budget changes or dialog opens
  useEffect(() => {
    if (editingBudget) {
      setForm({
        category: editingBudget.category,
        limit: editingBudget.limit.toString(),
        month: editingBudget.month,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingBudget, open]);

  // Categories already budgeted this month for this user (excluding the one being edited)
  const usedCategories = budgets
    .filter(
      (b) =>
        b.month === form.month &&
        b.userEmail === currentEmail &&
        b.id !== editingBudgetId,
    )
    .map((b) => b.category);

  const availableCategories = EXPENSE_CATEGORIES.filter(
    (c) => !usedCategories.includes(c),
  );

  const setField =
    (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const reset = () => {
    setForm(emptyForm);
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!form.category || !form.limit || !currentEmail) return;

    if (isEditing && editingBudget) {
      dispatch(
        updateBudget({
          ...editingBudget,
          category: form.category,
          limit: parseFloat(form.limit),
          month: form.month,
        }),
      );
    } else {
      dispatch(
        addBudget({
          id: Date.now().toString(),
          userEmail: currentEmail,
          category: form.category,
          limit: parseFloat(form.limit),
          month: form.month,
        }),
      );
    }

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
            {isEditing ? "Edit Budget" : "Create Budget"}
          </DialogTitle>
          <DialogDescription>
            Set a monthly spending limit for a category to stay on track.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Month */}
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              type="month"
              value={form.month}
              onChange={setField("month")}
            />
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
                {/* In edit mode always show the current category even if already "used" */}
                {isEditing &&
                  editingBudget &&
                  !availableCategories.includes(editingBudget.category) && (
                    <SelectItem value={editingBudget.category}>
                      {editingBudget.category}
                    </SelectItem>
                  )}
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Limit */}
          <div className="space-y-2">
            <Label htmlFor="limit">Budget Limit (₹)</Label>
            <Input
              id="limit"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={form.limit}
              onChange={setField("limit")}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={reset}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!form.category || !form.limit}
          >
            {isEditing ? "Update Budget" : "Create Budget"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
import { addSavingsGoal, updateSavingsGoal } from "@/store/slices/finance";
import {
  Car,
  Gift,
  Home,
  Plane,
  PersonStanding,
  Shield,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const ICON_MAP: Record<string, React.ElementType> = {
  Target,
  Plane,
  Car,
  Home,
  Shield,
  Gift,
  Sparkles,
  PersonStanding,
};

const ICON_OPTIONS = [
  { value: "Target", label: "Goal" },
  { value: "Plane", label: "Travel" },
  { value: "Car", label: "Vehicle" },
  { value: "Home", label: "Home" },
  { value: "Shield", label: "Emergency" },
  { value: "Gift", label: "Gift" },
  { value: "Sparkles", label: "Other" },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SavingsGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingGoalId?: string | null;
}

const emptyForm = {
  title: "",
  targetAmount: "",
  currentAmount: "",
  deadline: "",
  icon: "Target",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SavingsGoalDialog({
  open,
  onOpenChange,
  editingGoalId = null,
}: SavingsGoalDialogProps) {
  const dispatch = useDispatch();
  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );
  const savingsGoals = useSelector(
    (state: RootState) => state.finance.savingsGoals,
  );

  const editingGoal = editingGoalId
    ? savingsGoals.find((g) => g.id === editingGoalId)
    : null;

  const isEditing = Boolean(editingGoal);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingGoal) {
      setForm({
        title: editingGoal.title,
        targetAmount: editingGoal.targetAmount.toString(),
        currentAmount: editingGoal.currentAmount.toString(),
        deadline: editingGoal.deadline ?? "",
        icon: (editingGoal as any).icon ?? "Target",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingGoal, open]);

  const setField =
    (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const reset = () => {
    setForm(emptyForm);
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!form.title || !form.targetAmount || !currentEmail) return;

    if (isEditing && editingGoal) {
      dispatch(
        updateSavingsGoal({
          ...editingGoal,
          title: form.title,
          targetAmount: parseFloat(form.targetAmount),
          currentAmount: parseFloat(form.currentAmount) || 0,
          deadline: form.deadline || undefined,
          // icon stored as extra field
          ...({ icon: form.icon } as any),
        } as any),
      );
    } else {
      dispatch(
        addSavingsGoal({
          id: Date.now().toString(),
          userEmail: currentEmail,
          title: form.title,
          targetAmount: parseFloat(form.targetAmount),
          currentAmount: parseFloat(form.currentAmount) || 0,
          deadline: form.deadline || undefined,
          createdAt: Date.now(),
          // icon stored as extra field
          ...({ icon: form.icon } as any),
        } as any),
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
            {isEditing ? "Edit Goal" : "Create Savings Goal"}
          </DialogTitle>
          <DialogDescription>
            Set a target amount and track your progress.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Goal Name</Label>
            <Input
              id="title"
              placeholder="e.g. Emergency Fund"
              value={form.title}
              onChange={setField("title")}
            />
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <Select
              value={form.icon}
              onValueChange={(v) => setForm((f) => ({ ...f, icon: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((opt) => {
                  const Icon = ICON_MAP[opt.value];
                  return (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {opt.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target Amount (₹)</Label>
              <Input
                id="target"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.targetAmount}
                onChange={setField("targetAmount")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current">Amount Saved (₹)</Label>
              <Input
                id="current"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.currentAmount}
                onChange={setField("currentAmount")}
              />
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline">Target Date (optional)</Label>
            <Input
              id="deadline"
              type="date"
              value={form.deadline}
              onChange={setField("deadline")}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={reset}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!form.title || !form.targetAmount}
          >
            {isEditing ? "Update Goal" : "Create Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

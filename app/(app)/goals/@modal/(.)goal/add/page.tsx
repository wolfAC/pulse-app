"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { GoalDialog } from "@/components/goals/goal-dialog";
import { addGoal } from "@/store/slices/goals";
import type { Goal } from "@/lib/types/goal";
import type { RootState } from "@/store/index";

export default function AddGoalModal() {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );

  const handleSave = (goalData: Partial<Goal>) => {
    dispatch(
      addGoal({
        id: Date.now().toString(),
        userEmail: currentEmail!,
        title: goalData.title || "",
        description: goalData.description || "",
        progress: 0,
        priority: goalData.priority || "medium",
        status: "active",
        dueDate: goalData.dueDate || "",
        milestones: [],
        tasks: [],
        createdAt: +new Date(),
      }),
    );
    router.back();
  };

  return (
    <GoalDialog
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
      goal={null}
      onSave={handleSave}
    />
  );
}

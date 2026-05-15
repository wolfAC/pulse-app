"use client";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { GoalDialog } from "@/components/goals/goal-dialog";
import { updateGoal } from "@/store/slices/goals";
import type { Goal } from "@/lib/types/goal";
import type { RootState } from "@/store/index";

export default function EditGoalModal() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const goal = useSelector((state: RootState) =>
    state.goals.goals.find((g) => g.id === id),
  );

  const handleSave = (goalData: Partial<Goal>) => {
    if (!goal) return;
    dispatch(updateGoal({ ...goal, ...goalData }));
    router.back();
  };

  if (!goal) return null;

  return (
    <GoalDialog
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
      goal={goal}
      onSave={handleSave}
    />
  );
}

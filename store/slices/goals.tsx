import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Goal, GoalsState } from "@/lib/types/goal";
import { sampleGoals } from "@/lib/samples";

const initialState: GoalsState = {
  goals: sampleGoals,
};

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    addGoal: (state, action: PayloadAction<Goal>) => {
      state.goals.unshift(action.payload);
    },
    updateGoal: (state, action: PayloadAction<Goal>) => {
      const index = state.goals.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter((g) => g.id !== action.payload);
    },
    markHabitDone: (
      state,
      action: PayloadAction<{ id: string; date: string }>,
    ) => {
      const goal = state.goals.find((g) => g.id === action.payload.id);
      if (!goal) return;
      goal.completedDates ??= [];
      const already = goal.completedDates.includes(action.payload.date);
      if (already) {
        goal.completedDates = goal.completedDates.filter(
          (d) => d !== action.payload.date,
        );
      } else {
        goal.completedDates.push(action.payload.date);
      }
    },
  },
});

export const { addGoal, updateGoal, deleteGoal, markHabitDone } =
  goalsSlice.actions;
export default goalsSlice.reducer;

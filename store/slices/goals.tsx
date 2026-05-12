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
  },
});

export const { addGoal, updateGoal, deleteGoal } = goalsSlice.actions;

export default goalsSlice.reducer;

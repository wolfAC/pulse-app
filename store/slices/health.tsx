import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { HealthEntry, HealthState, Workout } from "@/lib/types/health";
import { sampleHealthEntries, sampleWorkouts } from "@/lib/samples";

const initialState: HealthState = {
  entries: sampleHealthEntries,
  workouts: sampleWorkouts,
};

const healthSlice = createSlice({
  name: "health",

  initialState,

  reducers: {
    addEntry: (state, action: PayloadAction<HealthEntry>) => {
      state.entries.unshift(action.payload);
    },

    addWorkout: (state, action: PayloadAction<Workout>) => {
      state.workouts.unshift(action.payload);
    },

    deleteWorkout: (state, action: PayloadAction<string>) => {
      state.workouts = state.workouts.filter((w) => w.id !== action.payload);
    },
  },
});

export const { addEntry, addWorkout, deleteWorkout } = healthSlice.actions;

export default healthSlice.reducer;

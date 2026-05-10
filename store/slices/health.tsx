import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  HealthEntry,
  HealthMetricType,
  Workout,
} from "@/lib/types/health";

const mockEntries: HealthEntry[] = [
  {
    id: "1",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-15",
    type: "sleep",
    value: 7.5,
    unit: "hours",
    notes: "Slept well",
  },
  {
    id: "2",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-15",
    type: "steps",
    value: 8432,
    unit: "steps",
  },
  {
    id: "3",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-15",
    type: "calories",
    value: 1845,
    unit: "kcal",
  },
  {
    id: "4",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-15",
    type: "water",
    value: 2.5,
    unit: "L",
  },
  {
    id: "5",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-14",
    type: "sleep",
    value: 8.0,
    unit: "hours",
  },
  {
    id: "6",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-14",
    type: "steps",
    value: 10200,
    unit: "steps",
  },
  {
    id: "7",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-14",
    type: "calories",
    value: 2050,
    unit: "kcal",
  },
  {
    id: "8",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-14",
    type: "water",
    value: 3.0,
    unit: "L",
  },
  {
    id: "9",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-13",
    type: "sleep",
    value: 6.8,
    unit: "hours",
    notes: "Late night",
  },
  {
    id: "10",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-13",
    type: "steps",
    value: 7800,
    unit: "steps",
  },
  {
    id: "11",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-13",
    type: "heart_rate",
    value: 72,
    unit: "bpm",
  },
  {
    id: "12",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-13",
    type: "weight",
    value: 75.5,
    unit: "kg",
  },
];

const mockWorkouts: Workout[] = [
  {
    id: "1",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-15",
    type: "running",
    name: "Morning Run",
    duration: 45,
    caloriesBurned: 420,
    distance: 5.2,
    notes: "Felt great, personal best pace!",
  },
  {
    id: "2",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-14",
    type: "strength",
    name: "Upper Body",
    duration: 60,
    caloriesBurned: 320,
    notes: "Focused on chest and back",
  },
  {
    id: "3",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-13",
    type: "yoga",
    name: "Evening Yoga",
    duration: 30,
    caloriesBurned: 150,
  },
  {
    id: "4",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-12",
    type: "cycling",
    name: "Bike Commute",
    duration: 35,
    caloriesBurned: 280,
    distance: 12.5,
  },
  {
    id: "5",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-11",
    type: "hiit",
    name: "HIIT Session",
    duration: 25,
    caloriesBurned: 350,
    notes: "High intensity intervals",
  },
  {
    id: "6",
    userEmail: "wolf8132609@gmail.com",
    date: "2024-01-10",
    type: "swimming",
    name: "Pool Laps",
    duration: 40,
    caloriesBurned: 380,
    distance: 1.5,
  },
];

interface HealthState {
  entries: HealthEntry[];
  workouts: Workout[];
}

const initialState: HealthState = {
  entries: mockEntries,
  workouts: mockWorkouts,
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

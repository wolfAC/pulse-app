import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Goal, GoalStatus } from "@/lib/types/goal";

const initialGoals: Goal[] = [
  {
    id: "1",
    title: "Learn TypeScript",
    description:
      "Master TypeScript fundamentals and advanced patterns for better code quality.",
    progress: 65,
    priority: "high",
    status: "active",
    dueDate: "2026-06-15",
    milestones: [
      { id: "m1", title: "Complete basics course", completed: true },
      { id: "m2", title: "Build a project", completed: false },
      { id: "m3", title: "Learn advanced types", completed: false },
    ],
    tasks: [
      { id: "t1", title: "Read documentation", completed: true },
      { id: "t2", title: "Practice generics", completed: true },
      { id: "t3", title: "Build type-safe API", completed: false },
    ],
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    title: "Run a Marathon",
    description: "Train and complete a full marathon by the end of the year.",
    progress: 40,
    priority: "medium",
    status: "active",
    dueDate: "2026-11-20",
    milestones: [
      { id: "m4", title: "Run 10K", completed: true },
      { id: "m5", title: "Run half marathon", completed: false },
      { id: "m6", title: "Complete marathon", completed: false },
    ],
    tasks: [
      { id: "t4", title: "Create training schedule", completed: true },
      { id: "t5", title: "Buy running gear", completed: true },
      { id: "t6", title: "Join running club", completed: false },
    ],
    createdAt: "2026-02-01",
  },
  {
    id: "3",
    title: "Read 24 Books",
    description: "Read 2 books per month across various genres and topics.",
    progress: 25,
    priority: "low",
    status: "active",
    dueDate: "2026-12-31",
    milestones: [
      { id: "m7", title: "Read 6 books", completed: true },
      { id: "m8", title: "Read 12 books", completed: false },
      { id: "m9", title: "Read 24 books", completed: false },
    ],
    tasks: [
      { id: "t7", title: "Create reading list", completed: true },
      { id: "t8", title: "Set daily reading time", completed: true },
      { id: "t9", title: "Join book club", completed: false },
    ],
    createdAt: "2026-01-01",
  },
  {
    id: "4",
    title: "Complete React Course",
    description:
      "Finished the advanced React patterns course with certification.",
    progress: 100,
    priority: "high",
    status: "completed",
    dueDate: "2026-03-01",
    milestones: [
      { id: "m10", title: "Complete fundamentals", completed: true },
      { id: "m11", title: "Build portfolio project", completed: true },
      { id: "m12", title: "Pass certification", completed: true },
    ],
    tasks: [
      { id: "t10", title: "Watch all videos", completed: true },
      { id: "t11", title: "Complete exercises", completed: true },
      { id: "t12", title: "Submit final project", completed: true },
    ],
    createdAt: "2025-12-01",
  },
];

interface GoalsState {
  goals: Goal[];
}

const initialState: GoalsState = {
  goals: initialGoals,
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

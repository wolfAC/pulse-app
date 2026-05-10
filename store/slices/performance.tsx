import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Review } from "@/lib/types/performance";

const sampleReviews: Review[] = [
  {
    id: "1",
    userEmail: "wolf8132609@gmail.com",
    date: "2026-05-15",
    period: "daily",
    overallScore: 85,
    metrics: {
      productivity: 90,
      quality: 85,
      communication: 80,
      learning: 85,
    },
    highlights: [
      "Completed feature implementation ahead of schedule",
      "Received positive feedback from stakeholders",
    ],
    blockers: ["Waiting on API documentation from backend team"],
    improvements: ["Could improve code review turnaround time"],
    notes: "Overall productive day with good focus time.",
  },
  {
    id: "2",
    userEmail: "wolf8132609@gmail.com",
    date: "2026-05-14",
    period: "daily",
    overallScore: 72,
    metrics: {
      productivity: 70,
      quality: 75,
      communication: 70,
      learning: 73,
    },
    highlights: ["Fixed critical bug in production"],
    blockers: [
      "Multiple meeting interruptions",
      "Unclear requirements for new feature",
    ],
    improvements: [
      "Better time blocking for deep work",
      "Ask for clarification earlier",
    ],
  },
  {
    id: "3",
    userEmail: "wolf8132609@gmail.com",
    date: "2026-05-08",
    period: "weekly",
    overallScore: 88,
    metrics: {
      productivity: 92,
      quality: 88,
      communication: 85,
      learning: 87,
    },
    highlights: [
      "Shipped 3 major features",
      "Led successful sprint planning",
      "Mentored junior developer",
    ],
    blockers: [],
    improvements: ["Documentation could be more thorough"],
    notes: "Excellent week with strong delivery and team collaboration.",
  },
  {
    id: "4",
    userEmail: "wolf8132609@gmail.com",
    date: "2026-05-01",
    period: "monthly",
    overallScore: 82,
    metrics: {
      productivity: 85,
      quality: 82,
      communication: 78,
      learning: 83,
    },
    highlights: [
      "Completed Q4 objectives",
      "Improved test coverage by 25%",
      "Launched new dashboard feature",
    ],
    blockers: ["Resource constraints mid-month"],
    improvements: ["Cross-team communication", "Better estimation accuracy"],
    notes: "Strong month overall with room for improvement in planning.",
  },
];

interface PerformanceState {
  reviews: Review[];
}

const initialState: PerformanceState = {
  reviews: sampleReviews,
};

const performanceSlice = createSlice({
  name: "performance",

  initialState,

  reducers: {
    addReview: (state, action: PayloadAction<Review>) => {
      state.reviews.unshift(action.payload);
    },

    updateReview: (state, action: PayloadAction<Review>) => {
      const index = state.reviews.findIndex(
        (review) => review.id === action.payload.id,
      );

      if (index !== -1) {
        state.reviews[index] = action.payload;
      }
    },

    deleteReview: (state, action: PayloadAction<string>) => {
      state.reviews = state.reviews.filter(
        (review) => review.id !== action.payload,
      );
    },

    clearReviews: (state) => {
      state.reviews = [];
    },
  },
});

export const { addReview, updateReview, deleteReview, clearReviews } =
  performanceSlice.actions;

export default performanceSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PerformanceState, Review } from "@/lib/types/performance";
import { sampleReviews } from "@/lib/samples";

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

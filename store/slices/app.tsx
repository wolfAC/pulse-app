// slices/app.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onboardingCompleted: false,

  authenticated: false,

  theme: "dark",

  sidebarOpen: true,

  appLocked: false,
};

const appSlice = createSlice({
  name: "app",

  initialState,

  reducers: {
    completeOnboarding: (state) => {
      state.onboardingCompleted = true;
    },

    resetOnboarding: (state) => {
      state.onboardingCompleted = false;
    },

    setAuthenticated: (state, action) => {
      state.authenticated = action.payload;
    },

    lockApp: (state) => {
      state.appLocked = true;
      state.authenticated = false;
    },

    unlockApp: (state) => {
      state.appLocked = false;
      state.authenticated = true;
    },

    setTheme: (state, action) => {
      state.theme = action.payload;
    },

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const {
  completeOnboarding,
  resetOnboarding,
  setAuthenticated,
  lockApp,
  unlockApp,
  setTheme,
  toggleSidebar,
} = appSlice.actions;

export default appSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark" | "system";

interface AppState {
  theme: Theme;
  sidebarOpen: boolean;
  appLocked: boolean;
  currency: string;
}

const initialState: AppState = {
  theme: "dark",
  sidebarOpen: true,
  appLocked: false,
  currency: "INR",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },

    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },

    lockApp(state) {
      state.appLocked = true;
    },

    unlockApp(state) {
      state.appLocked = false;
    },
  },
});

export const { setTheme, toggleSidebar, setSidebarOpen, lockApp, unlockApp } =
  appSlice.actions;

export default appSlice.reducer;

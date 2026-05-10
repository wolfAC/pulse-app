import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  email: string;
  name: string;
  pin: string; // hashed/stored locally; treat as opaque
  createdAt: string;
  selectedGoals: string[];
  avatar?: string;
}

export interface AuthState {
  currentEmail: string | null;
  isAuthenticated: boolean;
  users: Record<string, UserProfile>;
}

const initialState: AuthState = {
  currentEmail: null,
  isAuthenticated: false,
  users: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerUser(state, action: PayloadAction<Omit<UserProfile, "createdAt">>) {
      const { email } = action.payload;
      state.users[email] = {
        ...action.payload,
        createdAt: state.users[email]?.createdAt ?? new Date().toISOString(),
      };
    },

    login(state, action: PayloadAction<{ email: string }>) {
      state.currentEmail = action.payload.email;
      state.isAuthenticated = true;
    },

    logout(state) {
      state.currentEmail = null;
      state.isAuthenticated = false;
    },

    updateProfile(
      state,
      action: PayloadAction<Partial<UserProfile> & { email: string }>,
    ) {
      const { email, ...changes } = action.payload;
      if (state.users[email]) {
        state.users[email] = { ...state.users[email], ...changes };
      }
    },

    updatePin(state, action: PayloadAction<{ email: string; pin: string }>) {
      const { email, pin } = action.payload;
      if (state.users[email]) {
        state.users[email].pin = pin;
      }
    },
  },
});

export const { registerUser, login, logout, updateProfile, updatePin } =
  authSlice.actions;

export default authSlice.reducer;

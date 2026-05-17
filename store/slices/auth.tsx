import { AuthState, UserProfile } from "@/lib/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
        createdAt: state.users[email]?.createdAt ?? +new Date(),
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

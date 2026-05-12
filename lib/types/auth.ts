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

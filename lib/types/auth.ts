export interface UserProfile {
  email: string;
  name: string;
  pin: string;
  createdAt: number;
  selectedGoals: string[];
  avatar?: string;
}

export interface AuthState {
  currentEmail: string | null;
  isAuthenticated: boolean;
  users: Record<string, UserProfile>;
}

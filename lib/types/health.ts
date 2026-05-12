export type HealthMetricType =
  | "sleep"
  | "steps"
  | "calories"
  | "water"
  | "heart_rate"
  | "weight";

export type WorkoutType =
  | "running"
  | "cycling"
  | "swimming"
  | "strength"
  | "yoga"
  | "hiit"
  | "walking"
  | "other";

export interface HealthEntry {
  id: string;
  userEmail: string;
  date: string;
  type: HealthMetricType;
  value: number;
  unit: string;
  notes?: string;
}

export interface HealthMetric {
  type: HealthMetricType;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: number; // percentage change from previous period
  history: { date: string; value: number }[];
}

export interface Workout {
  id: string;
  userEmail: string;
  date: string;
  type: WorkoutType;
  name: string;
  duration: number; // in minutes
  caloriesBurned: number;
  distance?: number; // in km
  notes?: string;
}

export interface HealthStats {
  sleep: HealthMetric;
  steps: HealthMetric;
  calories: HealthMetric;
  water: HealthMetric;
}

export interface HealthState {
  entries: HealthEntry[];
  workouts: Workout[];
}

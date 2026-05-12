export type ReviewPeriod = "daily" | "weekly" | "monthly";

export interface ReviewMetrics {
  productivity: number; // 0-100
  quality: number; // 0-100
  communication: number; // 0-100
  learning: number; // 0-100
}

export interface Review {
  id: string;
  userEmail: string;
  date: string;
  period: ReviewPeriod;
  overallScore: number; // 0-100, calculated from metrics
  metrics: ReviewMetrics;
  highlights: string[];
  blockers: string[];
  improvements: string[];
  notes?: string;
  createdAt: number;
}

export const periodLabels: Record<ReviewPeriod, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

export const metricLabels: Record<keyof ReviewMetrics, string> = {
  productivity: "Productivity",
  quality: "Quality",
  communication: "Communication",
  learning: "Learning",
};

export const metricIcons: Record<keyof ReviewMetrics, string> = {
  productivity: "Zap",
  quality: "Award",
  communication: "MessageSquare",
  learning: "BookOpen",
};

export interface PerformanceState {
  reviews: Review[];
}

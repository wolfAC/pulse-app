export type Priority = "low" | "medium" | "high";

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export type Goal = {
  id: string;
  userEmail: string;
  title: string;
  description: string;
  priority: Priority;
  status: "active" | "completed";
  progress: number;
  dueDate?: string;
  milestones?: Milestone[];
  tasks?: Task[];
  type?: "goal" | "habit";
  completedDates?: string[];
  createdAt: number;
};

export interface GoalsState {
  goals: Goal[];
}

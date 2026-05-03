export type Priority = "low" | "medium" | "high"
export type GoalStatus = "active" | "completed" | "paused"

export interface Milestone {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  completed: boolean
}

export interface Goal {
  id: string
  title: string
  description: string
  progress: number
  priority: Priority
  status: GoalStatus
  dueDate: string
  milestones: Milestone[]
  tasks: Task[]
  createdAt: string
}

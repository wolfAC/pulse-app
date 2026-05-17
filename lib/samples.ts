import type { Goal } from "@/lib/types/goal";
import type { Review } from "@/lib/types/performance";
import type { HealthEntry, Workout } from "@/lib/types/health";
import type { Budget, SavingsGoal, Transaction } from "@/lib/types/finance";
import { UserProfile } from "./types/auth";

// Helper to get past dates for habit streaks
function pastDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

export const sampleUser: UserProfile[] = [
  {
    email: "tester.pulse@gmail.com",
    name: "Tester",
    pin: "000000",
    selectedGoals: [
      "productivity",
      "health",
      "performance",
      "learning",
      "fitness",
      "sleep",
    ],
    createdAt: 1779011476058,
    avatar: "/avatars/tester.png",
  },
];

export const sampleGoals: Goal[] = [
  {
    id: "1",
    userEmail: "wolf8132609@gmail.com",
    title: "Learn TypeScript",
    description:
      "Master TypeScript fundamentals and advanced patterns for better code quality.",
    progress: 65,
    priority: "high",
    status: "active",
    type: "goal",
    dueDate: "2026-06-15",
    milestones: [
      { id: "m1", title: "Complete basics course", completed: true },
      { id: "m2", title: "Build a project", completed: false },
      { id: "m3", title: "Learn advanced types", completed: false },
    ],
    tasks: [
      { id: "t1", title: "Read documentation", completed: true },
      { id: "t2", title: "Practice generics", completed: true },
      { id: "t3", title: "Build type-safe API", completed: false },
    ],
    createdAt: +new Date(),
  },
  {
    id: "2",
    userEmail: "wolf8132609@gmail.com",
    title: "Run a Marathon",
    description: "Train and complete a full marathon by the end of the year.",
    progress: 40,
    priority: "medium",
    status: "active",
    type: "goal",
    dueDate: "2026-11-20",
    milestones: [
      { id: "m4", title: "Run 10K", completed: true },
      { id: "m5", title: "Run half marathon", completed: false },
      { id: "m6", title: "Complete marathon", completed: false },
    ],
    tasks: [
      { id: "t4", title: "Create training schedule", completed: true },
      { id: "t5", title: "Buy running gear", completed: true },
      { id: "t6", title: "Join running club", completed: false },
    ],
    createdAt: +new Date(),
  },
  {
    id: "3",
    userEmail: "wolf8132609@gmail.com",
    title: "Read 24 Books",
    description: "Read 2 books per month across various genres and topics.",
    progress: 25,
    priority: "low",
    status: "active",
    type: "goal",
    dueDate: "2026-12-31",
    milestones: [
      { id: "m7", title: "Read 6 books", completed: true },
      { id: "m8", title: "Read 12 books", completed: false },
      { id: "m9", title: "Read 24 books", completed: false },
    ],
    tasks: [
      { id: "t7", title: "Create reading list", completed: true },
      { id: "t8", title: "Set daily reading time", completed: true },
      { id: "t9", title: "Join book club", completed: false },
    ],
    createdAt: +new Date(),
  },
  {
    id: "4",
    userEmail: "wolf8132609@gmail.com",
    title: "Complete React Course",
    description:
      "Finished the advanced React patterns course with certification.",
    progress: 100,
    priority: "high",
    status: "completed",
    type: "goal",
    dueDate: "2026-03-01",
    milestones: [
      { id: "m10", title: "Complete fundamentals", completed: true },
      { id: "m11", title: "Build portfolio project", completed: true },
      { id: "m12", title: "Pass certification", completed: true },
    ],
    tasks: [
      { id: "t10", title: "Watch all videos", completed: true },
      { id: "t11", title: "Complete exercises", completed: true },
      { id: "t12", title: "Submit final project", completed: true },
    ],
    createdAt: +new Date(),
  },

  // ── Habits ──────────────────────────────────────────────
  {
    id: "5",
    userEmail: "wolf8132609@gmail.com",
    title: "Practice Keyboard",
    description:
      "Practice typing or piano keyboard for at least 20 minutes daily.",
    progress: 0,
    priority: "high",
    status: "active",
    type: "habit",
    // 9-day streak ending today, with a couple of gaps earlier in month
    completedDates: [
      pastDate(0),
      pastDate(1),
      pastDate(2),
      pastDate(3),
      pastDate(4),
      pastDate(5),
      pastDate(6),
      pastDate(7),
      pastDate(8),
      pastDate(10),
      pastDate(11),
      pastDate(14),
    ],
    createdAt: +new Date(),
  },
  {
    id: "6",
    userEmail: "wolf8132609@gmail.com",
    title: "Morning Meditation",
    description: "10 minutes of mindfulness meditation every morning.",
    progress: 0,
    priority: "medium",
    status: "active",
    type: "habit",
    // 3-day streak, patchy earlier
    completedDates: [
      pastDate(0),
      pastDate(1),
      pastDate(2),
      pastDate(4),
      pastDate(5),
      pastDate(8),
      pastDate(9),
      pastDate(10),
    ],
    createdAt: +new Date(),
  },
  {
    id: "7",
    userEmail: "wolf8132609@gmail.com",
    title: "Drink 2L Water",
    description: "Stay hydrated by drinking at least 2 litres of water daily.",
    progress: 0,
    priority: "low",
    status: "active",
    type: "habit",
    // missed today, 5-day streak before that
    completedDates: [
      pastDate(1),
      pastDate(2),
      pastDate(3),
      pastDate(4),
      pastDate(5),
      pastDate(7),
      pastDate(11),
      pastDate(12),
    ],
    createdAt: +new Date(),
  },
];

export const sampleReviews: Review[] = [
  {
    id: "1",
    userEmail: "wolf8132609@gmail.com",
    period: "daily",
    overallScore: 85,
    metrics: {
      productivity: 90,
      quality: 85,
      communication: 80,
      learning: 85,
    },
    highlights: [
      "Completed feature implementation ahead of schedule",
      "Received positive feedback from stakeholders",
    ],
    blockers: ["Waiting on API documentation from backend team"],
    improvements: ["Could improve code review turnaround time"],
    notes: "Overall productive day with good focus time.",
    createdAt: +new Date(),
  },
  {
    id: "2",
    userEmail: "wolf8132609@gmail.com",
    period: "daily",
    overallScore: 72,
    metrics: {
      productivity: 70,
      quality: 75,
      communication: 70,
      learning: 73,
    },
    highlights: ["Fixed critical bug in production"],
    blockers: [
      "Multiple meeting interruptions",
      "Unclear requirements for new feature",
    ],
    improvements: [
      "Better time blocking for deep work",
      "Ask for clarification earlier",
    ],
    createdAt: +new Date(),
  },
  {
    id: "3",
    userEmail: "wolf8132609@gmail.com",
    period: "weekly",
    overallScore: 88,
    metrics: {
      productivity: 92,
      quality: 88,
      communication: 85,
      learning: 87,
    },
    highlights: [
      "Shipped 3 major features",
      "Led successful sprint planning",
      "Mentored junior developer",
    ],
    blockers: [],
    improvements: ["Documentation could be more thorough"],
    notes: "Excellent week with strong delivery and team collaboration.",
    createdAt: +new Date(),
  },
  {
    id: "4",
    userEmail: "wolf8132609@gmail.com",
    period: "monthly",
    overallScore: 82,
    metrics: {
      productivity: 85,
      quality: 82,
      communication: 78,
      learning: 83,
    },
    highlights: [
      "Completed Q4 objectives",
      "Improved test coverage by 25%",
      "Launched new dashboard feature",
    ],
    blockers: ["Resource constraints mid-month"],
    improvements: ["Cross-team communication", "Better estimation accuracy"],
    notes: "Strong month overall with room for improvement in planning.",
    createdAt: +new Date(),
  },
];

export const sampleHealthEntries: HealthEntry[] = [
  {
    id: "1",
    userEmail: "wolf8132609@gmail.com",
    type: "sleep",
    value: 7.5,
    unit: "hours",
    notes: "Slept well",
    createdAt: +new Date(),
  },
  {
    id: "2",
    userEmail: "wolf8132609@gmail.com",
    type: "steps",
    value: 8432,
    unit: "steps",
    createdAt: +new Date(),
  },
  {
    id: "3",
    userEmail: "wolf8132609@gmail.com",
    type: "calories",
    value: 1845,
    unit: "kcal",
    createdAt: +new Date(),
  },
  {
    id: "4",
    userEmail: "wolf8132609@gmail.com",
    type: "water",
    value: 2.5,
    unit: "L",
    createdAt: +new Date(),
  },
  {
    id: "5",
    userEmail: "wolf8132609@gmail.com",
    type: "sleep",
    value: 8.0,
    unit: "hours",
    createdAt: +new Date(),
  },
  {
    id: "6",
    userEmail: "wolf8132609@gmail.com",
    type: "steps",
    value: 10200,
    unit: "steps",
    createdAt: +new Date(),
  },
  {
    id: "7",
    userEmail: "wolf8132609@gmail.com",
    type: "calories",
    value: 2050,
    unit: "kcal",
    createdAt: +new Date(),
  },
  {
    id: "8",
    userEmail: "wolf8132609@gmail.com",
    type: "water",
    value: 3.0,
    unit: "L",
    createdAt: +new Date(),
  },
  {
    id: "9",
    userEmail: "wolf8132609@gmail.com",
    type: "sleep",
    value: 6.8,
    unit: "hours",
    notes: "Late night",
    createdAt: +new Date(),
  },
  {
    id: "10",
    userEmail: "wolf8132609@gmail.com",
    type: "steps",
    value: 7800,
    unit: "steps",
    createdAt: +new Date(),
  },
  {
    id: "11",
    userEmail: "wolf8132609@gmail.com",
    type: "heart_rate",
    value: 72,
    unit: "bpm",
    createdAt: +new Date(),
  },
  {
    id: "12",
    userEmail: "wolf8132609@gmail.com",
    type: "weight",
    value: 75.5,
    unit: "kg",
    createdAt: +new Date(),
  },
];

export const sampleWorkouts: Workout[] = [
  {
    id: "1",
    userEmail: "wolf8132609@gmail.com",
    type: "running",
    name: "Morning Run",
    duration: 45,
    caloriesBurned: 420,
    distance: 5.2,
    notes: "Felt great, personal best pace!",
    createdAt: +new Date(),
  },
  {
    id: "2",
    userEmail: "wolf8132609@gmail.com",
    type: "strength",
    name: "Upper Body",
    duration: 60,
    caloriesBurned: 320,
    notes: "Focused on chest and back",
    createdAt: +new Date(),
  },
  {
    id: "3",
    userEmail: "wolf8132609@gmail.com",
    type: "yoga",
    name: "Evening Yoga",
    duration: 30,
    caloriesBurned: 150,
    createdAt: +new Date(),
  },
  {
    id: "4",
    userEmail: "wolf8132609@gmail.com",
    type: "cycling",
    name: "Bike Commute",
    duration: 35,
    caloriesBurned: 280,
    distance: 12.5,
    createdAt: +new Date(),
  },
  {
    id: "5",
    userEmail: "wolf8132609@gmail.com",
    type: "hiit",
    name: "HIIT Session",
    duration: 25,
    caloriesBurned: 350,
    notes: "High intensity intervals",
    createdAt: +new Date(),
  },
  {
    id: "6",
    userEmail: "wolf8132609@gmail.com",
    type: "swimming",
    name: "Pool Laps",
    duration: 40,
    caloriesBurned: 380,
    distance: 1.5,
    createdAt: +new Date(),
  },
];

export const sampleTransactions: Transaction[] = [
  {
    id: "tx1",
    userEmail: "wolf8132609@gmail.com",
    type: "expense",
    amount: 250,
    category: "Food",
    note: "Lunch",
    counterParty: "Swiggy",
    tags: ["food"],
    source: "manual",
    createdAt: +new Date(),
  },
  {
    id: "tx2",
    userEmail: "wolf8132609@gmail.com",
    type: "income",
    amount: 50000,
    category: "Salary",
    note: "Monthly salary",
    source: "manual",
    createdAt: +new Date(),
  },
];

export const sampleBudgets: Budget[] = [
  {
    id: "budget1",
    userEmail: "wolf8132609@gmail.com",
    category: "Food",
    limit: 5000,
    month: "2026-05",
  },
  {
    id: "budget2",
    userEmail: "wolf8132609@gmail.com",
    category: "Transport",
    limit: 3000,
    month: "2026-05",
  },
];

export const sampleSavingsGoals: SavingsGoal[] = [
  {
    id: "save1",
    userEmail: "wolf8132609@gmail.com",
    title: "Emergency Fund",
    targetAmount: 100000,
    currentAmount: 25000,
    deadline: "2026-12-31",
    createdAt: +new Date(),
  },
];

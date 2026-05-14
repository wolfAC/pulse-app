export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  userEmail: "wolf8132609@gmail.com";
  amount: number;
  category: string;
  note?: string;
  account?: string;
  bankName?: string;
  counterParty?: string;
  tags?: string[];
  source?: "manual" | "import";
  createdAt: number;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  month: string;
  userEmail: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  createdAt: number;
  userEmail: string;
}

export interface BudgetsState {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
}

export const currencies = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "JPY", label: "Japanese Yen (¥)" },
  { value: "CAD", label: "Canadian Dollar (C$)" },
  { value: "AUD", label: "Australian Dollar (A$)" },
  { value: "INR", label: "Indian Rupee (₹)" },
];

export const categories = {
  income: ["Salary", "Freelance", "Investments", "Gifts", "Other Income"],
  expense: [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Personal Care",
    "Other",
  ],
};

export const categoryIcons: Record<string, string> = {
  Salary: "Briefcase",
  Freelance: "Laptop",
  Investments: "TrendingUp",
  Gifts: "Gift",
  "Other Income": "Plus",
  "Food & Dining": "UtensilsCrossed",
  Transportation: "Car",
  Shopping: "ShoppingBag",
  Entertainment: "Film",
  "Bills & Utilities": "Zap",
  Healthcare: "Heart",
  Education: "GraduationCap",
  Travel: "Plane",
  "Personal Care": "Sparkles",
  Other: "MoreHorizontal",
};

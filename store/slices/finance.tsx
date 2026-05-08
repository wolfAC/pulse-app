import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;

  type: TransactionType;

  amount: number;

  category: string;

  date: string;

  note?: string;

  account?: string;

  bankName?: string;

  counterParty?: string;

  tags?: string[];

  source?: "manual" | "gpay-pdf";

  createdAt: number;
}

export interface Budget {
  id: string;

  category: string;

  limit: number;

  month: string;
}

export interface SavingsGoal {
  id: string;

  title: string;

  targetAmount: number;

  currentAmount: number;

  deadline?: string;

  createdAt: number;
}

interface FinanceState {
  transactions: Transaction[];

  budgets: Budget[];

  savingsGoals: SavingsGoal[];
}

const initialState: FinanceState = {
  transactions: [
    {
      id: "tx1",

      type: "expense",

      amount: 250,

      category: "Food",

      date: "2026-05-01",

      note: "Lunch",

      counterParty: "Swiggy",

      tags: ["food"],

      source: "manual",

      createdAt: Date.now(),
    },

    {
      id: "tx2",

      type: "income",

      amount: 50000,

      category: "Salary",

      date: "2026-05-01",

      note: "Monthly salary",

      source: "manual",

      createdAt: Date.now(),
    },
  ],

  budgets: [
    {
      id: "budget1",

      category: "Food",

      limit: 5000,

      month: "2026-05",
    },

    {
      id: "budget2",

      category: "Transport",

      limit: 3000,

      month: "2026-05",
    },
  ],

  savingsGoals: [
    {
      id: "save1",

      title: "Emergency Fund",

      targetAmount: 100000,

      currentAmount: 25000,

      deadline: "2026-12-31",

      createdAt: Date.now(),
    },
  ],
};

const financeSlice = createSlice({
  name: "finance",

  initialState,

  reducers: {
    // =========================
    // Transactions
    // =========================

    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },

    addManyTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions.unshift(...action.payload);
    },

    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(
        (tx) => tx.id === action.payload.id,
      );

      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },

    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        (tx) => tx.id !== action.payload,
      );
    },

    clearTransactions: (state) => {
      state.transactions = [];
    },

    // =========================
    // Budgets
    // =========================

    addBudget: (state, action: PayloadAction<Budget>) => {
      state.budgets.push(action.payload);
    },

    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = state.budgets.findIndex(
        (budget) => budget.id === action.payload.id,
      );

      if (index !== -1) {
        state.budgets[index] = action.payload;
      }
    },

    deleteBudget: (state, action: PayloadAction<string>) => {
      state.budgets = state.budgets.filter(
        (budget) => budget.id !== action.payload,
      );
    },

    // =========================
    // Savings Goals
    // =========================

    addSavingsGoal: (state, action: PayloadAction<SavingsGoal>) => {
      state.savingsGoals.push(action.payload);
    },

    updateSavingsGoal: (state, action: PayloadAction<SavingsGoal>) => {
      const index = state.savingsGoals.findIndex(
        (goal) => goal.id === action.payload.id,
      );

      if (index !== -1) {
        state.savingsGoals[index] = action.payload;
      }
    },

    deleteSavingsGoal: (state, action: PayloadAction<string>) => {
      state.savingsGoals = state.savingsGoals.filter(
        (goal) => goal.id !== action.payload,
      );
    },

    clearFinanceData: (state) => {
      state.transactions = [];
      state.budgets = [];
      state.savingsGoals = [];
    },
  },
});

export const {
  addTransaction,
  addManyTransactions,
  updateTransaction,
  deleteTransaction,
  clearTransactions,

  addBudget,
  updateBudget,
  deleteBudget,

  addSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,

  clearFinanceData,
} = financeSlice.actions;

export default financeSlice.reducer;

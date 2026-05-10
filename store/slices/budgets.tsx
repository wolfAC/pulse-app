import {
  Budget,
  BudgetsState,
  SavingsGoal,
  Transaction,
} from "@/lib/types/budgets";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: BudgetsState = {
  transactions: [
    {
      id: "tx1",
      userEmail: "wolf8132609@gmail.com",
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
      userEmail: "wolf8132609@gmail.com",
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
  ],

  savingsGoals: [
    {
      id: "save1",
      userEmail: "wolf8132609@gmail.com",
      title: "Emergency Fund",
      targetAmount: 100000,
      currentAmount: 25000,
      deadline: "2026-12-31",
      createdAt: +new Date(),
    },
  ],
};

const budgetsSlice = createSlice({
  name: "budgets",

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

    clearBudgetsData: (state) => {
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

  clearBudgetsData,
} = budgetsSlice.actions;

export default budgetsSlice.reducer;

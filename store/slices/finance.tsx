import {
  Budget,
  BudgetsState,
  SavingsGoal,
  Transaction,
} from "@/lib/types/finance";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  sampleTransactions,
  sampleBudgets,
  sampleSavingsGoals,
} from "@/lib/samples";

const initialState: BudgetsState = {
  transactions: sampleTransactions,
  budgets: sampleBudgets,
  savingsGoals: sampleSavingsGoals,
};

const financeSlice = createSlice({
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
} = financeSlice.actions;

export default financeSlice.reducer;

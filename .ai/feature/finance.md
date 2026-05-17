# Finance Feature

## Overview
The Finance feature provides a comprehensive system for managing personal finances. It allows users to track spending through transactions, set and monitor category-based budgets, and save toward specific financial targets.

## Core Components
- **Finance Tracker**: The main management interface, divided into four primary tabs:
    - **Budgets (Overview)**: Visualizes budget vs. actual spending across different categories.
    - **Transactions**: A detailed ledger of all income and expense entries.
    - **Savings**: Tracks progress toward specific savings goals.
    - **Analytics**: Provides high-level insights and trends based on financial data.
- **Budgets Overview**: Displays a set of budget cards that track spending limits for categories like Food, Transport, and Shopping.
- **Transactions Section**: Manages the transaction ledger, supporting both manual entry and bulk import.
- **Savings Section**: Manages long-term savings goals, tracking the current amount saved against a target.
- **Statement Import Dialog**: Allows users to import multiple transactions at once, streamlining the data entry process.

## Financial Data Models
The feature manages three interconnected data types:

### 1. Transactions
Individual records of money moving in or out.
- **Types**: Income or Expense.
- **Attributes**: Amount, Category (e.g., Salary, Food & Dining), Note, Counterparty, and Tags.
- **Sources**: Can be entered manually or via import.

### 2. Budgets
Monthly limits set for specific expense categories.
- **Attributes**: Category, Limit (numeric), and Month (YYYY-MM).
- **Purpose**: Used to track spending limits and prevent overspending in specific areas.

### 3. Savings Goals
Targeted funds for future purchases or emergencies.
- **Attributes**: Title, Target Amount, Current Amount, and optional Deadline.
- **Purpose**: Visualizes progress toward a financial milestone.

## User Flow & CRUD Operations
- **Managing Budgets**:
    - **Add/Edit**: Users can create or modify budget limits for specific categories via modals/pages.
    - **Delete**: Budgets can be removed through the budget management interface.
- **Tracking Transactions**:
    - **Add**: Users can log a single transaction manually.
    - **Bulk Import**: Users can upload multiple transactions using the `StatementImportDialog`.
    - **Edit/Delete**: Individual transactions can be updated or removed from the ledger.
- **Savings Management**:
    - **Create Goal**: Users set a target amount and title for a new savings goal.
    - **Update Progress**: Users can update the current amount saved.
    - **Delete**: Savings goals can be removed once achieved or abandoned.

## Technical Implementation
- **State Management**: Managed via `financeSlice` in Redux, which maintains three arrays: `transactions`, `budgets`, and `savingsGoals`.
- **Data Model**: Defined in `lib/types/finance.ts`, including a robust set of predefined categories and icons for consistency.
- **Currency Support**: Supports multiple global currencies (USD, EUR, GBP, JPY, CAD, AUD, INR), allowing users to personalize their financial dashboard.
- **View Flexibility**: Supports Grid and List layouts via the `ViewToggle` component in the main tracker.

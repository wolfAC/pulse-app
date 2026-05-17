# Dashboard Feature

## Overview
The Dashboard is the central hub of the Pulse application, providing users with a high-level overview of their personal finance, health metrics, and goal progress. It is designed to be a "single pane of glass" for life tracking.

## Core Components
- **Finance Overview**: Displays current budget status, total savings, and recent transactions.
- **Health Tracker**: Monitors key health indicators such as sleep, steps, and calories.
- **Goal Tracker**: Shows progress on active goals and habits.
- **Performance Review**: Provides a way to rate daily/weekly performance and identify trends.

## Key Characteristics
- **Local-First**: All data is stored locally on the device, ensuring privacy and offline availability.
- **Responsive Design**: Optimized for both desktop and mobile views.
- **Modular Architecture**: Built using a set of feature-specific components (finance, health, goals) that are composed within the main dashboard layout.

## User Flow
1. **Onboarding**: Users are guided through a setup process (profile, finance, goals).
2. **Dashboard**: After onboarding, users land on the dashboard where they can view their aggregated data.
3. **Deep Dives**: From the dashboard, users can open modals or navigate to specific pages to add or edit entries (e.g., adding a budget or updating a goal).

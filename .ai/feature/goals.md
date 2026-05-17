# Goals Feature

## Overview
The Goals feature allows users to set, track, and manage their personal aspirations and daily habits. It provides a structured way to break down large ambitions into manageable milestones and tasks, while also supporting recurring daily habits.

## Core Components
- **Goals Tracker**: The primary management view. It allows users to filter goals by status (Active, Completed, All) and toggle between Grid and List views.
- **Goal Card**: A summary view of an individual goal, displaying its title, description, a progress bar, priority level, and due date.
- **Goal Dialog**: A unified modal used for both creating new goals and editing existing ones. It features a tabbed interface:
    - **Details Tab**: For basic information, including a toggle between "Goal" and "Daily Habit" modes.
    - **Progress Tab**: Available for regular goals, allowing the management of milestones and tasks.
- **Delete Confirmation**: An `AlertDialog` used to prevent accidental deletion of goals.

## Goal Types
- **Standard Goals**: Defined by a title, description, priority, and a specific due date. Progress is calculated based on the completion of associated milestones and tasks.
- **Daily Habits**: Focused on consistency rather than a deadline. They track daily completion dates to maintain streaks.

## User Flow & CRUD Operations
- **Creating a Goal**:
    1. User clicks "Create Goal" in the `GoalsTracker`.
    2. `GoalDialog` opens in "Create" mode.
    3. User fills in details and optionally adds milestones/tasks.
    4. `addGoal` action is dispatched to the Redux store.
- **Editing a Goal**:
    1. User clicks a `GoalCard` or the edit icon.
    2. `GoalDialog` opens in "Edit" mode, pre-populated with the goal's current data.
    3. User modifies details or updates progress (checking off tasks/milestones).
    4. `updateGoal` action is dispatched to the Redux store.
- **Deleting a Goal**:
    1. User clicks the trash icon on a `GoalCard`.
    2. `AlertDialog` prompts for confirmation.
    3. `deleteGoal` action is dispatched to remove the goal from the store.
- **Tracking Habits**:
    - Users can mark habits as completed for specific dates via the `markHabitDone` action, which toggles the completion status for that day.

## Technical Implementation
- **State Management**: Managed via `goalsSlice` in Redux, which handles the list of goals and specific updates for habits.
- **Progress Calculation**: For standard goals, progress is automatically computed as:
  `((completedMilestones + completedTasks) / (totalMilestones + totalTasks)) * 100`
- **Data Model**: Defined in `lib/types/goal.ts`, utilizing a flexible `Goal` type that adapts based on whether it's a standard goal or a habit.

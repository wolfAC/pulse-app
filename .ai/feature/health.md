# Health Feature

## Overview
The Health feature provides a comprehensive suite for monitoring physical well-being. It allows users to track vital health metrics (like sleep, water intake, and weight) and log physical activities (workouts), providing both a high-level overview of trends and a detailed history of entries.

## Core Components
- **Health Tracker**: The main entry point for health management. It organizes the feature into three primary views:
    - **Overview**: A summary dashboard showcasing key metrics, trends, and current status.
    - **Logs**: A detailed history of all recorded health entries.
    - **Workouts**: A dedicated section for managing and viewing physical exercise logs.
- **Health Overview**: Provides a visual representation of health data, utilizing the `viewMode` (Grid/List) to display health metrics and their associated trends.
- **Health Logs**: Lists individual health entries, allowing users to review their historical data.
- **Workouts Section**: Manages the collection of workouts, displaying details like duration and calories burned.
- **Health Dialog/Entry Form**: Used for adding new health entries, allowing users to select a metric type and input the corresponding value.

## Health Metrics & Workouts
The feature tracks two distinct types of data:

### 1. Health Metrics
Quantitative measurements of health, including:
- **Sleep**: Tracked in hours.
- **Steps**: Daily step count.
- **Calories**: Caloric intake or burn.
- **Water**: Volume of water consumed.
- **Heart Rate**: BPM measurements.
- **Weight**: Body mass tracking.

### 2. Workouts
Detailed logs of physical activity, supporting various types:
- **Types**: Running, Cycling, Swimming, Strength, Yoga, HIIT, Walking, and Other.
- **Data Captured**: Workout name, duration (minutes), calories burned, and optionally distance (km).

## User Flow & CRUD Operations
- **Adding a Health Entry**:
    1. User clicks "Add Entry" in the `HealthTracker`.
    2. User is navigated to the entry creation page.
    3. User selects a metric type (e.g., "Water") and enters the value.
    4. `addEntry` action is dispatched to the Redux store.
- **Adding a Workout**:
    1. User creates a new workout record via the workout interface.
    2. `addWorkout` action is dispatched to the Redux store.
- **Deleting a Workout**:
    1. User removes a specific workout log.
    2. `deleteWorkout` action is dispatched to remove it from the store.

## Technical Implementation
- **State Management**: Managed via `healthSlice` in Redux, which maintains two separate collections: `entries` for general health metrics and `workouts` for exercise logs.
- **Data Model**: Defined in `lib/types/health.ts`, utilizing `HealthEntry` for metrics and `Workout` for exercises.
- **Trend Analysis**: The `HealthMetric` type includes a `trend` property, used in the Overview to show percentage changes from previous periods.
- **View Flexibility**: Supports both Grid and List layouts via the `ViewToggle` component, ensuring the interface is usable across different screen sizes.

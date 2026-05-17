# Performance Feature

## Overview
The Performance feature allows users to reflect on and track their work-related productivity and quality over time. It enables a a rhythmic review process (daily, weekly, or monthly) to help users identify patterns, celebrate wins, and pinpoint blockers.

## Core Components
- **Performance Tracker**: The main management interface. It allows users to filter reviews by period (Daily, Weekly, Monthly, or All) and toggle between Grid and List views.
- **Review Card**: Displays a summary of a performance review, including the overall score, a breakdown of specific metrics, and key highlights.
- **Review Editor (Add/Edit)**: A dedicated interface for creating and updating reviews. It allows users to:
    - Set the review period.
    - Score themselves across four key metrics: Productivity, Quality, Communication, and Learning.
    - List highlights, blockers, and areas for improvement.
    - Add general notes.
- **Delete Confirmation**: An `AlertDialog` used to confirm the permanent removal of a review.

## Key Metrics
The feature tracks four primary dimensions of performance, each scored from 0-100:
- **Productivity**: Efficiency and volume of work completed.
- **Quality**: Accuracy and standard of the work produced.
- **Communication**: Effectiveness of collaboration and information sharing.
- **Learning**: Growth in skills and acquisition of new knowledge.

The **Overall Score** is a derived value calculated from these four metrics.

## User Flow & CRUD Operations
- **Creating a Review**:
    1. User clicks "Add Review" in the `PerformanceTracker`.
    2. User is navigated to the review creation page.
    3. User enters scores, highlights, blockers, and notes.
    4. `addReview` action is dispatched to the Redux store.
- **Editing a Review**:
    1. User clicks a `ReviewCard` or the edit icon.
    2. User is navigated to the review edit page for that specific ID.
    3. User modifies the review details.
    4. `updateReview` action is dispatched to the Redux store.
- **Deleting a Review**:
    1. User clicks the trash icon on a `ReviewCard`.
    2. `AlertDialog` prompts for confirmation.
    3. `deleteReview` action is dispatched to remove the review from the store.

## Technical Implementation
- **State Management**: Managed via `performanceSlice` in Redux, handling the collection of reviews and providing actions for CRUD operations and bulk clearing.
- **Data Model**: Defined in `lib/types/performance.ts`, using a `Review` interface that separates quantitative metrics from qualitative feedback (highlights, blockers, improvements).
- **Filtering & Sorting**: Reviews are filtered by `ReviewPeriod` and sorted by `createdAt` in descending order to ensure the most recent reflections are shown first.

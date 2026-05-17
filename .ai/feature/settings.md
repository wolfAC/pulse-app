# Settings Feature

## Overview
The Settings feature allows users to manage their local profile, customize the application's appearance, configure notifications, secure their account, and manage their data. Since Pulse is local-first, these settings are stored on the user's device.

## Core Components
- **Profile Section**: Allows users to update their full name and email address.
- **Appearance Section**:
    - **Theme Selector**: Toggle between Light, Dark, and System themes.
    - **Currency Selector**: Change the default currency used across the financial dashboard.
    - **Primary Color Picker**: A set of color presets (Violet, Blue, Cyan, Green, Amber, Rose, Pink, Orange) that dynamically update the app's accent colors.
- **Notifications Section**: Toggle preferences for budget alerts and the "Remember Me" session setting.
- **Security Section**: Interface to update the 4-6 digit security PIN.
- **Data Management**:
    - **Export Data**: Generates a JSON backup file of the entire application state.
    - **Import Data**: Allows users to restore or merge their data from a previously exported JSON backup.
- **Danger Zone**: Critical actions including "Sign Out" and "Delete All Data" (which permanently wipes all local storage).

## User Flow & CRUD Operations
- **Updating Profile**: User modifies name/email and clicks "Save Changes," which updates the user profile in the Redux store.
- **Customizing Look**: Selecting a theme or color immediately updates the UI via CSS variables and the `app` slice in Redux.
- **Securing Account**: User enters a new PIN; the system validates the length (4-6 digits) before updating the `auth` slice.
- **Data Backup/Restore**:
    - **Export**: Serializes the current Redux state to a JSON blob and triggers a browser download.
    - **Import**: Reads a JSON file, parses it, and dispatches an `IMPORT_STATE` action to merge the backup into the current state.
- **Account Reset**: The "Delete All Data" flow triggers a confirmation dialog before clearing the store and redirecting to the login page.

## Technical Implementation
- **State Management**: Distributed across `app` (theme, currency, colors) and `auth` (profile, PIN) slices.
- **Dynamic Styling**: The primary color picker modifies CSS variables (`--primary`, `--ring`, etc.) on the document root for an immediate global theme update.
- **Local Storage**: Leverages Redux with persistence (implied) to keep settings local to the device.
- **Theme Integration**: Integrates with `next-themes` for system-level theme management.

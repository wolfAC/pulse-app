# Help & Support Feature

## Overview
The Help system (implemented as the Support page) provides users with a direct channel to communicate with the developers. It is designed to collect structured feedback, bug reports, and feature requests to improve the application.

## Core Components
- **Category Selector**: A set of specialized cards that allow users to classify their request:
    - **General Feedback**: For sharing thoughts and opinions.
    - **Bug Report**: For reporting technical malfunctions.
    - **Feature Request**: For suggesting new functionality.
- **Message Form**: A structured input area that includes:
    - **Reply-to Email**: Automatically populated with the current user's email.
    - **Subject Line**: An optional field for a brief summary of the request.
    - **Message Area**: A textarea with dynamic placeholders based on the selected category.
- **Submission System**: A robust handler that manages "Sending", "Success", and "Error" states.
- **Direct Contact**: A fallback "mailto" link for users who prefer using their own email client.

## Communication Categories
The system uses a categorized approach to ensure requests are routed correctly:
- **Feedback**: Focused on "what you love" and "what could be better".
- **Bugs**: Focused on "what happened", "expectations", and "reproduction steps".
- **Features**: Focused on "what's missing" and "how it would help".

## User Flow
1. **Categorization**: The user selects a category (Feedback, Bug, or Feature). This updates the UI colors and the input placeholders.
2. **Composition**: The user provides their contact email, a subject, and the detailed message.
3. **Submission**: On click, the system validates that a message exists and enters a "sending" state.
4. **Confirmation**: Upon a successful API call, a success card is shown with an option to "Send another" or "Go back".

## Technical Implementation
- **Email Integration**: Uses the `@emailjs/browser` library to send messages directly from the client side to a specified EmailJS service.
- **Configuration**: Relies on environment variables (`NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`) for secure service connection.
- **UI State**: Uses a local state machine (`idle` $\to$ `sending` $\to$ `success` or `error`) to manage the form's lifecycle.
- **Context Awareness**: Automatically retrieves the logged-in user's name and email from the Redux `auth` slice to pre-fill the contact form.

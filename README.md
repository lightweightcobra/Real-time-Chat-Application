# Real-Time Chat Application with Supabase

A modern, WhatsApp-inspired chat application built with real-time messaging and Supabase for authentication and data management. This project supports email-based authentication, user profile creation, contact management, group chats, and a rich UI with real-time message updates.

## Live Demo

Check out the live application here: [Real-Time Chat](https://adirealtimechat-5rlyp84o4-adityakumaradk5-gmailcoms-projects.vercel.app/chat)

## Screenshots

Below are screenshots showcasing key features of the application. (Replace these placeholder images with actual screenshots by updating the file paths or URLs.)
![Chat Interface](https://github.com/user-attachments/assets/b834e2b5-c5ba-40b5-b568-d8d9f0bd3d8a)

![Chat List](https://github.com/user-attachments/assets/dff07909-24c9-4d26-bd72-8ac10426d5a9)

![Group Creation Dialog](https://github.com/user-attachments/assets/9aec825c-8404-41bb-9515-134a259e8c9e)

![Right Sidebar](https://github.com/user-attachments/assets/7a47d73a-c188-4568-83b0-6d561b73d693)

## Features

### Authentication
- **Supabase Authentication**: Secure email-based authentication with session management and auto-refresh.
- **Sign Up**: Users provide email, username, phone number, and password. Email verification is supported (if enabled).
- **Sign In**: Login with email and password, with automatic redirects to the chat interface.
- **Session Management**: Persistent login across browser sessions, automatic logout on session expiry, and proper cleanup of auth listeners.
- **Error Handling**: Robust handling of authentication failures with user-friendly loading states.

### User Profiles
- Automatic creation of a profile record in the `profiles` table upon sign-up, storing username and phone number.

### Chat Interface
- **Sidebar Navigation**: Left sidebar for navigating between chats, contacts, and groups.
- **Chat List**: Displays all conversations with a preview of the last message.
- **Chat Window**: Shows the full conversation with timestamps and support for document/image attachments.
- **Right Sidebar**: Toggles to display chat/group details, shared media, documents, links, and starred messages.

### Contact Management
- **Add Contact Dialog**: Allows users to add new contacts with name and phone number, including validation.
- **Immediate Availability**: Newly added contacts are instantly available for messaging.

### Group Chats
- **Create Group Dialog**: Users can set a group name and select contacts to add as participants.
- **Group Management**: Groups appear in the chat list and can be managed via the right sidebar.

### Real-Time Messaging
- **Supabase Integration**: Uses Supabase for real-time message updates via subscriptions (simulated in code with comments for actual implementation).
- **Instant Updates**: Messages appear in real-time without requiring a page refresh.

### Enhanced UI
- **WhatsApp-Like Experience**: Modern, responsive design with an emoji picker for message input.
- **Interactive Elements**: Buttons for adding contacts, creating groups, and toggling the right sidebar.
- **Rich Chat List**: Displays conversation previews and group details.

## Prerequisites
- Node.js (v16 or higher)
- Supabase account and project
- Basic knowledge of JavaScript, React (or your chosen frontend framework), and Supabase

## Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/lightweightcobra/Real-time-Chat-Application.git

2. **Install Dependencies**
   ```bash
   npm install
3. **Set Up Supabase**
  - Create a Supabase project at supabase.com.
  -  Enable Realtime for the `messages` table in the Supabase dashboard.
  - Configure authentication providers (e.g., email, Google) under Authentication > Providers.
  - Create the following tables in your Supabase database:
    - `profiles` (columns: `id`, `username`, `phone_number`)
    - `contacts` (columns: `id`, `user_id`, `name`, `phone_number`)
    - `groups` (columns: `id`, `name`, `created_by`)
    - `group_members` (columns: `group_id`, `user_id`)
    - `messages` (columns: `id`, `chat_id`, `sender_id`, `content`, `created_at`, `type`)
    - Copy your Supabase project's `anon` key and URL.
   
4. **Configure Environment Variables**
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
5. **Run the Application**
   ```bash
   npm run dev


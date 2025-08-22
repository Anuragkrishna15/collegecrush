# CollegeCrush 💖

**Tagline:** _Beyond the Swipe. Real Connections._

CollegeCrush is a Gen-Z-focused dating and real-world meetup platform designed exclusively for verified college students in India. Moving beyond simple swiping, it integrates unique features like AI-powered suggestions, location-based blind date proposals, group trips, and campus event discovery to foster genuine connections and real-world interactions.

## ✨ Core Features

The application is a feature-rich platform with a modern, responsive UI. Here's a breakdown of what's currently implemented:

### User Experience & Onboarding
- **Student-Only Verification:** Secure sign-up and sign-in process restricted to specific college email domains, ensuring an exclusive and safe community.
- **Detailed Onboarding:** A multi-step process for new users to create a rich profile, including photo uploads, bio, interests (tags), and conversational prompts.
- **Profile Management:** Users can easily edit their profiles, reorder photos via drag-and-drop, and update their personal information.

### Matching & Connection
- **Classic Swiping:** A smooth, animated swipe interface (powered by Framer Motion) for discovering other student profiles.
- **Real-time Matching:** Get instant pop-up notifications when a mutual like occurs.
- **"Who Likes You" Screen:** A premium feature allowing users to see a grid of everyone who has liked them. Free users see a blurred teaser to encourage upgrading.

### Real-time Chat
- **Instant Messaging:** A fully-featured chat interface with real-time message delivery via Supabase subscriptions.
- **AI-Powered Icebreakers:** A "Sparkles" button suggests creative, context-aware opening lines based on the other user's profile, powered by the Gemini API.
- **AI "Rizz Meter":** After a few messages, users can get their conversation analyzed by the Gemini API for a "Rizz Score" and constructive feedback.

### Unique Dating & Social Features
- **Location-Based Blind Dates:** A premium feature where users can propose a date at a real-world café. The app uses the Gemini API to suggest nearby, date-appropriate locations. Other nearby users can see and accept these open proposals.
- **VibeCheck System:** After a blind date, both users can submit feedback. A mutual "good" vibe results in an official match, unlocking the chat feature.
- **Group Trips & Getaways:** Users can browse and book spots on curated "Stranger Trips," creating opportunities for group social activities.
- **Campus Events:** A dedicated screen to discover and RSVP to events happening at various colleges.

### Monetization & Premium Tiers
- **Multi-Tier Membership:** The app includes Free, Trial, and Premium plans, each unlocking more features.
- **Simulated Payments:** A mock payment flow using the Cashfree SDK structure is in place to handle upgrades.
- **Profile Boost:** A premium feature allowing users to temporarily increase their profile's visibility in the swipe deck.

### Technology & UI/UX
- **Modern UI:** A sleek, dark-mode-first interface built with Tailwind CSS.
- **Fluid Animations:** Smooth page transitions and interactive elements powered by Framer Motion.
- **Responsive Design:** A unified experience across mobile (bottom nav) and desktop (sidebar).
- **Real-time Functionality:** Leverages Supabase Realtime subscriptions for live updates on chats, likes, and notifications.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion
- **Backend-as-a-Service (BaaS):** Supabase
  - **Database:** PostgreSQL for all data storage.
  - **Authentication:** Manages user sign-up, sign-in, and session handling.
  - **Storage:** Securely hosts user-uploaded profile pictures with RLS policies.
  - **Realtime:** Powers live chat, notifications, and dynamic UI updates.
  - **Edge Functions (Concept):** The architecture relies on secure server-side logic, implemented via Supabase Database Functions (PL/pgSQL).
- **AI Integration:** Google Gemini API (`@google/genai`) for intelligent feature enhancements.
- **Payments:** Cashfree SDK (currently in a simulated test mode).
- **UI Components:** Lucide React for a comprehensive and consistent icon set.

## 🚀 Project Setup

To get a local instance of CollegeCrush running, you need to set up a Supabase project and configure it correctly.

### 1. Supabase Project Setup

1.  **Create a Project:** Go to [supabase.com](https://supabase.com) and create a new project.
2.  **Database Setup:**
    - Navigate to the **SQL Editor** in your Supabase project.
    - Open the `database_setup.html` file from this repository.
    - Copy the entire SQL script and run it in the editor. This will create all the necessary tables, functions, triggers, and Row Level Security (RLS) policies.
3.  **Storage Setup:**
    - Go to the **Storage** section in Supabase.
    - Open the `storage_setup.html` file.
    - In the SQL Editor, run the script under **"1. Storage Bucket"** to create the `profile-pics` bucket.
    - Then, run the script under **"2. Storage Policies"** to apply the necessary security rules for file access.
4.  **Email Template:**
    - Go to **Authentication -> Email Templates**.
    - Open the `supabase_email_template.html` file.
    - Copy its content and paste it into the "Magic Link" email template in Supabase. This provides a styled OTP email for users.

### 2. Environment Variables

The application expects the following environment variables to be available:

-   `API_KEY`: Your API key for the Google Gemini API.

The Supabase URL and Anon Key are currently hardcoded in `services/supabase.ts` for simplicity in this development environment, but would typically be environment variables as well.

### 3. Running the Application

This project is built as a static web app that leverages ES modules loaded via CDN (`esm.sh`). There is no build step required.

-   Simply open the `index.html` file in a modern web browser.

## 👥 The Team

-   **Anurag:** Team Leader & Frontend Developer
-   **Abhay:** Backend (Database & Auth)
-   **Shaurya:** Backend (API & Logic)
-   **Gauransh:** Frontend (UI & Responsiveness)

# Mira — Smart Reminders That Think With You

> **"Your mind is for having ideas, not holding them."**  
> A calm, private reminder system with automated email alerts powered by Node-cron and Nodemailer.

---

## 🌟 Architecture & Tech Stack

- **Frontend (`/client`)**:
  - React (Vite)
  - React Router DOM v7
  - Axios (with Bearer token auto-injection & 401 interceptors)
  - Tailwind CSS v4
  - Recharts (status distribution & metrics visualization)
  - Lucide React (modern iconography)
  - Google Fonts: *Space Grotesk* (headings) & *Inter* (UI/body)

- **Backend (`/server`)**:
  - Node.js & Express 5
  - MongoDB & Mongoose
  - Node-Cron (runs every minute for atomic reminder dispatch)
  - Nodemailer (responsive HTML emails with inline CSS, XSS escaping, connection timeouts, and HTTPS API fallbacks)

---

## 🎨 Mira Design System

- **Mood**: Deep Space Glassmorphism — immersive, quiet, futuristic, and focused.
- **Color Palette**:
  - Void Background: `#08061A`
  - Space Surface: `#110E2E`
  - Glass Card: `rgba(139, 92, 246, 0.06)` with backdrop blur (20-40px)
  - Core Purple: `#8B5CF6`
  - Core Indigo: `#6366F1`
  - Violet Accent: `#A78BFA`
  - Amber Warning: `#F59E0B` (for overdue reminders and urgent alerts)
  - Emerald Success: `#10B981` (for completed reminders)
  - Text Primary: `#F1F0FA`
  - Text Muted: `rgba(241, 240, 250, 0.5)`
- **Typography**:
  - Headings: `Space Grotesk`
  - Body & UI: `Inter`
- **Micro-Interactions**: Ambient glowing orbs, floating hero mockups, smooth status transitions, accessible dialogs with Escape key handler, toasts, and skeleton loaders.

---

## 🚀 Quick Start Guide

### 1. Backend Setup (`/server`)

1. Open your terminal in the backend directory:
   ```bash
   cd server
   npm install
   ```

2. Configure your environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Configure your database and email credentials (see [Email Configuration](#-email-configuration--nodemailer-setup) below).

3. Start the backend:
   ```bash
   # Development with nodemon
   npm run dev

   # Or standard production start
   npm start
   ```
   The backend will run at `http://localhost:5000`.

---

### 2. Frontend Setup (`/client`)

1. Open your terminal in the client directory:
   ```bash
   cd client
   npm install
   ```

2. Configure your environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Ensure `VITE_API_URL` points to your running backend:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📧 Email Configuration & Nodemailer Setup

The email dispatch system in `server/services/mailer.js` is fully decoupled and configurable entirely via `.env`.

### Supported Providers:
- **SMTP (Gmail / Mailtrap / Brevo)**: Standard TLS SMTP transport
- **Brevo HTTP API (`brevo_api`)**: Bypasses cloud host outbound SMTP port restrictions
- **Resend HTTP API (`resend`)**: Direct HTTPS REST dispatch

### Profile 1: Local Development (Mailtrap Sandbox)
1. Go to [mailtrap.io](https://mailtrap.io) and create a free account.
2. Under **Inboxes** &rarr; **SMTP Settings**, copy credentials to `server/.env`:
   ```env
   EMAIL_PROVIDER=smtp
   SMTP_HOST=sandbox.smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=your_mailtrap_user
   SMTP_PASS=your_mailtrap_password
   MAIL_FROM="Mira" <no-reply@mira.app>
   CLIENT_URL=http://localhost:5173
   ```

---

## 🧪 Testing Email Delivery & Scheduled Cron

### 1. Test Verification Email via Settings UI
- In the app, navigate to **Settings** (`/settings`) and click **"Send test email"**.
- A verification email will be dispatched to your account email address.

### 2. Confirm the Automated Cron Job Works
1. Click **"New reminder"**.
2. Give it a title (e.g. `"Test Cron Notification"`).
3. Set the **Due Date & Time** to **2 minutes in the future**.
4. Set **Notify Me** to **"At due time (0 mins)"**.
5. Save the reminder. Within 2 minutes, the Node-cron worker will claim and send the email.

---

## 📁 Repository Structure

```
smart-reminder/
├── README.md
├── server/
│   ├── .env.example              # Development & production email profiles
│   ├── server.js                 # Express app & MongoDB connection
│   ├── jobs/
│   │   └── reminderJob.js        # Node-cron job with atomic claim & logging
│   ├── services/
│   │   └── mailer.js             # Nodemailer transporter, HTML templates, API fallbacks
│   ├── routes/
│   │   ├── auth.js               # /register, /login, /me, /profile
│   │   ├── reminders.js          # CRUD, /toggle, /complete, /test-email
│   │   └── dashboard.js          # Aggregated dashboard metrics
│   ├── models/
│   │   ├── User.js
│   │   └── Reminder.js
│   └── middleware/
│       └── auth.js
│
└── client/
    ├── .env.example              # VITE_API_URL configuration
    ├── index.html                # Google Fonts & SEO tags
    ├── vite.config.js            # Tailwind v4 & Vite config
    └── src/
        ├── api/                  # Axios instance & API services
        ├── context/              # AuthContext & ToastContext
        ├── components/
        │   ├── common/           # Button, Input, Select, Modal, Card, Badge, Skeleton, EmptyState
        │   ├── layout/           # AppLayout, Sidebar, Topbar, Route Guards
        │   └── reminders/        # ReminderCard, ReminderModal, DeleteConfirmModal
        ├── pages/
        │   ├── LandingPage.jsx   # Hero, floating card mockup, how-it-works, features
        │   ├── LoginPage.jsx     # Split layout with quote panel
        │   ├── RegisterPage.jsx  # Timezone-aware sign up
        │   ├── DashboardPage.jsx # Metrics, circular progress ring, upcoming 5 items
        │   ├── RemindersPage.jsx # Filter tabs, search, sort, status toggle
        │   ├── SettingsPage.jsx  # Timezone picker, profile update, test email button
        │   └── NotFoundPage.jsx  # 404 error page
        └── utils/
            └── date.js           # Timezone formatting, relative times, local datetime
```

# NeoConnect 🚀

A comprehensive Staff Feedback & Complaint Management Platform built for hackathons.
NeoConnect allows staff to securely submit issues/complaints and view their status. It provides Case Managers, the Secretariat, and Admins a powerful suite for tracking, escalating, and resolving cases. The system features an integrated polling mechanism, meeting minutes center, and an analytics dashboard with intelligent hotspot detection.

## Tech Stack
**Frontend:** Next.js (App Router), React, Tailwind CSS, shadcn/ui, Recharts
**Backend:** Node.js, Express, MongoDB, Mongoose
**Authentication:** JWT Token via Cookies/LocalStorage

## Core Features
1. **Role-based Authentication** (Staff, CaseManager, Secretariat, Admin)
2. **Case Lifecycle Management** (New, Assigned, InProgress, Pending, Resolved, Escalated)
3. **Automated Escalation** (7-day rule powered by `node-cron`)
4. **File Uploads** (PDF/Images via `multer`)
5. **Intelligent Hotspot Analytics** (Highlights recurring issues across departments)
6. **Company-wide Polling & Voting**
7. **Transparent Public Hub** (Meeting Minutes and Quarterly Digest)

---

## 🛠️ Project Setup & Installation

Follow these steps to run the application locally.

### 1. Prerequisites
- **Node.js**: v18 or later
- **MongoDB**: The application uses a local MongoDB instance. If not installed, you can install it via:
  ```powershell
  winget install MongoDB.Server
  ```
- **Start MongoDB**: Run this in a terminal to start the database:
  ```powershell
  mongod --dbpath C:\data\db
  ```
  *(Note: Ensure the directory `C:\data\db` exists or use your preferred path)*

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. The `.env` file is already configured to use `mongodb://localhost:27017/neostats`.
4. Start the backend:
   ```bash
   npm start
   ```
   *The Express server will run on `http://localhost:5000`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. The `.env.local` file is already created. It points to the backend API (`http://localhost:5000/api`).
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend will be accessible at `http://localhost:3000`.*

---

## 🧪 Testing the Application

### 1. Registration & Demo Roles
1. Go to `http://localhost:3000/login`.
2. Use the **Register** tab. 
3. *Note*: During registration, you can manually select a demo role from the dropdown (Staff, Case Manager, Secretariat, Admin) to explore different access levels.

### 2. User Journeys
- **As Staff**: Navigate to `/submit` to report an issue. Try uploading a PDF or Image.
- **As Secretariat**: Go to `/cases`, select a case, and assign it to a Case Manager. Navigate to `/polls` and create a company poll.
- **As a Case Manager**: Go to `/cases`, click a case, and add Notes and change its Status to "InProgress" or "Resolved".
- **As Admin**: View the `/analytics` page. To see **Hotspot Detection** in action, create `5` cases with the exact same `Department` and `Category`.

---

## Folder Structure Summary
```text
neoconnect/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Express route controllers (Auth, Cases, Polls, Minutes, Analytics)
│   ├── middleware/      # JWT auth, Multer file upload
│   ├── models/          # Mongoose Schema definitions
│   ├── routes/          # Express route definitions
│   ├── utils/           # node-cron scheduler
│   ├── uploads/         # Uploaded images and PDFs
│   ├── server.js        # Server entrypoint
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/         # Next.js 14 App Router pages (login, dashboard, cases, polls, etc.)
    │   └── components/  # Reusable UI cards, tables, shadcn UI and AuthProvider context
    ├── lib/             # Axios API utility
    ├── tailwind.config.ts
    └── package.json
```

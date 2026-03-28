<div align="center">

<img src="public/logo.png" alt="CodeQuest Logo" width="80" />

# CodeQuest

**A gamified competitive coding platform for the next generation of software engineers.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](/)

[Live Demo](#) · [Report Bug](https://github.com/AyushPandey218/Codequest/issues) · [Request Feature](https://github.com/AyushPandey218/Codequest/issues)

</div>

---

## Overview

CodeQuest is a full-stack, gamified coding platform that makes learning to code feel like a competitive sport. Users solve programming challenges across multiple languages, earn XP, climb leaderboards, and battle rivals in real-time Code Clashes — all within a premium dark-mode interface.

---

## Features

### 🎯 Quest Arena
- **50+ Coding Challenges** across arrays, strings, algorithms, dynamic programming, trees, and more
- **Multi-language execution** — Python, JavaScript, Java, C++, Go, Rust, C#, TypeScript, Ruby
- **Always-visible test cases** — see input/expected output before running, actual output after
- **Instant feedback** — pass/fail per test case with execution time

### 📚 Learning Academy
- **Structured module tracks** for Python, JavaScript, Java, C++, SQL, and TypeScript
- **Lesson-based curriculum** with interactive code examples
- **Progress tracking** per module and lesson

### ⚔️ Code Clash (Live PvP)
- **1v1 real-time** competitive coding duels
- **ELO-based ranking** — win to climb, lose to fall
- **Arena stats** — match history, win rate, competitive standing

### 🏆 Leaderboard
- **3D animated podium** for the top 3 players
- **Time-based filters** — Today, Weekly, Monthly, All-Time
- **Live sync** via Firestore real-time listeners
- **Quick-view profile modal** for any player

### 👤 Profile & Achievements
- XP, level, and streak tracking
- Achievement badges (unlockable milestones)
- Submission history and language proficiency stats
- Public profile pages

### 🔐 Authentication
- Email/password and Google OAuth sign-in
- Role-based access (Admin / User)
- Admin panel for quest and user management

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS |
| **Code Editor** | Monaco Editor |
| **Backend / DB** | Firebase Firestore, Firebase Auth |
| **Code Execution** | Pyodide (Python/WASM), Web Worker (JS), OneCompiler API (compiled languages) |
| **Deployment** | Vercel (frontend + serverless functions) |

---

## Architecture

```
CodeQuest/
├── api/
│   └── execute.js          # Vercel serverless function → OneCompiler API
├── public/
│   └── js-runner.worker.js # Sandboxed Web Worker for JavaScript execution
├── src/
│   ├── components/         # Reusable UI (Button, Card, Badge, CodeEditor...)
│   ├── config/
│   │   └── firebase.js     # Firebase init + Demo Mode detection
│   ├── context/            # Auth, User, Notification context providers
│   ├── data/               # 50 quest definitions + learning module content
│   ├── hooks/              # useQuest, useTestCases, useLeaderboard...
│   ├── pages/              # All route-level page components
│   └── utils/
│       ├── codeExecutor.js # Execution orchestrator (Pyodide / Worker / API)
│       └── achievementChecker.js
├── vercel.json             # Routing config (SPA + API function)
└── vite.config.js          # Dev server with inline OneCompiler proxy
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- A Firebase project ([create one free](https://console.firebase.google.com))

### 1. Clone & Install

```bash
git clone https://github.com/AyushPandey218/Codequest
cd Codequest
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

ONECOMPILER_API_KEY=your_onecompiler_key
```

> **Demo Mode:** Leave the Firebase variables as placeholders and the app will run fully with mock data — no Firebase account needed.

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

1. Push your repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Set the environment variables (same as `.env.local`) in **Vercel → Settings → Environment Variables**
4. Deploy

Vercel automatically detects Vite and handles the `api/execute.js` serverless function.

---

## Code Execution Model

| Language | Runs In | Requires API? |
|---|---|---|
| Python 3 | Browser (Pyodide WASM) | ❌ No |
| JavaScript | Browser (Web Worker) | ❌ No |
| Java, C++, Go, Rust, C, C#, Ruby, TypeScript | Vercel Serverless → OneCompiler | ✅ Free key |

---

## Author

**Ayush Pandey**
[GitHub](https://github.com/AyushPandey218)

---

## License

Private — All rights reserved © 2026 Ayush Pandey.

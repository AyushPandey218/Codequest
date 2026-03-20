<p align="center">
  <h1 align="center">🚀 CODEQUEST</h1>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/Vite-5-purple?logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-EF4E7B?logo=framer" />
  <img src="https://img.shields.io/badge/Status-Active-success" />
</p>

------------------------------------------------------------------------

> **Warning:** May cause sudden urge to rewrite everything in TypeScript 🤓

------------------------------------------------------------------------

## 📚 Table of Contents

-   [Overview](#-overview)
-   [Features](#-features)
-   [Technology Stack](#-technology-stack)
-   [Project Structure](#-project-structure)
-   [Getting Started](#-getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Environment Variables](#environment-variables)
    -   [Installation](#installation)
-   [Usage](#️-usage)
-   [Deployment](#-deployment)
-   [Future Improvements](#-future-improvements)
-   [Contributors](#-contributors)
-   [License](#-license)

------------------------------------------------------------------------

## 📖 Overview

**CodeQuest** is an immersive, gamified coding platform built with a modern React + Vite architecture. It transforms the learning experience into an epic adventure — guiding developers through structured quests, real-time coding battles, and a vibrant community, all powered by Firebase.

------------------------------------------------------------------------

## ✨ Features

### 🎮 Quest System
- Browse and select from a curated set of programming quests
- Structured modules with **Lessons**, **Code Walkthroughs**, and **Debugging Challenges**
- In-browser code editor powered by **Monaco Editor** (the same engine as VS Code)
- Real-time code writing and quest progression tracking

### ⚔️ Code Clash (Live PvP)
- Real-time competitive coding battles — **CodeClash Lobby** and **LiveCodeClash** arena
- Post-match **Clash Results** summary with scores and rankings

### 🏆 Dashboard & Leaderboard
- Personal **Dashboard** showing quest progress, stats, and activity
- **Progress Screen** with detailed level-by-level tracking
- Global **Leaderboard** to rank against other developers

### 💬 Community Forum
- Create, view, and discuss posts in the **Community Forum**
- Full **Post View** with threaded discussions
- **Contact Support** page for help and feedback

### 👤 Auth & Profile
- Full authentication flow: **Sign Up**, **Login**, **Password Recovery**, **Email Verification**
- Google OAuth support via Firebase
- **Profile** management with editable user details

### ⚙️ Settings & Legal
- **Settings** page for account preferences
- **Privacy Policy** and legal pages

### 🛠️ Admin Panel
- Protected admin routes for platform management

------------------------------------------------------------------------

## 💻 Technology Stack

### Core Frameworks & Build Tools
| Technology | Purpose |
|---|---|
| **[React 18](https://react.dev/)** | UI library with hooks and functional components |
| **[Vite 5](https://vitejs.dev/)** | Lightning-fast dev server and optimized builds |
| **[React Router DOM v6](https://reactrouter.com/)** | Declarative client-side routing |

### Styling & Animation
| Technology | Purpose |
|---|---|
| **[Tailwind CSS v3](https://tailwindcss.com/)** | Utility-first CSS for rapid UI development |
| **[@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms)** | Consistent base styles for form elements |
| **[Framer Motion 12](https://www.framer.com/motion/)** | Smooth, production-ready animations and transitions |
| **[Lucide React](https://lucide.dev/)** | Clean, consistent icon library |

### Code Editor
| Technology | Purpose |
|---|---|
| **[@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)** | Full-featured VS Code-like editor in the browser |

### Backend & Services
| Technology | Purpose |
|---|---|
| **[Firebase 12](https://firebase.google.com/)** | Authentication, Firestore database, and cloud services |

### Code Quality
| Technology | Purpose |
|---|---|
| **[ESLint](https://eslint.org/)** | Code quality and consistent standards |
| **PostCSS + Autoprefixer** | CSS transformations and cross-browser compatibility |

------------------------------------------------------------------------

## 📁 Project Structure

```
Codequest/
│
├── public/                  # Static assets (logo, images, landing video)
├── src/
│   ├── components/
│   │   ├── auth/            # Auth-related UI components
│   │   ├── code/            # Code editor components
│   │   ├── common/          # Shared/reusable components (BlurText, etc.)
│   │   └── landing/         # Landing page hero components (SpaceHero)
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── auth/            # Login, Signup, Password Recovery, Email Verification
│   │   ├── quests/          # QuestSelection, QuestCoding, LessonView, ModuleDetail, etc.
│   │   ├── clash/           # CodeClashLobby, LiveCodeClash, ClashResults
│   │   ├── dashboard/       # Dashboard, Leaderboard, ProgressScreen
│   │   ├── community/       # CommunityForum, PostView, ContactSupport
│   │   ├── profile/         # User profile pages
│   │   ├── admin/           # Admin panel pages
│   │   ├── settings/        # Settings page
│   │   └── legal/           # Privacy Policy and legal pages
│   │
│   ├── context/             # React context providers (AuthContext, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Route layouts and wrappers
│   ├── router/              # App router configuration
│   ├── data/                # Static/mock data files
│   ├── config/              # Firebase and app configuration
│   ├── utils/               # Utility functions
│   ├── styles/              # Global CSS styles
│   └── App.jsx
│
├── .env.example             # Environment variable template
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json              # Vercel deployment config (SPA rewrites)
```

------------------------------------------------------------------------

## 🛠 Getting Started

### Prerequisites

Make sure you have the following installed:

-   **Node.js** (v16 or higher)
-   **npm** (v8 or higher)

Check versions:

```bash
node -v
npm -v
```

------------------------------------------------------------------------

### Environment Variables

Copy the example env file and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

Open `.env.local` and configure all required variables (Firebase API key, project ID, etc.). See `.env.example` for the full list of required keys.

------------------------------------------------------------------------

### Installation

**1️⃣ Clone the repository:**

```bash
git clone https://github.com/AyushPandey218/Codequest
cd Codequest
```

**2️⃣ Install dependencies:**

```bash
npm install
```

**3️⃣ Set up environment variables** (see above).

------------------------------------------------------------------------

## ▶️ Usage

Run the development server:

```bash
npm run dev
```

The app will start at:

```
http://localhost:5173
```

**Other scripts:**

```bash
npm run build      # Build for production
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
```

------------------------------------------------------------------------

## 🌐 Deployment

CodeQuest is configured for deployment on **[Vercel](https://vercel.com)**.

The `vercel.json` includes SPA rewrite rules to ensure React Router works correctly on page refresh. Simply connect the repository to Vercel and configure your environment variables in the Vercel dashboard.

------------------------------------------------------------------------

## 🔮 Future Improvements

-   🤖 AI-powered code review and hints
-   🏅 Badges and achievement system
-   📊 Detailed analytics and skill tracking
-   🌐 Multiplayer quest collaboration
-   🧪 Expanded unit testing coverage

------------------------------------------------------------------------

## 👨‍💻 Contributors

-   **Ayush Pandey** — [GitHub](https://github.com/AyushPandey218)

------------------------------------------------------------------------

## 📄 License

This project is private. All rights reserved © 2026 Ayush Pandey.

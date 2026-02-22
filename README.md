# CodeQuest React

A modern, gamified coding learning platform built with React, Vite, and TailwindCSS.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
codequest-react/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Button, Input, Card, etc.
│   │   ├── forms/       # Form-specific components
│   │   └── code/        # Code editor components
│   ├── layouts/         # Layout wrappers
│   │   ├── RootLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   └── DashboardLayout.jsx
│   ├── pages/           # Page components
│   │   ├── auth/        # Authentication pages
│   │   ├── dashboard/   # Dashboard pages
│   │   ├── quests/      # Quest pages
│   │   ├── clash/       # Code clash pages
│   │   ├── profile/     # Profile pages
│   │   ├── community/   # Community pages
│   │   ├── settings/    # Settings pages
│   │   └── legal/       # Legal pages
│   ├── features/        # Feature-specific components
│   ├── context/         # Global state (Context API)
│   │   ├── AuthContext.jsx
│   │   └── UserContext.jsx
│   ├── hooks/           # Custom React hooks
│   ├── router/          # React Router configuration
│   ├── utils/           # Helper functions
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── styles/          # Global styles
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── public/              # Static assets
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Design System

### Colors
- **Primary**: `#2b2bee` (vibrant blue)
- **Background Dark**: `#101022`
- **Card Dark**: `#1c1c27`
- **Border Dark**: `#282839`
- **Text Secondary**: `#9d9db9`

### Typography
- **Display Font**: Space Grotesk
- **Body Font**: Noto Sans

### Icons
- Material Symbols Outlined

## 🧩 Components

### Common Components
- `Button` - Customizable button with variants (primary, secondary, outline, ghost, danger)
- `Input` - Input field with icon support and validation states
- `Card` - Base card component with variants (default, glass, elevated, bordered)

### Layouts
- `RootLayout` - Base layout for all pages
- `AuthLayout` - Layout for authentication pages (login, signup, etc.)
- `DashboardLayout` - Main app layout with sidebar navigation

## 🔐 State Management

### Context API
- **AuthContext**: Manages user authentication (login, logout, signup)
- **UserContext**: Manages user progress, stats, and achievements

### Custom Hooks
- `useLocalStorage`: Sync React state with localStorage

## 🛣️ Routing

Built with React Router v6. Main routes:

- `/auth/*` - Authentication pages
- `/app/*` - Protected app pages (requires login)
- `/legal/*` - Legal pages (terms, privacy)

## 🔧 Technologies

- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Context API** - State management

## 📝 Development Notes

### Mock Data
Currently using mock data for:
- User authentication
- User progress and stats
- Quests and challenges
- Leaderboard

Replace with actual API calls in production.

### Responsive Design
All components are responsive and mobile-friendly.

### Dark Mode
Dark mode is enabled by default (primary design).

## 🚧 TODO

See `REACT_CONVERSION_PLAN.md` for detailed conversion roadmap.

### Phase 1: ✅ Foundation (Complete)
- [x] Project setup
- [x] Base components (Button, Input, Card)
- [x] Layouts (Root, Auth, Dashboard)
- [x] Context providers (Auth, User)
- [x] Routing structure

### Phase 2: 🚧 Page Conversion (In Progress)
- [ ] Auth pages (8 pages)
- [ ] Dashboard pages (3 pages)
- [ ] Quest pages (5 pages)
- [ ] Clash pages (3 pages)
- [ ] Profile & Settings (5 pages)
- [ ] Community & Legal (4 pages)

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using React + Vite + TailwindCSS

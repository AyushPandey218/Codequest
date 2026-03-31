import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import AdminLayout from '../layouts/AdminLayout'


// Auth Pages
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import CreateAccount from '../pages/auth/CreateAccount'
import EmailVerificationSent from '../pages/auth/EmailVerificationSent'
import EmailVerified from '../pages/auth/EmailVerified'
import PasswordRecovery from '../pages/auth/PasswordRecovery'
import PasswordRecoveryConfirmation from '../pages/auth/PasswordRecoveryConfirmation'
import NewPasswordSetup from '../pages/auth/NewPasswordSetup'
import PasswordChanged from '../pages/auth/PasswordChanged'

// Dashboard Pages
import Dashboard from '../pages/dashboard/Dashboard'
import Leaderboard from '../pages/dashboard/Leaderboard'
import ProgressScreen from '../pages/dashboard/ProgressScreen'

// Quest Pages
import QuestSelection from '../pages/quests/QuestSelection'
import QuestCoding from '../pages/quests/QuestCoding'
import CodeWalkthrough from '../pages/quests/CodeWalkthrough'
import DebuggingChallenge from '../pages/quests/DebuggingChallenge'
import ProjectModules from '../pages/quests/ProjectModules'
import ModuleDetail from '../pages/quests/ModuleDetail'
import LessonView from '../pages/quests/LessonView'
import LearningPaths from '../pages/quests/LearningPaths'
import PathDetail from '../pages/quests/PathDetail'
import AcademyHub from '../pages/quests/AcademyHub'
import ArenaHub from '../pages/clash/ArenaHub'

// Learn Pages
import LearnLanding from '../pages/learn/LearnLanding'
import LearnHub from '../pages/learn/LearnHub'
import LessonPage from '../pages/learn/LessonPage'


// Clash Pages
import CodeClashLobby from '../pages/clash/CodeClashLobby'
import LiveCodeClash from '../pages/clash/LiveCodeClash'
import ClashResults from '../pages/clash/ClashResults'

// Profile Pages
import UserProfile from '../pages/profile/UserProfile'
import EditProfile from '../pages/profile/EditProfile'
import AccountSettings from '../pages/profile/AccountSettings'

// Settings Pages
import AppSettings from '../pages/settings/AppSettings'

// Community Pages
import CommunityForum from '../pages/community/CommunityForum'
import PostView from '../pages/community/PostView'
import ContactSupport from '../pages/community/ContactSupport'

// Admin Pages
import AdminQuestManager from '../pages/admin/AdminQuestManager'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from '../pages/admin/AdminUsers'
import AdminModeration from '../pages/admin/AdminModeration'
import AdminAnalytics from '../pages/admin/AdminAnalytics'
import AdminTickets from '../pages/admin/AdminTickets'

// Legal Pages
import TermsOfService from '../pages/legal/TermsPage'
import PrivacyPolicy from '../pages/legal/PrivacyPage'

// Landing Page
import LandingPage from '../pages/LandingPage'
import MaintenancePage from '../pages/MaintenancePage'
import MaintenanceGuard from './MaintenanceGuard'

// Placeholder components (will be created in next phases)
const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
      <p className="text-text-secondary">This page will be implemented soon.</p>
    </div>
  </div>
)

const AppLayoutWrapper = () => {
  return <DashboardLayout />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'maintenance',
        element: <MaintenancePage />,
      },
      {
        index: true,
        element: (
          <MaintenanceGuard>
            <LandingPage />
          </MaintenanceGuard>
        ),
      },

      // Auth Routes
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'signup',
            element: <Signup />,
          },
          {
            path: 'create-account',
            element: <CreateAccount />,
          },
          {
            path: 'email-verification-sent',
            element: <EmailVerificationSent />,
          },
          {
            path: 'email-verified',
            element: <EmailVerified />,
          },
          {
            path: 'password-recovery',
            element: <PasswordRecovery />,
          },
          {
            path: 'password-recovery-confirmation',
            element: <PasswordRecoveryConfirmation />,
          },
          {
            path: 'reset-password',
            element: <NewPasswordSetup />,
          },
          {
            path: 'password-changed',
            element: <PasswordChanged />,
          },
        ],
      },
      // Protected App Routes
      {
        path: 'app',
        element: (
          <MaintenanceGuard>
            <AppLayoutWrapper />
          </MaintenanceGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'progress',
            element: <ProgressScreen />,
          },
          {
            path: 'leaderboard',
            element: <Leaderboard />,
          },
          // Quest Routes
          {
            path: 'quests',
            element: <QuestSelection />,
          },
          {
            path: 'quests/:questId',
            element: <QuestCoding />,
          },
          {
            path: 'quests/:questId/walkthrough',
            element: <CodeWalkthrough />,
          },
          {
            path: 'quests/:questId/debug',
            element: <DebuggingChallenge />,
          },
          {
            path: 'modules',
            element: <ProjectModules />,
          },
          {
            path: 'modules/:moduleId',
            element: <ModuleDetail />,
          },
          {
            path: 'modules/:moduleId/lessons/:lessonId',
            element: <LessonView />,
          },
          {
            path: 'paths',
            element: <LearningPaths />,
          },
          {
            path: 'paths/:pathId',
            element: <PathDetail />,
          },
          {
            path: 'academy',
            element: <AcademyHub />,
          },
          // Learn Routes
          {
            path: 'learn',
            element: <LearnLanding />,
          },
          {
            path: 'learn/:trackId',
            element: <LearnHub />,
          },
          {
            path: 'learn/:trackId/:moduleId/:lessonId',
            element: <LessonPage />,
          },
          {
            path: 'arena',
            element: <ArenaHub />,
          },
          {
            path: 'clash',
            element: <CodeClashLobby />,
          },
          // Profile Routes
          {
            path: 'profile/edit',
            element: <EditProfile />,
          },
          {
            path: 'profile/:userId',
            element: <UserProfile />,
          },
          {
            path: 'settings/account',
            element: <AccountSettings />,
          },
          {
            path: 'settings/app',
            element: <AppSettings />,
          },
          // Community Routes
          {
            path: 'community',
            element: <CommunityForum />,
          },
          {
            path: 'community/post/:id',
            element: <PostView />,
          },
          {
            path: 'support',
            element: <ContactSupport />,
          },
        ],
      },
      // Clash Routes (Moved outside DashboardLayout for full-screen experience)
      {
        path: 'app/clash/:clashId/live',
        element: <LiveCodeClash />,
      },
      {
        path: 'app/clash/:clashId/results',
        element: <ClashResults />,
      },
      // Legal Routes
      {
        path: 'legal',
        children: [
          {
            path: 'terms',
            element: <TermsOfService />,
          },
          {
            path: 'privacy',
            element: <PrivacyPolicy />,
          },
        ],
      },
      // 404 Not Found
      {
        path: '*',
        element: <PlaceholderPage title="404 - Page Not Found" />,
      },
    ],
  },
  // Dedicated Admin Panel Routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'users',
        element: <AdminUsers />,
      },
      {
        path: 'quests',
        element: <AdminQuestManager />,
      },
      {
        path: 'moderation',
        element: <AdminModeration />,
      },
      {
        path: 'moderation/post/:id',
        element: <PostView />,
      },
      {
        path: 'analytics',
        element: <AdminAnalytics />,
      },
      {
        path: 'tickets',
        element: <AdminTickets />,
      },
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
})

export default router

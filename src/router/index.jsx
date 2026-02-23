import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'

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
import ContactSupport from '../pages/community/ContactSupport'

// Admin Pages
import AdminQuestManager from '../pages/admin/AdminQuestManager'
import AdminRoute from '../components/common/AdminRoute'

// Legal Pages
import TermsOfService from '../pages/legal/TermsPage'
import PrivacyPolicy from '../pages/legal/PrivacyPage'

// Placeholder components (will be created in next phases)
const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
      <p className="text-text-secondary">This page will be implemented soon.</p>
    </div>
  </div>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
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
        element: <DashboardLayout />,
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
          // Clash Routes
          {
            path: 'clash',
            element: <CodeClashLobby />,
          },
          {
            path: 'clash/:clashId/live',
            element: <LiveCodeClash />,
          },
          {
            path: 'clash/:clashId/results',
            element: <ClashResults />,
          },
          // Profile Routes
          {
            path: 'profile/:userId',
            element: <UserProfile />,
          },
          {
            path: 'profile/edit',
            element: <EditProfile />,
          },
          {
            path: 'settings/account',
            element: <AccountSettings />,
          },
          {
            path: 'settings/app',
            element: <AppSettings />,
          },
          // Admin Routes (protected - admin only)
          {
            path: 'admin',
            element: <AdminRoute />,
            children: [
              {
                path: 'quests',
                element: <AdminQuestManager />,
              },
            ],
          },
          // Community Routes
          {
            path: 'community',
            element: <CommunityForum />,
          },
          {
            path: 'support',
            element: <ContactSupport />,
          },
        ],
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
])

export default router

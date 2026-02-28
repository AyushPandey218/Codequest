import { Outlet, Link, NavLink, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'
import { useState } from 'react'
import Avatar from '../components/common/Avatar'
import LoadingScreen from '../components/common/LoadingScreen'
import NotificationCenter from '../components/common/NotificationCenter'
import { useNotification } from '../context/NotificationContext'

/**
 * Dashboard Layout - Main app layout with sidebar navigation
 * Used for: Dashboard, Quests, Leaderboard, Profile, Settings, etc.
 */
const DashboardLayout = () => {
  const { user, isAuthenticated, isLoading, logout, isAdmin } = useAuth()
  const { userStats } = useUser()
  const { unreadCount } = useNotification()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // Show loading screen while auth initializes
  if (isLoading) {
    return <LoadingScreen />
  }

  // Guard: redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const navigationItems = [
    { path: '/app/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/app/quests', icon: 'explore', label: 'Quests' },
    { path: '/app/modules', icon: 'school', label: 'Modules' },
    { path: '/app/clash', icon: 'swords', label: 'Code Clash' },
    { path: '/app/leaderboard', icon: 'leaderboard', label: 'Leaderboard' },
    { path: '/app/progress', icon: 'trending_up', label: 'Progress' },
    { path: `/app/profile/${user?.username || 'user'}`, icon: 'person', label: 'Profile' },
    { path: '/app/community', icon: 'forum', label: 'Community' },
  ]

  const bottomNavItems = [
    { path: '/app/settings/account', icon: 'settings', label: 'Settings' },
    { path: '/app/support', icon: 'help', label: 'Support' },
  ]

  const adminNavItems = [
    { path: '/app/admin/quests', icon: 'admin_panel_settings', label: 'Quest Manager' },
  ]

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-card-dark border-r border-border-dark flex flex-col z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-border-dark">
          <Link to="/app/dashboard" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="CodeQuest Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            <h2 className="text-xl font-bold">CodeQuest</h2>
          </Link>
        </div>

        {isAdmin ? (
          /* Admin-only nav: only Quest Manager */
          <nav className="flex-1 overflow-y-auto p-4 pr-2 space-y-1">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-2">Admin Panel</p>
            {adminNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-text-muted hover:text-white hover:bg-[#282839]'
                  }`
                }
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        ) : (
          <>
            {/* Regular Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 pr-2 space-y-1">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-text-muted hover:text-white hover:bg-[#282839]'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Bottom Nav */}
            <div className="p-4 border-t border-border-dark space-y-1">
              {bottomNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                      ? 'bg-[#282839] text-white'
                      : 'text-text-muted hover:text-white hover:bg-[#282839]'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </>
        )}
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>

        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background-dark/80 backdrop-blur-md border-b border-border-dark px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 rounded-lg text-text-muted hover:text-white hover:bg-[#282839] transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">
                {isSidebarOpen ? 'menu_open' : 'menu'}
              </span>
            </button>

            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                CodeQuest
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-sm">local_fire_department</span>
              <span className="text-sm font-bold text-primary">{userStats?.streak || 0} Day Streak</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <span className="material-symbols-outlined text-yellow-400 text-sm">stars</span>
              <span className="text-sm font-bold text-yellow-400">Lvl {userStats?.level || 1}</span>
            </div>

            <div className="relative">
              <NotificationCenter
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
              />
            </div>

            {/* User profile dropdown & logout */}
            <div className="flex items-center gap-2">
              <Link to={`/app/profile/${user?.username || 'user'}`}>
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#282839] cursor-pointer">
                  <Avatar
                    src={user?.avatar || user?.photoURL}
                    name={user?.username || user?.displayName || 'User'}
                    size="sm"
                    ring
                    ringColor="ring-primary"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-bold text-white">{user?.username || 'User'}</p>
                    <p className="text-xs text-text-muted">Level {userStats?.level ?? user?.level ?? '1'}</p>
                  </div>
                </div>
              </Link>
              <button onClick={handleLogout} className="text-text-muted hover:text-white p-2 flex items-center justify-center rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Profile Completion Reminder Banner */}
        {!userStats?.profileCompleted && !isLoading && (
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-500/20 px-4 py-3 flex items-center justify-between animate-fade-in shadow-inner">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 border border-indigo-500/30">
                <span className="material-symbols-outlined text-indigo-400 text-sm">how_to_reg</span>
              </div>
              <p className="text-sm text-indigo-100">
                <strong className="text-white">Profile Incomplete:</strong> Add your bio, university, and website to earn the <span className="font-bold text-indigo-400">Profile Perfectionist</span> achievement! 🏆
              </p>
            </div>
            <Link to="/app/profile/edit" className="whitespace-nowrap ml-4 text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition-colors">
              Complete Profile
            </Link>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-6 relative overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

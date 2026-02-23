import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

/**
 * Dashboard Layout - Main app layout with sidebar navigation
 * Used for: Dashboard, Quests, Leaderboard, Profile, Settings, etc.
 */
const DashboardLayout = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
            <div className="flex items-center justify-center size-9 rounded-lg bg-primary/20 text-primary border border-primary/30">
              <span className="material-symbols-outlined text-xl">terminal</span>
            </div>
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

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card-dark/80 backdrop-blur-md border-b border-border-dark px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-text-muted hover:text-white"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            {/* Search (placeholder) */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xl">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search quests, challenges..."
                  className="w-full bg-[#282839] border border-border-dark rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-text-muted hover:text-white">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User profile dropdown */}
              <Link to={`/app/profile/${user?.username || 'user'}`}>
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#282839] cursor-pointer">
                  <div className="size-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-bold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-bold text-white">{user?.username || 'User'}</p>
                    <p className="text-xs text-text-muted">Level {user?.level || 1}</p>
                  </div>
                </div>
              </Link>
              <button onClick={handleLogout} className="text-text-muted hover:text-white p-2 rounded-lg hover:bg-[#282839]">
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

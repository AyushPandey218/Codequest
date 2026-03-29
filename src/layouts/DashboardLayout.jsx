import { Outlet, Link, NavLink, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GlobalBroadcast from '../components/common/GlobalBroadcast'
import { useUser } from '../context/UserContext'
import { useState, useCallback } from 'react'
import Avatar from '../components/common/Avatar'
import LoadingScreen from '../components/common/LoadingScreen'
import NotificationCenter from '../components/common/NotificationCenter'
import { useNotification } from '../context/NotificationContext'
import confetti from 'canvas-confetti'
import { motion, useAnimation } from 'framer-motion'

const DashboardLayout = () => {
  const { user, isAuthenticated, isLoading, logout, isAdmin, updateXP, updateProfile } = useAuth()
  const { userStats } = useUser()
  const { unreadCount, showToast } = useNotification()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [logoClicks, setLogoClicks] = useState(0)
  const logoControls = useAnimation()

  const handleLogoClick = useCallback(async (e) => {
    // Prevent default navigation if we're still clicking for the egg
    if (logoClicks < 10 && !userStats.foundEasterEgg) {
      e.preventDefault()
      const newClicks = logoClicks + 1
      setLogoClicks(newClicks)

      // Visual feedback
      logoControls.start({
        scale: [1, 1.2, 1],
        rotate: [0, 5, -5, 0],
        transition: { duration: 0.2 }
      })

      if (newClicks === 10) {
        // Trigger celebration!
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#8b5cf6', '#ffffff']
        })

        // Award reward
        await updateXP(1000)
        await updateProfile({ foundEasterEgg: true })
        showToast('Wait... That Worked? Secret Found! +1000 XP', 'success')
      }
    }
  }, [logoClicks, userStats.foundEasterEgg, updateXP, updateProfile, showToast, logoControls])

  // ... (rest of the component remains the same, but update Logo Click)
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
    { path: '/app/academy', icon: 'school', label: 'Academy' },
    { path: '/app/learn', icon: 'menu_book', label: 'Learn' },
    { path: '/app/arena', icon: 'shield', label: 'Arena' },
    { path: '/app/community', icon: 'forum', label: 'Community' },
    { path: `/app/profile/${user?.username || 'user'}`, icon: 'person', label: 'Profile' },
  ]

  const bottomNavItems = [
    { path: '/app/settings/account', icon: 'settings', label: 'Settings' },
    { path: '/app/support', icon: 'help', label: 'Support' },
  ]

  const adminNavItems = [
    { path: '/app/admin/quests', icon: 'admin_panel_settings', label: 'Quest Manager' },
  ]

  return (
    <div className="min-h-screen bg-background-dark flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen bg-panel-dark border-r border-border-dark flex flex-col z-50 transition-all duration-300 ${isSidebarOpen
        ? 'w-64 translate-x-0'
        : 'w-20 -translate-x-full lg:translate-x-0'
        }`}>
        {/* Logo & Toggle */}
        <div className={`p-6 border-b border-border-dark flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
          <Link 
            to="/app/dashboard" 
            onClick={handleLogoClick}
            className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity min-w-0"
          >
            <motion.div 
              animate={logoControls}
              className="flex items-center gap-3"
            >
              <img src="/logo.png" alt="CodeQuest Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] flex-shrink-0" />
              {isSidebarOpen && <h2 className="text-xl font-bold truncate">CodeQuest</h2>}
            </motion.div>
          </Link>

          {isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:flex hidden p-2 rounded-lg text-text-muted hover:text-white hover:bg-[#282839] transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">menu_open</span>
            </button>
          )}
        </div>

        {/* Regular Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 pr-2 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isSidebarOpen ? '' : 'justify-center'} ${isActive
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/5'
                  : 'text-text-muted hover:text-white hover:bg-white/5'
                }`
              }
              title={!isSidebarOpen ? item.label : ''}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
          {isAdmin && (
               <NavLink
               to="/admin/dashboard"
               className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-400 hover:bg-red-500/10 mt-4 border border-red-500/20"
             >
               <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
               {isSidebarOpen && <span className="font-medium">Admin Panel</span>}
             </NavLink>
          )}
        </nav>

        {/* Bottom Nav */}
        <div className="p-4 border-t border-border-dark space-y-1">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isSidebarOpen ? '' : 'justify-center'} ${isActive
                  ? 'bg-white/10 text-white'
                  : 'text-text-muted hover:text-white hover:bg-white/5'
                }`
              }
              title={!isSidebarOpen ? item.label : ''}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300`}>
        <GlobalBroadcast />
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background-dark/80 backdrop-blur-md border-b border-border-dark px-3 sm:px-4 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 -ml-2 rounded-lg text-text-muted hover:text-white hover:bg-[#282839] transition-colors ${isSidebarOpen ? 'lg:hidden' : ''}`}
              aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="material-symbols-outlined text-2xl">
                {isSidebarOpen ? 'menu_open' : 'menu'}
              </span>
            </button>

            <div className={`${isSidebarOpen ? 'lg:hidden' : 'block'}`}>
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent truncate max-w-[100px] sm:max-w-none">
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
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-xl transition-all relative group ${isNotificationsOpen ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined text-2xl">
                  {unreadCount > 0 ? 'notifications_active' : 'notifications'}
                </span>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 size-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-background-dark shadow-lg shadow-red-500/40 animate-pulse group-hover:animate-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <NotificationCenter
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
              />
            </div>

            {/* User profile dropdown & logout */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link to={`/app/profile/${user?.username || 'user'}`}>
                <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl hover:bg-[#282839] cursor-pointer">
                  <Avatar
                    src={user?.avatar || user?.photoURL}
                    name={user?.username || user?.displayName || 'User'}
                    size="sm"
                    ring
                    ringColor="ring-primary"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-white">{user?.username || 'User'}</p>
                    <p className="text-xs text-text-muted">Level {userStats?.level ?? user?.level ?? '1'}</p>
                  </div>
                </div>
              </Link>
              <button onClick={handleLogout} className="text-text-muted hover:text-white p-1.5 sm:p-2 flex items-center justify-center rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-xl sm:text-2xl">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Profile Completion Mission Card */}
        {!userStats?.profileCompleted && !isLoading && (
          <div className="px-3 sm:px-4 md:px-8 py-2">
            <div className="relative overflow-hidden group">
              {/* Animated background glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative bg-[#1a1b26]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
                <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    {/* Unique Icon Design */}
                    <div className="relative flex-shrink-0">
                        <div className="size-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 rotate-3 transition-transform group-hover:rotate-6">
                            <span className="material-symbols-outlined text-indigo-400 text-3xl">task_alt</span>
                        </div>
                        <div className="absolute -top-1 -right-1 size-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-[#1a1b26] animate-bounce">!</div>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Primary Mission</span>
                            <div className="size-1 bg-white/20 rounded-full" />
                            <span className="text-[10px] font-bold text-slate-500">Exp: 250 XP</span>
                        </div>
                        <h3 className="text-white font-black text-lg leading-tight mb-1">Complete Your Dossier</h3>
                        <p className="text-slate-400 text-sm max-w-lg">
                            Add your bio, university, and website to establish your legacy and unlock the <span className="text-indigo-400 font-bold">Profile Perfectionist</span> trophy.
                        </p>
                    </div>
                </div>

                <Link 
                    to="/app/profile/edit" 
                    className="group/btn relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-xl hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] w-full sm:w-auto overflow-hidden text-sm"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Complete Profile
                        <span className="material-symbols-outlined text-sm transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                    </span>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-400/50 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 relative overflow-x-hidden min-w-0">
          <div className="mx-auto w-full max-w-[1600px] pb-10 sm:pb-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

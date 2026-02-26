import { Outlet, Link, NavLink, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const AdminLayout = () => {
    const { user, isAdmin, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    if (!isAuthenticated) return <Navigate to="/auth/login" replace />
    if (!isAdmin) return <Navigate to="/app/dashboard" replace />

    const handleLogout = () => {
        logout()
        navigate('/auth/login')
    }

    const navItems = [
        { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard Overview' },
        { path: '/admin/users', icon: 'group', label: 'User Management' },
        { path: '/admin/quests', icon: 'military_tech', label: 'Quest Management' },
        { path: '/admin/moderation', icon: 'shield', label: 'Content Moderation' },
        { path: '/admin/analytics', icon: 'bar_chart', label: 'System Analytics' },
    ]

    return (
        <div className="min-h-screen bg-[#0d0d1a] flex">
            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#12122a] border-r border-red-900/30 flex flex-col z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-red-900/30">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
                        <div className="flex items-center justify-center size-9 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                            <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">CodeQuest</h2>
                            <p className="text-[10px] text-red-400 font-semibold uppercase tracking-widest">Admin Panel</p>
                        </div>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-3">Management</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${isActive
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Admin user + logout */}
                <div className="p-4 border-t border-red-900/30">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="size-8 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-400 font-bold text-sm">
                            {user?.username?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{user?.username}</p>
                            <p className="text-xs text-red-400">Administrator</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            to="/app/dashboard"
                            className="flex-1 flex items-center justify-center gap-1 text-xs text-slate-400 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-all"
                        >
                            <span className="material-symbols-outlined text-base">open_in_new</span>
                            User View
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex-1 flex items-center justify-center gap-1 text-xs text-slate-400 hover:text-red-400 py-2 px-3 rounded-lg hover:bg-red-500/10 transition-all"
                        >
                            <span className="material-symbols-outlined text-base">logout</span>
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay mobile */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-[#12122a]/80 backdrop-blur-md border-b border-red-900/30 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-400 hover:text-white">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-red-400 text-lg">admin_panel_settings</span>
                            <span className="text-sm font-semibold text-red-400 uppercase tracking-widest">Admin Console</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-xs text-red-400 font-semibold">
                                ● ADMIN
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout

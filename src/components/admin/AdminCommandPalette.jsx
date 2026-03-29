import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminUsers } from '../../hooks/useAdminUsers'
import { useMaintenance } from '../../hooks/useMaintenance'
import { useNotification } from '../../context/NotificationContext'

const AdminCommandPalette = () => {
    const navigate = useNavigate()
    const { users } = useAdminUsers()
    const { maintenanceMode, toggleMaintenance } = useMaintenance()
    const { showToast } = useNotification()

    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef(null)

    // Define all possible actions and pages
    const staticItems = useMemo(() => [
        { id: 'dash', title: 'Admin Dashboard', category: 'Pages', icon: 'dashboard', action: () => navigate('/admin/dashboard') },
        { id: 'users', title: 'User Management', category: 'Pages', icon: 'group', action: () => navigate('/admin/users') },
        { id: 'quests', title: 'Quest Manager', category: 'Pages', icon: 'terminal', action: () => navigate('/app/admin/quests') },
        { id: 'analytics', title: 'System Analytics', category: 'Pages', icon: 'monitoring', action: () => navigate('/admin/analytics') },
        { id: 'moderation', title: 'Content Moderation', category: 'Pages', icon: 'policy', action: () => navigate('/admin/moderation') },
        
        { id: 'maint', title: maintenanceMode ? 'Deactivate Maintenance' : 'Activate Maintenance', category: 'System', icon: 'power_settings_new', action: async () => {
            try {
                await toggleMaintenance(!maintenanceMode)
                showToast(`Maintenance Mode ${!maintenanceMode ? 'Activated' : 'Deactivated'}`, 'info')
            } catch (e) { showToast('Action failed', 'error') }
        }},
        { id: 'broadcast', title: 'Create Global Broadcast', category: 'Actions', icon: 'sensors', action: () => navigate('/admin/dashboard') }
    ], [navigate, maintenanceMode, toggleMaintenance, showToast])

    const filteredItems = useMemo(() => {
        const q = query.toLowerCase()
        if (!q) return staticItems

        const staticFiltered = staticItems.filter(item => 
            item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
        )

        const userResults = users
            .filter(user => user.username.toLowerCase().includes(q) || user.email.toLowerCase().includes(q))
            .slice(0, 5)
            .map(user => ({
                id: `user-${user.id}`,
                title: user.username,
                subtitle: user.email,
                category: 'Users',
                icon: 'person',
                action: () => navigate(`/admin/users`) 
            }))

        return [...staticFiltered, ...userResults]
    }, [query, staticItems, users, navigate])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }
            if (e.key === 'Escape') setIsOpen(false)
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    useEffect(() => {
        if (isOpen) {
            setQuery('')
            setSelectedIndex(0)
            setTimeout(() => inputRef.current?.focus(), 10)
        }
    }, [isOpen])

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev => (prev + 1) % filteredItems.length)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length)
        } else if (e.key === 'Enter') {
            e.preventDefault()
            if (filteredItems[selectedIndex]) {
                filteredItems[selectedIndex].action()
                setIsOpen(false)
            }
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto animate-fade-in" 
                onClick={() => setIsOpen(false)}
            />

            {/* Palette Container */}
            <div className={`w-full max-w-2xl bg-[#0b0b1e]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto animate-palette-in`}>
                <div className="flex items-center gap-4 px-6 py-5 border-b border-white/5 bg-white/5">
                    <span className="material-symbols-outlined text-slate-500 animate-pulse">terminal</span>
                    <input 
                        ref={inputRef}
                        type="text"
                        placeholder="Type a command or user name..."
                        className="bg-transparent border-none outline-none text-white w-full text-lg font-medium placeholder:text-slate-600"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            setSelectedIndex(0)
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[10px] text-slate-400 font-black tracking-widest">ESC</span>
                        <span className="text-slate-600 text-[10px] font-bold">TO CLOSE</span>
                    </div>
                </div>

                <div className="max-h-[440px] overflow-y-auto p-2">
                    {filteredItems.length > 0 ? (
                        <>
                            {['Pages', 'System', 'Actions', 'Users'].map(cat => {
                                const catItems = filteredItems.filter(i => i.category === cat)
                                if (catItems.length === 0) return null
                                
                                return (
                                    <div key={cat} className="mb-2">
                                        <div className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
                                            {cat}
                                        </div>
                                        <div className="space-y-1">
                                            {catItems.map((item) => {
                                                const globalIdx = filteredItems.indexOf(item)
                                                const isActive = selectedIndex === globalIdx
                                                
                                                return (
                                                    <div 
                                                        key={item.id}
                                                        onClick={() => {
                                                            item.action()
                                                            setIsOpen(false)
                                                        }}
                                                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                                                        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all ${
                                                            isActive 
                                                            ? 'bg-blue-600 text-white shadow-xl translate-x-1' 
                                                            : 'text-slate-400 hover:bg-white/5'
                                                        }`}
                                                    >
                                                        <div className={`size-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-white/5 border border-white/5'}`}>
                                                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-200'}`}>{item.title}</p>
                                                            {item.subtitle && <p className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>{item.subtitle}</p>}
                                                        </div>
                                                        {isActive && (
                                                            <div className="flex items-center gap-1 text-[10px] font-black opacity-80">
                                                                RETURN <span className="material-symbols-outlined text-sm">keyboard_return</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </>
                    ) : (
                        <div className="py-24 text-center">
                            <span className="material-symbols-outlined text-5xl text-slate-800 mb-4 block">search_off</span>
                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">No matching commands detected</p>
                            <p className="text-[9px] text-slate-800 mt-2 uppercase tracking-widest">Try searching for "Analytics" or "Dossier"</p>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-tighter">↑↓</span>
                            TO NAVIGATE
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-black tracking-tighter">↵</span>
                            TO SELECT
                        </div>
                    </div>
                    <div className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">CodeQuest Terminal v2.0</div>
                </div>
            </div>

            <style>{`
                @keyframes palette-in {
                    from { opacity: 0; transform: translateY(-30px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-palette-in {
                    animation: palette-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </div>
    )
}

export default AdminCommandPalette

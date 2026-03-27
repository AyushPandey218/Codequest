import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminStats } from '../../hooks/useAdminStats'
import { useAdminBroadcasts } from '../../hooks/useAdminBroadcasts'
import { useAdminNotifications } from '../../hooks/useAdminNotifications'
import { useNotification } from '../../context/NotificationContext'
import Card from '../../components/common/Card'
const StatCard = ({ icon, label, value, sub, color, isLoading }) => (
    <div className={`relative bg-[#0b0b1e]/40 backdrop-blur-xl border ${color.border} rounded-3xl p-6 flex items-center gap-5 shadow-2xl transition-all hover:scale-[1.03] hover:shadow-${color.text.split('-')[1]}-500/10 group overflow-hidden`}>
        <div className={`absolute -right-4 -bottom-4 size-24 ${color.bg.replace('15', '5')} blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
        <div className={`size-14 rounded-2xl flex items-center justify-center ${color.bg} border ${color.border} shadow-inner group-hover:rotate-6 transition-transform`}>
            <span className={`material-symbols-outlined text-3xl ${color.text} drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]`}>{icon}</span>
        </div>
        <div className="relative z-10">
            <p className="text-3xl font-black text-white tracking-tighter">
                {isLoading ? <span className="animate-pulse w-12 bg-white/10 h-8 inline-block rounded-lg"></span> : value}
            </p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-0.5">{label}</p>
            {sub && <div className="flex items-center gap-1.5 mt-1.5">
                <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-[10px] font-bold text-green-400/80 uppercase tracking-wider">{sub}</p>
            </div>}
        </div>
    </div>
)

const SystemHealth = () => (
    <div className="bg-[#0b0b1e]/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:200%_100%] animate-gradient-x"></div>
        <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Core Systems</h3>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">Active</span>
        </div>
        <div className="flex items-end gap-1 h-12">
            {[40, 70, 45, 90, 65, 80, 50, 85, 60, 75, 55, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm relative group/bar">
                    <div 
                        className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-1000"
                        style={{ height: `${h}%`, opacity: 0.6 + (h/200) }}
                    ></div>
                </div>
            ))}
        </div>
        <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase tracking-widest">
            <span>Latency: 24ms</span>
            <span>Uptime: 99.9%</span>
        </div>
    </div>
)

const QuickLink = ({ to, icon, label, desc, color }) => (
    <Link
        to={to}
        className={`bg-[#0b0b1e]/40 backdrop-blur-xl border ${color.border} hover:${color.hoverBg} rounded-2xl p-4 flex items-center gap-4 transition-all group shadow-lg overflow-hidden relative`}
    >
        <div className={`absolute inset-0 bg-gradient-to-br ${color.bg.replace('15', '5')} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
        <div className={`size-11 rounded-xl flex items-center justify-center ${color.bg} border ${color.border} group-hover:scale-110 group-hover:-rotate-3 transition-all relative z-10 shadow-lg`}>
            <span className={`material-symbols-outlined text-xl ${color.text}`}>{icon}</span>
        </div>
        <div className="relative z-10 flex-1">
            <p className="text-xs font-black text-white uppercase tracking-wider">{label}</p>
            <p className="text-[9px] text-slate-500 leading-tight mt-0.5 font-medium group-hover:text-slate-400 transition-colors uppercase">{desc}</p>
        </div>
        <span className="material-symbols-outlined text-slate-700 ml-auto text-base group-hover:text-white group-hover:translate-x-1 transition-all relative z-10">
            chevron_right
        </span>
    </Link>
)

const AdminDashboard = () => {
    const [newBroadcast, setNewBroadcast] = useState({ title: '', message: '', type: 'info' })
    const [newPush, setNewPush] = useState({ title: '', message: '', type: 'system', link: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isPushing, setIsPushing] = useState(false)

    const { totalUsers, activeQuests, completionsToday, recentActivity, isLoading } = useAdminStats()
    const { broadcasts, createBroadcast, deleteBroadcast, toggleBroadcast, isLoading: broadcastsLoading } = useAdminBroadcasts()
    const { pushGlobalNotification } = useAdminNotifications()
    const { showToast } = useNotification()

    const handleCreateBroadcast = async (e) => {
        e.preventDefault()
        if (!newBroadcast.title || !newBroadcast.message) return
        setIsSubmitting(true)
        try {
            await createBroadcast(newBroadcast)
            setNewBroadcast({ title: '', message: '', type: 'info' })
            showToast('Broadcast transmitted successfully!', 'success')
        } catch (error) {
            console.error(error)
            showToast('Failed to transmit broadcast.', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handlePushGlobal = async (e) => {
        e.preventDefault()
        if (!newPush.title || !newPush.message) return
        setIsPushing(true)
        try {
            await pushGlobalNotification(newPush)
            setNewPush({ title: '', message: '', type: 'system', link: '' })
            showToast('Global push notification deployed!', 'success')
        } catch (error) {
            console.error(error)
            showToast('Global push deployment failed.', 'error')
        } finally {
            setIsPushing(false)
        }
    }
    

    return (
        <div className="space-y-8 animate-fade-in pb-12 pr-4">
            <div className="bg-gradient-to-r from-[#161632] to-[#0b0b1e] p-10 rounded-[3rem] border border-white/5 shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] -mr-48 -mt-48 group-hover:bg-blue-400/15 transition-colors duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="size-2 rounded-full bg-blue-500 animate-ping"></span>
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Operational Interface</span>
                    </div>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">System Control</h1>
                    <p className="text-slate-400 mt-3 max-w-xl font-medium leading-relaxed">Infrastructure overview and real-time monitoring of the CodeQuest ecosystem.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon="group"
                    label="Total Users"
                    value={totalUsers}
                    isLoading={isLoading}
                    color={{ border: 'border-blue-500/20', bg: 'bg-blue-500/15', text: 'text-blue-400' }}
                />
                <StatCard
                    icon="military_tech"
                    label="Active Quests"
                    value={activeQuests}
                    isLoading={isLoading}
                    color={{ border: 'border-yellow-500/20', bg: 'bg-yellow-500/15', text: 'text-yellow-400' }}
                />
                <SystemHealth />
                <StatCard
                    icon="trending_up"
                    label="Completions"
                    value={completionsToday}
                    isLoading={isLoading}
                    color={{ border: 'border-purple-500/20', bg: 'bg-purple-500/15', text: 'text-purple-400' }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#0b0b1e]/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
                        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-1">Platform Navigation</h2>
                        <div className="grid grid-cols-1 gap-2.5">
                            <QuickLink
                                to="/admin/users"
                                icon="person_search"
                                label="Users"
                                desc="Account Management"
                                color={{ border: 'border-blue-500/10', bg: 'bg-blue-500/10', text: 'text-blue-400', hoverBg: 'bg-blue-500/5' }}
                            />
                            <QuickLink
                                to="/admin/quests"
                                icon="terminal"
                                label="Quests"
                                desc="Challenge Editor"
                                color={{ border: 'border-yellow-500/10', bg: 'bg-yellow-500/10', text: 'text-yellow-400', hoverBg: 'bg-yellow-500/5' }}
                            />
                            <QuickLink
                                to="/admin/moderation"
                                icon="policy"
                                label="Moderation"
                                desc="Content Control"
                                color={{ border: 'border-red-500/10', bg: 'bg-red-500/10', text: 'text-red-400', hoverBg: 'bg-red-500/5' }}
                            />
                            <QuickLink
                                to="/admin/analytics"
                                icon="monitoring"
                                label="Analytics"
                                desc="Engagement Data"
                                color={{ border: 'border-purple-500/10', bg: 'bg-purple-500/10', text: 'text-purple-400', hoverBg: 'bg-purple-500/5' }}
                            />
                        </div>
                    </div>

                    <Card className="p-6 border-white/5 bg-[#0b0b1e]/60 backdrop-blur-2xl shadow-2xl rounded-3xl">
                        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            <span className="size-2 rounded-full bg-purple-500"></span>
                            Command Center
                        </h2>
                        <div className="space-y-6">
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Push Update</p>
                                <form onSubmit={handlePushGlobal} className="space-y-3">
                                    <input 
                                        type="text"
                                        placeholder="Push Title"
                                        value={newPush.title}
                                        onChange={e => setNewPush({...newPush, title: e.target.value})}
                                        className="w-full bg-[#0b0b1e]/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-all"
                                    />
                                    <textarea 
                                        placeholder="Notification details..."
                                        value={newPush.message}
                                        onChange={e => setNewPush({...newPush, message: e.target.value})}
                                        rows={2}
                                        className="w-full bg-[#0b0b1e]/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={isPushing}
                                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-purple-900/20"
                                    >
                                        {isPushing ? 'Pushing...' : 'Deploy Push'}
                                    </button>
                                </form>
                            </div>

                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Site Broadcast</p>
                                <form onSubmit={handleCreateBroadcast} className="space-y-3">
                                    <input 
                                        type="text"
                                        placeholder="Banner Title"
                                        value={newBroadcast.title}
                                        onChange={e => setNewBroadcast({...newBroadcast, title: e.target.value})}
                                        className="w-full bg-[#0b0b1e]/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Transmit Broadcast'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-[#0b0b1e]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 size-64 bg-blue-500/5 blur-[80px] -mr-32 -mt-32"></div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Active Alerts & Broadcasts</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-slate-500 bg-white/5 py-1 px-3 rounded-full uppercase border border-white/5">Auto-Sync ON</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {broadcastsLoading ? (
                                <div className="col-span-full py-20 text-center">
                                    <div className="animate-spin size-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full mx-auto mb-4"></div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Syncing with Relay...</span>
                                </div>
                            ) : broadcasts.length > 0 ? (
                                broadcasts.map((b) => (
                                    <div key={b.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-xl relative group hover:bg-white/[0.04] transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`size-1.5 rounded-full ${b.active ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${
                                                    b.type === 'error' ? 'text-red-400' : 
                                                    b.type === 'warning' ? 'text-orange-400' : 
                                                    b.type === 'success' ? 'text-green-400' : 'text-blue-400'
                                                }`}>
                                                    {b.type}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={() => deleteBroadcast(b.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 text-slate-600 hover:text-red-400 rounded-lg transition-all"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                        <h3 className="text-white font-bold text-sm mb-1">{b.title}</h3>
                                        <p className="text-[11px] text-slate-500 leading-relaxed mb-4 line-clamp-2">{b.message}</p>
                                        <button 
                                            onClick={() => toggleBroadcast(b.id, !b.active)}
                                            className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                b.active 
                                                ? 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 border border-white/5' 
                                                : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95'
                                            }`}
                                        >
                                            {b.active ? 'Deactivate' : 'Reactivate'}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full bg-white/[0.01] border border-dashed border-white/5 rounded-3xl py-24 text-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-800 mb-4 block">sensors_off</span>
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">No Broadcasts Detected</p>
                                    <p className="text-[9px] text-slate-600 mt-2 uppercase tracking-widest">Standby mode engaged</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#0b0b1e]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Live Activity Log</h2>
                            <div className="flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Real-time</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="h-14 bg-white/[0.02] rounded-xl animate-pulse"></div>
                                ))
                            ) : recentActivity.length > 0 ? (
                                recentActivity.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 px-5 py-3.5 bg-white/[0.015] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all group">
                                        <div className={`p-2 rounded-lg bg-white/5 group-hover:scale-110 transition-transform`}>
                                            <span className={`material-symbols-outlined text-sm ${item.color}`}>{item.icon}</span>
                                        </div>
                                        <p className="text-xs text-slate-300 flex-1 font-medium">{item.text}</p>
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.time}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-800 mb-4 block">history</span>
                                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">Activity Stream Empty</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard

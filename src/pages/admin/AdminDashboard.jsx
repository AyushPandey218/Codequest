import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminStats } from '../../hooks/useAdminStats'
import { useAdminBroadcasts } from '../../hooks/useAdminBroadcasts'
import { useAdminNotifications } from '../../hooks/useAdminNotifications'
import Card from '../../components/common/Card'

const StatCard = ({ icon, label, value, sub, color, isLoading }) => (
    <div className={`bg-[#12122a] border ${color.border} rounded-2xl p-5 flex items-center gap-4 shadow-xl transition-all hover:scale-[1.02]`}>
        <div className={`size-12 rounded-xl flex items-center justify-center ${color.bg}`}>
            <span className={`material-symbols-outlined text-2xl ${color.text}`}>{icon}</span>
        </div>
        <div>
            <p className="text-2xl font-bold text-white">
                {isLoading ? <span className="animate-pulse w-8 bg-white/20 h-6 inline-block rounded"></span> : value}
            </p>
            <p className="text-sm text-slate-400">{label}</p>
            {sub && <p className="text-xs text-green-400 mt-0.5">{sub}</p>}
        </div>
    </div>
)

const QuickLink = ({ to, icon, label, desc, color }) => (
    <Link
        to={to}
        className={`bg-[#12122a] border ${color.border} hover:${color.hoverBg} rounded-2xl p-5 flex items-start gap-4 transition-all group shadow-lg`}
    >
        <div className={`size-10 rounded-xl flex items-center justify-center ${color.bg} group-hover:scale-110 transition-transform`}>
            <span className={`material-symbols-outlined text-xl ${color.text}`}>{icon}</span>
        </div>
        <div>
            <p className="text-sm font-semibold text-white">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
        </div>
        <span className="material-symbols-outlined text-slate-600 ml-auto mt-0.5 group-hover:text-slate-400 transition-colors">
            arrow_forward
        </span>
    </Link>
)

const AdminDashboard = () => {
    const handlePushGlobal = async (e) => {
        e.preventDefault()
        if (!newPush.title || !newPush.message) return
        setIsPushing(true)
        try {
            await pushGlobalNotification(newPush)
            setNewPush({ title: '', message: '', type: 'system', link: '' })
            alert('Global notification pushed successfully!')
        } catch (error) {
            console.error(error)
        } finally {
            setIsPushing(false)
        }
    }

    const { totalUsers, activeQuests, completionsToday, recentActivity, isLoading } = useAdminStats()
    const { broadcasts, createBroadcast, deleteBroadcast, toggleBroadcast, isLoading: broadcastsLoading } = useAdminBroadcasts()
    const { pushGlobalNotification } = useAdminNotifications()
    
    const [newBroadcast, setNewBroadcast] = useState({ title: '', message: '', type: 'info' })
    const [newPush, setNewPush] = useState({ title: '', message: '', type: 'system', link: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isPushing, setIsPushing] = useState(false)

    const handleCreateBroadcast = async (e) => {
        e.preventDefault()
        if (!newBroadcast.title || !newBroadcast.message) return
        
        setIsSubmitting(true)
        try {
            await createBroadcast(newBroadcast)
            setNewBroadcast({ title: '', message: '', type: 'info' })
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="bg-[#161632] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <h1 className="text-3xl font-bold text-white relative z-10 uppercase tracking-tight">System Control</h1>
                <p className="text-slate-400 mt-1 relative z-10">Manage site-wide infrastructure and monitor real-time activity.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
                <StatCard
                    icon="flag"
                    label="Platform Health"
                    value="Optimal"
                    sub="Stable"
                    color={{ border: 'border-green-500/20', bg: 'bg-green-500/15', text: 'text-green-400' }}
                />
                <StatCard
                    icon="trending_up"
                    label="Completions Today"
                    value={completionsToday}
                    isLoading={isLoading}
                    color={{ border: 'border-purple-500/20', bg: 'bg-purple-500/15', text: 'text-purple-400' }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Platform Management</h2>
                        <div className="space-y-3">
                            <QuickLink
                                to="/admin/users"
                                icon="person_search"
                                label="User Accounts"
                                desc="Manage accounts, rewards, and access"
                                color={{ border: 'border-blue-500/20', bg: 'bg-blue-500/15', text: 'text-blue-400', hoverBg: 'bg-blue-500/5' }}
                            />
                            <QuickLink
                                to="/admin/quests"
                                icon="terminal"
                                label="Quest Editor"
                                desc="Maintain coding quests and challenges"
                                color={{ border: 'border-yellow-500/20', bg: 'bg-yellow-500/15', text: 'text-yellow-400', hoverBg: 'bg-yellow-500/5' }}
                            />
                            <QuickLink
                                to="/admin/moderation"
                                icon="policy"
                                label="Moderation Desk"
                                desc="Review reports and flagged content"
                                color={{ border: 'border-red-500/20', bg: 'bg-red-500/15', text: 'text-red-400', hoverBg: 'bg-red-500/5' }}
                            />
                            <QuickLink
                                to="/admin/analytics"
                                icon="monitoring"
                                label="Live Analytics"
                                desc="Real-time performance and engagement"
                                color={{ border: 'border-purple-500/20', bg: 'bg-purple-500/15', text: 'text-purple-400', hoverBg: 'bg-purple-500/5' }}
                            />
                        </div>
                    </div>

                    {/* Push notification mini-form */}
                    <Card className="p-6 border-white/5 bg-[#12122a] shadow-2xl">
                        <h2 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-purple-400 text-lg">notifications_active</span>
                            Global Push
                        </h2>
                        <form onSubmit={handlePushGlobal} className="space-y-4">
                            <input 
                                type="text"
                                placeholder="Push Title (e.g. New Quest!)"
                                value={newPush.title}
                                onChange={e => setNewPush({...newPush, title: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                            />
                            <textarea 
                                placeholder="Message for all bells..."
                                value={newPush.message}
                                onChange={e => setNewPush({...newPush, message: e.target.value})}
                                rows={2}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                            />
                            <div className="flex gap-2">
                                <select 
                                    value={newPush.type}
                                    onChange={e => setNewPush({...newPush, type: e.target.value})}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-[10px] text-slate-300 focus:outline-none"
                                >
                                    <option value="system">System</option>
                                    <option value="achievement">Achievement</option>
                                    <option value="clash">Clash</option>
                                    <option value="social">Social</option>
                                </select>
                                <input 
                                    type="text"
                                    placeholder="Link (optional)"
                                    value={newPush.link}
                                    onChange={e => setNewPush({...newPush, link: e.target.value})}
                                    className="flex-[2] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:outline-none"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={isPushing}
                                className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-purple-900/20 active:scale-[0.98]"
                            >
                                {isPushing ? 'Pushing...' : 'Push to All Users'}
                            </button>
                        </form>
                    </Card>
                </div>

                {/* Right Column: Active Broadcasts & Recent Activity */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Active Broadcasts Manager */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Active Broadcasts</h2>
                            <span className="text-[10px] font-bold text-slate-500 bg-white/5 py-1 px-3 rounded-full uppercase">Current Alerts</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {broadcastsLoading ? (
                                <div className="col-span-full py-12 text-center text-slate-600 italic">Listening for broadcasts...</div>
                            ) : broadcasts.length > 0 ? (
                                broadcasts.map((b) => (
                                    <div key={b.id} className="bg-[#12122a] border border-white/5 rounded-2xl p-5 shadow-xl relative group">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`size-2 rounded-full ${b.active ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                    b.type === 'error' ? 'text-red-400' : 
                                                    b.type === 'warning' ? 'text-orange-400' : 
                                                    b.type === 'success' ? 'text-green-400' : 'text-blue-400'
                                                }`}>
                                                    {b.type}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={() => deleteBroadcast(b.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 text-slate-600 hover:text-red-400 rounded transition-all"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                        <h3 className="text-white font-bold text-sm mb-1">{b.title}</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed mb-4">{b.message}</p>
                                        <button 
                                            onClick={() => toggleBroadcast(b.id, !b.active)}
                                            className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                b.active 
                                                ? 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20' 
                                                : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                                            }`}
                                        >
                                            {b.active ? 'Deactivate' : 'Reactivate'}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full bg-white/5 border border-dashed border-white/10 rounded-2xl py-12 text-center text-slate-600 italic text-sm">
                                    No broadcasts generated.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Recent Events</h2>
                        <div className="bg-[#12122a] border border-white/5 rounded-2xl divide-y divide-white/5 shadow-2xl overflow-hidden">
                            {isLoading ? (
                                <div className="p-8 text-center text-slate-500 animate-pulse">Updating events...</div>
                            ) : recentActivity.length > 0 ? (
                                recentActivity.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.015] transition-colors group">
                                        <div className={`p-2 rounded-lg bg-white/5 group-hover:scale-110 transition-transform`}>
                                            <span className={`material-symbols-outlined text-lg ${item.color}`}>{item.icon}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 flex-1">{item.text}</p>
                                        <span className="text-xs font-mono text-slate-600 whitespace-nowrap">{item.time}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-slate-600 italic font-medium">No recent activity detected.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard

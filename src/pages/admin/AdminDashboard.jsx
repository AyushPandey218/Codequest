import { Link } from 'react-router-dom'
import { useAdminStats } from '../../hooks/useAdminStats'

const StatCard = ({ icon, label, value, sub, color, isLoading }) => (
    <div className={`bg-[#12122a] border ${color.border} rounded-2xl p-5 flex items-center gap-4`}>
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
        className={`bg-[#12122a] border ${color.border} hover:${color.hoverBg} rounded-2xl p-5 flex items-start gap-4 transition-all group`}
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
    const { totalUsers, activeQuests, completionsToday, recentActivity, isLoading } = useAdminStats()

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-slate-400 mt-1">Welcome back, Admin. Here's what's happening on CodeQuest.</p>
            </div>

            {/* Stats */}
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
                    label="Pending Reports"
                    value="0"
                    sub="Needs review"
                    color={{ border: 'border-red-500/20', bg: 'bg-red-500/15', text: 'text-red-400' }}
                />
                <StatCard
                    icon="trending_up"
                    label="Completions Today"
                    value={completionsToday}
                    isLoading={isLoading}
                    color={{ border: 'border-green-500/20', bg: 'bg-green-500/15', text: 'text-green-400' }}
                />
            </div>

            {/* Quick Actions + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick actions */}
                <div className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Quick Actions</h2>
                    <QuickLink
                        to="/admin/users"
                        icon="group"
                        label="Manage Users"
                        desc="View, search, suspend or promote users"
                        color={{ border: 'border-blue-500/20', bg: 'bg-blue-500/15', text: 'text-blue-400', hoverBg: 'border-blue-500/40' }}
                    />
                    <QuickLink
                        to="/admin/quests"
                        icon="military_tech"
                        label="Manage Quests"
                        desc="Create, edit or remove coding quests"
                        color={{ border: 'border-yellow-500/20', bg: 'bg-yellow-500/15', text: 'text-yellow-400', hoverBg: 'border-yellow-500/40' }}
                    />
                    <QuickLink
                        to="/admin/moderation"
                        icon="shield"
                        label="Content Moderation"
                        desc="Review flagged posts and reports"
                        color={{ border: 'border-red-500/20', bg: 'bg-red-500/15', text: 'text-red-400', hoverBg: 'border-red-500/40' }}
                    />
                    <QuickLink
                        to="/admin/analytics"
                        icon="bar_chart"
                        label="View Analytics"
                        desc="Engagement, retention, performance"
                        color={{ border: 'border-purple-500/20', bg: 'bg-purple-500/15', text: 'text-purple-400', hoverBg: 'border-purple-500/40' }}
                    />
                </div>

                {/* Recent activity */}
                <div className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Recent Activity</h2>
                    <div className="bg-[#12122a] border border-white/5 rounded-2xl divide-y divide-white/5">
                        {isLoading ? (
                            <div className="p-8 text-center text-slate-500 animate-pulse">Loading activity...</div>
                        ) : recentActivity.length > 0 ? (
                            recentActivity.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 px-4 py-3">
                                    <span className={`material-symbols-outlined text-lg ${item.color}`}>{item.icon}</span>
                                    <p className="text-sm text-slate-300 flex-1">{item.text}</p>
                                    <span className="text-xs text-slate-600 whitespace-nowrap">{item.time}</span>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-500">No recent activity</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard

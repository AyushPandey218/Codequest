import { useState } from 'react'
import { useAdminAnalytics } from '../../hooks/useAdminAnalytics'
import { useMaintenance } from '../../hooks/useMaintenance'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import Card from '../../components/common/Card'

const MetricCard = ({ label, value, change, icon, color, isLoading }) => (
    <div className={`bg-[#12122a] border ${color.border} rounded-2xl p-5 shadow-xl transition-all hover:scale-[1.02]`}>
        <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{label}</p>
            <div className={`size-8 rounded-lg flex items-center justify-center ${color.bg}`}>
                <span className={`material-symbols-outlined text-base ${color.text}`}>{icon}</span>
            </div>
        </div>
        <p className="text-3xl font-bold text-white">
            {isLoading ? <span className="animate-pulse w-8 bg-white/20 h-6 inline-block rounded"></span> : value}
        </p>
        {!isLoading && change && (
            <p className={`text-[10px] mt-1 font-bold uppercase tracking-tight ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {change} vs last week
            </p>
        )}
    </div>
)

const BarRow = ({ label, pct, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-slate-500">
            <span>{label}</span>
            <span className="text-white">{pct}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.3)]`} style={{ width: `${pct}%` }} />
        </div>
    </div>
)

const diffColor = { 
    'Easy': 'text-green-400 bg-green-400/10', 
    'Medium': 'text-yellow-400 bg-yellow-400/10', 
    'Hard': 'text-red-400 bg-red-400/10',
    'Expert': 'text-purple-400 bg-purple-400/10'
}

const AdminAnalytics = () => {
    const { dailyActiveUsers, questCompletions, newSignups, totalCommunityActivity, topQuests, levelDistribution, engagement, isLoading } = useAdminAnalytics()
    const { maintenanceMode, toggleMaintenance, isLoading: maintenanceLoading } = useMaintenance()
    const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false)

    const handleMaintenanceToggle = async () => {
        try {
            await toggleMaintenance(!maintenanceMode)
            setIsMaintenanceModalOpen(false)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#161632] p-8 rounded-3xl border border-white/5 shadow-2xl">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Platform Analytics</h1>
                    <p className="text-slate-400">Monitor engagement and system-wide performance in real-time.</p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                    <button 
                        onClick={() => setIsMaintenanceModalOpen(true)}
                        disabled={maintenanceLoading}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-lg ${
                            maintenanceMode 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' 
                            : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                        }`}
                    >
                        <span className="material-symbols-outlined text-lg">
                            {maintenanceMode ? 'power_settings_new' : 'emergency_home'}
                        </span>
                        {maintenanceMode ? 'Bring Site Online' : 'Down Whole Site'}
                    </button>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${maintenanceMode ? 'text-orange-400 animate-pulse' : 'text-slate-500'}`}>
                        {maintenanceMode ? 'Maintenance Mode Active' : 'All Systems Operational'}
                    </p>
                </div>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Active Users Today"
                    value={dailyActiveUsers}
                    change={`${newSignups > 0 ? '+' : ''}${newSignups}`}
                    icon="person"
                    isLoading={isLoading}
                    color={{ border: 'border-blue-500/10', bg: 'bg-blue-500/10', text: 'text-blue-400' }}
                />
                <MetricCard
                    label="Quest Completions"
                    value={questCompletions}
                    icon="auto_awesome"
                    isLoading={isLoading}
                    color={{ border: 'border-purple-500/10', bg: 'bg-purple-500/10', text: 'text-purple-400' }}
                />
                <MetricCard
                    label="Community Impact"
                    value={totalCommunityActivity}
                    icon="forum"
                    isLoading={isLoading}
                    color={{ border: 'border-green-500/10', bg: 'bg-green-500/10', text: 'text-green-400' }}
                />
                <MetricCard
                    label="New Signups (7d)"
                    value={newSignups}
                    icon="person_add"
                    isLoading={isLoading}
                    color={{ border: 'border-yellow-500/10', bg: 'bg-yellow-500/10', text: 'text-yellow-400' }}
                />
            </div>

            {/* Detailed Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Top Quests Table */}
                <div className="lg:col-span-8 bg-[#12122a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">High Performing Quests</h2>
                        <span className="text-[10px] font-bold text-slate-500 bg-white/5 py-1 px-3 rounded-full uppercase">Real-time Data</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5 text-slate-500 text-[10px] uppercase tracking-widest font-black">
                                    <th className="text-left px-6 py-4">Quest Title</th>
                                    <th className="text-center px-6 py-4">Total Completions</th>
                                    <th className="text-center px-6 py-4">Avg Duration</th>
                                    <th className="text-center px-6 py-4">Difficulty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {topQuests.map((q, i) => (
                                    <tr key={i} className="hover:bg-white/[0.015] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-mono text-slate-600">0{i+1}</span>
                                                <span className="text-white font-bold group-hover:text-blue-400 transition-colors uppercase tracking-tight">{q.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-300 font-bold">{q.completions}</td>
                                        <td className="px-6 py-4 text-center text-slate-500 text-xs">{q.avgTime}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <span className={`px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-tighter ${diffColor[q.difficulty] || 'bg-slate-500/10 text-slate-400'}`}>
                                                    {q.difficulty}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {topQuests.length === 0 && !isLoading && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                                            No submission data recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Engagement Metrics Side Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-6 border-white/5 bg-[#12122a] shadow-2xl space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-white uppercase tracking-widest">System Engagement</h2>
                            <span className="material-symbols-outlined text-slate-500 text-lg">analytics</span>
                        </div>
                        
                        <div className="space-y-6">
                            <BarRow label="Quest Success Rate" pct={engagement.questSuccessRate} color="bg-blue-500" />
                            <BarRow label="Community Adoption" pct={engagement.communityActivePct} color="bg-green-500" />
                            <BarRow label="Profile Completion" pct={engagement.profileCompletionPct} color="bg-yellow-500" />
                            <BarRow label="7d Retention" pct={engagement.retention7d} color="bg-purple-500" />
                        </div>

                        <div className="pt-6 border-t border-white/5 space-y-4">
                            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Skill Level Distribution</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Junior (1-10)</p>
                                    <p className="text-xl font-bold text-white">{levelDistribution.l1_10}%</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Mid (11-30)</p>
                                    <p className="text-xl font-bold text-white">{levelDistribution.l11_30}%</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-3xl p-6 backdrop-blur-xl">
                        <h3 className="text-white font-bold mb-2">Platform Health</h3>
                        <p className="text-xs text-slate-400 mb-4 leading-relaxed">System performance is calculated based on database operations, active connections, and submission throughput.</p>
                        <div className="flex items-center gap-2">
                            <div className="size-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                            <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Optimal Performance</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Maintenance Mode Confirmation */}
            <ConfirmationModal
                isOpen={isMaintenanceModalOpen}
                onClose={() => setIsMaintenanceModalOpen(false)}
                onConfirm={handleMaintenanceToggle}
                title={maintenanceMode ? "Disable Maintenance Mode?" : "Activate Emergency Maintenance?"}
                message={maintenanceMode 
                    ? "This will bring the site back online for all users. Are you sure all systems are ready?" 
                    : "CRITICAL: This will immediately block access for all standard users and show the maintenance screen. Only administrators will be able to access the platform."
                }
                confirmText={maintenanceMode ? "Bring Site Online" : "Shutdown Site Access"}
                variant={maintenanceMode ? "info" : "danger"}
            />
        </div>
    )
}

export default AdminAnalytics

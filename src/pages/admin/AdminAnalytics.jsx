const MetricCard = ({ label, value, change, icon, color }) => (
    <div className={`bg-[#12122a] border ${color.border} rounded-2xl p-5`}>
        <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{label}</p>
            <div className={`size-8 rounded-lg flex items-center justify-center ${color.bg}`}>
                <span className={`material-symbols-outlined text-base ${color.text}`}>{icon}</span>
            </div>
        </div>
        <p className="text-3xl font-bold text-white">{value}</p>
        {change && (
            <p className={`text-xs mt-1 ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {change} vs last week
            </p>
        )}
    </div>
)

const BarRow = ({ label, pct, color }) => (
    <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>{label}</span>
            <span>{pct}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
        </div>
    </div>
)

const topQuests = [
    { name: 'Reverse a String', completions: 312, avgTime: '8 min', difficulty: 'Easy' },
    { name: 'FizzBuzz Classic', completions: 298, avgTime: '5 min', difficulty: 'Easy' },
    { name: 'Binary Search Tree', completions: 194, avgTime: '32 min', difficulty: 'Hard' },
    { name: 'Two Sum', completions: 187, avgTime: '12 min', difficulty: 'Medium' },
    { name: 'Linked List Reverse', completions: 143, avgTime: '18 min', difficulty: 'Medium' },
]

const diffColor = { Easy: 'text-green-400', Medium: 'text-yellow-400', Hard: 'text-red-400' }

const AdminAnalytics = () => (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-white">System Analytics</h1>
            <p className="text-slate-400 mt-1">Platform-wide performance, engagement, and retention metrics.</p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
                label="Daily Active Users"
                value="842"
                change="+7%"
                icon="person"
                color={{ border: 'border-blue-500/20', bg: 'bg-blue-500/15', text: 'text-blue-400' }}
            />
            <MetricCard
                label="Quest Completions"
                value="2,134"
                change="+18%"
                icon="check_circle"
                color={{ border: 'border-green-500/20', bg: 'bg-green-500/15', text: 'text-green-400' }}
            />
            <MetricCard
                label="Avg. Session Time"
                value="24 min"
                change="+3 min"
                icon="timer"
                color={{ border: 'border-purple-500/20', bg: 'bg-purple-500/15', text: 'text-purple-400' }}
            />
            <MetricCard
                label="New Signups"
                value="56"
                change="+12%"
                icon="person_add"
                color={{ border: 'border-yellow-500/20', bg: 'bg-yellow-500/15', text: 'text-yellow-400' }}
            />
        </div>

        {/* Top quests + Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Top Quests */}
            <div className="lg:col-span-3 bg-[#12122a] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5">
                    <h2 className="text-sm font-bold text-white">Top Quest Completions</h2>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="text-left px-5 py-3">#</th>
                            <th className="text-left px-5 py-3">Quest</th>
                            <th className="text-left px-5 py-3">Completions</th>
                            <th className="text-left px-5 py-3">Avg Time</th>
                            <th className="text-left px-5 py-3">Difficulty</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {topQuests.map((q, i) => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-5 py-3 text-slate-600 font-mono">#{i + 1}</td>
                                <td className="px-5 py-3 text-white font-medium">{q.name}</td>
                                <td className="px-5 py-3 text-slate-300">{q.completions}</td>
                                <td className="px-5 py-3 text-slate-400">{q.avgTime}</td>
                                <td className="px-5 py-3">
                                    <span className={`font-medium text-xs ${diffColor[q.difficulty]}`}>{q.difficulty}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Engagement breakdown */}
            <div className="lg:col-span-2 bg-[#12122a] border border-white/5 rounded-2xl p-5 space-y-5">
                <h2 className="text-sm font-bold text-white">User Engagement</h2>
                <BarRow label="Quest Attempts" pct={78} color="bg-blue-500" />
                <BarRow label="Code Clash Participation" pct={45} color="bg-purple-500" />
                <BarRow label="Community Posts" pct={32} color="bg-green-500" />
                <BarRow label="Profile Completeness" pct={61} color="bg-yellow-500" />
                <BarRow label="7-day Retention" pct={54} color="bg-red-400" />

                <div className="pt-4 border-t border-white/5 space-y-3">
                    <h2 className="text-sm font-bold text-white">User Level Distribution</h2>
                    <BarRow label="Level 1–10" pct={38} color="bg-slate-500" />
                    <BarRow label="Level 11–30" pct={42} color="bg-blue-500" />
                    <BarRow label="Level 31–50" pct={16} color="bg-purple-500" />
                    <BarRow label="Level 51+" pct={4} color="bg-yellow-400" />
                </div>
            </div>
        </div>
    </div>
)

export default AdminAnalytics

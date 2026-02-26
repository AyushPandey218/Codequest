import { useState } from 'react'

const initialReports = [
    { id: 1, type: 'Community Post', reporter: 'user_42', target: 'py_wizard', content: 'This solution is stolen from GitHub!', severity: 'high', time: '14 min ago', status: 'pending' },
    { id: 2, type: 'Code Clash Comment', reporter: 'newUser99', target: 'algoMaster', content: 'Contains offensive language in game chat.', severity: 'medium', time: '1h ago', status: 'pending' },
    { id: 3, type: 'Profile Bio', reporter: 'admin_bot', target: 'spammer_x', content: 'Spam/advertisement links in bio.', severity: 'high', time: '2h ago', status: 'pending' },
    { id: 4, type: 'Quest Comment', reporter: 'coder_xyz', target: 'random_user', content: 'Misleading hint that breaks the challenge.', severity: 'low', time: '5h ago', status: 'resolved' },
    { id: 5, type: 'Community Post', reporter: 'devKing', target: 'unknown_01', content: 'Sharing full test-case answers publicly.', severity: 'medium', time: '1d ago', status: 'resolved' },
]

const SeverityBadge = ({ severity }) => {
    const map = {
        high: 'bg-red-500/15 text-red-400 border-red-500/30',
        medium: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
        low: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    }
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${map[severity]}`}>
            {severity}
        </span>
    )
}

const AdminModeration = () => {
    const [reports, setReports] = useState(initialReports)
    const [tab, setTab] = useState('pending')

    const resolve = (id) => setReports(r => r.map(x => x.id === id ? { ...x, status: 'resolved' } : x))
    const dismiss = (id) => setReports(r => r.filter(x => x.id !== id))

    const shown = reports.filter(r => r.status === tab)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Content Moderation</h1>
                <p className="text-slate-400 mt-1">Review flagged content and take action on reports.</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Pending Reports', value: reports.filter(r => r.status === 'pending').length, color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/20', icon: 'report' },
                    { label: 'Resolved Today', value: reports.filter(r => r.status === 'resolved').length, color: 'text-green-400', bg: 'bg-green-500/15', border: 'border-green-500/20', icon: 'check_circle' },
                    { label: 'High Severity', value: reports.filter(r => r.severity === 'high').length, color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/20', icon: 'priority_high' },
                ].map(card => (
                    <div key={card.label} className={`bg-[#12122a] border ${card.border} rounded-2xl p-5 flex items-center gap-4`}>
                        <div className={`size-11 rounded-xl flex items-center justify-center ${card.bg}`}>
                            <span className={`material-symbols-outlined text-xl ${card.color}`}>{card.icon}</span>
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                            <p className="text-xs text-slate-400">{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/5 pb-2">
                {['pending', 'resolved'].map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-red-500/20 text-red-400' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Report cards */}
            <div className="space-y-3">
                {shown.length === 0 && (
                    <div className="bg-[#12122a] border border-white/5 rounded-2xl p-12 text-center text-slate-500">
                        <span className="material-symbols-outlined text-5xl block mb-3 opacity-30">shield_check</span>
                        <p>No {tab} reports</p>
                    </div>
                )}
                {shown.map(report => (
                    <div key={report.id} className="bg-[#12122a] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                    <SeverityBadge severity={report.severity} />
                                    <span className="px-2 py-0.5 rounded-full text-xs border border-white/10 text-slate-400">{report.type}</span>
                                    <span className="text-xs text-slate-600">{report.time}</span>
                                </div>
                                <p className="text-sm text-white mb-1">
                                    <span className="text-slate-500">Reported by </span>
                                    <span className="text-blue-400">{report.reporter}</span>
                                    <span className="text-slate-500"> against </span>
                                    <span className="text-red-400">{report.target}</span>
                                </p>
                                <p className="text-sm text-slate-400 italic">"{report.content}"</p>
                            </div>
                            {report.status === 'pending' && (
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => resolve(report.id)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25 transition-colors"
                                    >
                                        Resolve
                                    </button>
                                    <button
                                        onClick={() => dismiss(report.id)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-slate-400 border border-white/10 hover:text-white transition-colors"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminModeration

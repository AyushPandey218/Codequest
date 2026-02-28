import { useState } from 'react'
import { useAdminUsers } from '../../hooks/useAdminUsers'

const Badge = ({ status }) => {
    const map = {
        active: 'bg-green-500/15 text-green-400 border-green-500/30',
        suspended: 'bg-red-500/15 text-red-400 border-red-500/30',
    }
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${map[status] || ''}`}>
            {status}
        </span>
    )
}

const AdminUsers = () => {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const { users, isLoading } = useAdminUsers()

    const filtered = users.filter(u => {
        const matchesSearch = u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = filter === 'all' || u.status === filter
        return matchesSearch && matchesFilter
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <p className="text-slate-400 mt-1">View, search, and manage all registered users.</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
                    <input
                        type="text"
                        placeholder="Search by username or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-[#12122a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'active', 'suspended'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-[#12122a] text-slate-400 border border-white/10 hover:text-white'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#12122a] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="text-left px-5 py-4">User</th>
                                <th className="text-left px-5 py-4">Level</th>
                                <th className="text-left px-5 py-4">Status</th>
                                <th className="text-left px-5 py-4">Joined</th>
                                <th className="text-right px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(user => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{user.username}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-yellow-400 font-semibold">Lv. {user.level}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Badge status={user.status} />
                                    </td>
                                    <td className="px-5 py-4 text-slate-400">{user.joined}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                title="View Profile"
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-base">visibility</span>
                                            </button>
                                            <button
                                                title={user.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-base">
                                                    {user.status === 'suspended' ? 'lock_open' : 'lock'}
                                                </span>
                                            </button>
                                            <button
                                                title="Delete User"
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-base">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-5 py-3 border-t border-white/5 text-xs text-slate-500">
                    Showing {filtered.length} of {users.length} users
                </div>
            </div>
        </div>
    )
}

export default AdminUsers

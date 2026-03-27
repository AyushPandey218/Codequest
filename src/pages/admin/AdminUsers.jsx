import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, updateDoc, arrayUnion, increment, serverTimestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useAdminUsers } from '../../hooks/useAdminUsers'
import { useAdminNotifications } from '../../hooks/useAdminNotifications'
import { achievements } from '../../data/achievements'
import ConfirmationModal from '../../components/common/ConfirmationModal'

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

const AwardModal = ({ isOpen, onClose, onAward, username }) => {
    const [awardType, setAwardType] = useState('xp')
    const [xpAmount, setXpAmount] = useState(100)
    const [selectedBadge, setSelectedBadge] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (awardType === 'xp') {
                await onAward({ type: 'xp', value: parseInt(xpAmount) })
            } else {
                const badge = achievements.find(a => a.id === selectedBadge)
                await onAward({ type: 'badge', value: badge })
            }
            onClose()
        } catch (err) {
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#161632] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="size-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-yellow-500 text-2xl">military_tech</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Grant Reward</h2>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-black">Awarding: {username}</p>
                    </div>
                </div>

                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    <button 
                        onClick={() => setAwardType('xp')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${awardType === 'xp' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        XP Bonus
                    </button>
                    <button 
                        onClick={() => setAwardType('badge')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${awardType === 'badge' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Official Badge
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {awardType === 'xp' ? (
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">XP Amount</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[100, 500, 1000].map(amt => (
                                    <button 
                                        key={amt}
                                        type="button"
                                        onClick={() => setXpAmount(amt)}
                                        className={`py-3 rounded-xl border transition-all text-sm font-bold ${xpAmount === amt ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-[#0b0b1e] border-white/5 text-slate-500 hover:border-white/20'}`}
                                    >
                                        +{amt}
                                    </button>
                                ))}
                            </div>
                            <input 
                                type="number" 
                                value={xpAmount}
                                onChange={e => setXpAmount(e.target.value)}
                                className="w-full bg-[#0b0b1e] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                                placeholder="Custom amount..."
                            />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Achievement</label>
                            <select 
                                value={selectedBadge}
                                onChange={e => setSelectedBadge(e.target.value)}
                                className="w-full bg-[#0b0b1e] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 appearance-none"
                            >
                                <option value="">Choose a badge...</option>
                                {achievements.map(a => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isSubmitting || (awardType === 'badge' && !selectedBadge)}
                            className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 ${awardType === 'xp' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20' : 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20'}`}
                        >
                            {isSubmitting ? 'Processing...' : 'Grant Reward'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const PushModal = ({ isOpen, onClose, onPush, username }) => {
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('system')
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title || !message) return
        setIsSubmitting(true)
        try {
            await onPush({ title, message, type })
            setTitle('')
            setMessage('')
            onClose()
        } catch (err) {
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#161632] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="size-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-400 text-2xl">notifications_active</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Direct Push</h2>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-black">Target: {username}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alert Type</label>
                        <select 
                            value={type}
                            onChange={e => setType(e.target.value)}
                            className="w-full bg-[#0b0b1e] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 appearance-none text-sm"
                        >
                            <option value="system">General System</option>
                            <option value="achievement">Achievement Alert</option>
                            <option value="clash">Clash Notification</option>
                            <option value="social">Social Update</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Notification Title</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-[#0b0b1e] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                            placeholder="e.g. Profile Verified"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Message Body</label>
                        <textarea 
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={3}
                            className="w-full bg-[#0b0b1e] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 resize-none"
                            placeholder="Type your message here..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 transition-all">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white bg-purple-600 hover:bg-purple-500 shadow-xl shadow-purple-900/20 active:scale-95 transition-all"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Push'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const AdminUsers = () => {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const { users, isLoading, updateUserStatus, deleteUser } = useAdminUsers()
    const { pushDirectNotification } = useAdminNotifications()
    
    const [awardModal, setAwardModal] = useState({ isOpen: false, user: null })
    const [pushModal, setPushModal] = useState({ isOpen: false, user: null })
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', user: null })

    const handleActionClick = (type, user) => {
        setConfirmModal({ isOpen: true, type, user })
    }

    const executeAction = async () => {
        const { type, user } = confirmModal
        try {
            if (type === 'suspend' || type === 'activate') {
                await updateUserStatus(user.id, type === 'suspend' ? 'suspended' : 'active')
            } else if (type === 'delete') {
                await deleteUser(user.id)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setConfirmModal({ isOpen: false, type: '', user: null })
        }
    }

    const handleGrantAward = async ({ type, value }) => {
        const userRef = doc(db, 'users', awardModal.user.id)
        try {
            if (type === 'xp') {
                await updateDoc(userRef, { xp: increment(value) })
            } else {
                await updateDoc(userRef, { 
                    achievements: arrayUnion(value.id)
                })
            }
            return true
        } catch (error) {
            console.error("Error granting reward:", error)
            throw error
        }
    }

    const handlePushNotify = async (notif) => {
        try {
            await pushDirectNotification(pushModal.user.id, notif)
            return true
        } catch (error) {
            console.error("Error pushing notification:", error)
            throw error
        }
    }

    const filtered = users.filter(u => {
        const matchesSearch = u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = filter === 'all' || u.status === filter
        return matchesSearch && matchesFilter
    })

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-[#161632] p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight uppercase">User Management</h1>
                    <p className="text-slate-400 mt-1">Manage user access, rewards, and platform communication.</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    {['all', 'active', 'suspended'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
                <input
                    type="text"
                    placeholder="Search users by name or email address..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-[#12122a] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all shadow-2xl"
                />
            </div>

            <div className="bg-[#12122a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                                <th className="text-left px-6 py-5">User Account</th>
                                <th className="text-left px-6 py-5">Level / XP</th>
                                <th className="text-left px-6 py-5 text-center">Status</th>
                                <th className="text-left px-6 py-5">Joined Date</th>
                                <th className="text-right px-6 py-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(user => (
                                <tr key={user.id} className="hover:bg-white/[0.015] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-sm group-hover:scale-110 transition-transform">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{user.username}</p>
                                                <p className="text-[10px] text-slate-500 font-mono italic">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-12 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-yellow-500" style={{ width: `${(user.level / 50) * 100}%` }}></div>
                                            </div>
                                            <span className="text-yellow-500 font-black text-xs">LV.{user.level}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <Badge status={user.status} />
                                    </td>
                                    <td className="px-6 py-5 text-slate-500 text-xs font-medium">{user.joined}</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => setPushModal({ isOpen: true, user })}
                                                title="Push Notification"
                                                className="p-2 rounded-xl text-slate-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-lg">notifications_active</span>
                                            </button>
                                            <button
                                                onClick={() => setAwardModal({ isOpen: true, user })}
                                                title="Grant Reward"
                                                className="p-2 rounded-xl text-slate-500 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-lg">military_tech</span>
                                            </button>
                                            <button
                                                onClick={() => navigate(`/app/profile/${user.username}`)}
                                                title="View Profile"
                                                className="p-2 rounded-xl text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                            </button>
                                            <button
                                                onClick={() => handleActionClick(user.status === 'suspended' ? 'activate' : 'suspend', user)}
                                                title={user.status === 'suspended' ? 'Restore Access' : 'Suspend Access'}
                                                className={`p-2 rounded-xl transition-all ${user.status === 'suspended'
                                                    ? 'text-green-500 hover:bg-green-500/10'
                                                    : 'text-orange-500 hover:bg-orange-500/10'
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined text-lg">
                                                    {user.status === 'suspended' ? 'lock_open' : 'lock'}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => handleActionClick('delete', user)}
                                                title="Delete Account"
                                                className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                disabled={user.role === 'admin'}
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AwardModal 
                isOpen={awardModal.isOpen} 
                onClose={() => setAwardModal({ isOpen: false, user: null })} 
                onAward={handleGrantAward}
                username={awardModal.user?.username}
            />

            <PushModal 
                isOpen={pushModal.isOpen}
                onClose={() => setPushModal({ isOpen: false, user: null })}
                onPush={handlePushNotify}
                username={pushModal.user?.username}
            />

            <ConfirmationModal 
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, type: '', user: null })}
                onConfirm={executeAction}
                title={confirmModal.type === 'delete' ? 'Delete User Account?' : (confirmModal.type === 'suspend' ? 'Suspend User?' : 'Restore User Access?')}
                message={confirmModal.type === 'delete' 
                    ? `Are you absolutely sure you want to permanently delete "${confirmModal.user?.username}"? This action cannot be undone.`
                    : `Confirm status protocol change for ${confirmModal.user?.username}. This will ${confirmModal.type === 'suspend' ? 'block' : 'restore'} their platform access.`
                }
                confirmText={confirmModal.type === 'delete' ? 'Delete' : (confirmModal.type === 'suspend' ? 'Suspend' : 'Restore')}
                variant={confirmModal.type === 'delete' || confirmModal.type === 'suspend' ? 'danger' : 'success'}
            />
        </div>
    )
}

export default AdminUsers

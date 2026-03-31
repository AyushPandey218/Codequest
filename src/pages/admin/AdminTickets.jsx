import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminTickets } from '../../hooks/useAdminTickets'
import { useNotification } from '../../context/NotificationContext'
import Card from '../../components/common/Card'
import Avatar from '../../components/common/Avatar'
import Button from '../../components/common/Button'
import { motion, AnimatePresence } from 'framer-motion'

const AdminTickets = () => {
    const { tickets, isLoading, updateTicketStatus, deleteTicket } = useAdminTickets()
    const { showToast } = useNotification()
    const [filter, setFilter] = useState('all') // all, open, resolved, closed
    const [selectedTicket, setSelectedTicket] = useState(null)

    const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter)

    const handleUpdateStatus = async (ticketId, userId, newStatus) => {
        try {
            await updateTicketStatus(ticketId, userId, newStatus)
            showToast(`Ticket #${ticketId.slice(0, 5)} marked as ${newStatus}`, 'success')
            if (selectedTicket?.id === ticketId) setSelectedTicket(prev => ({ ...prev, status: newStatus }))
        } catch (error) {
            showToast('Failed to update ticket.', 'error')
        }
    }

    const handleDelete = async (ticketId) => {
        if (!window.confirm('Permanently delete this ticket?')) return
        try {
            await deleteTicket(ticketId)
            showToast('Ticket deleted.', 'success')
            if (selectedTicket?.id === ticketId) setSelectedTicket(null)
        } catch (error) {
            showToast('Failed to delete ticket.', 'error')
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="size-12 rounded-2xl border-4 border-red-500/20 border-t-red-500 animate-spin" />
                <p className="text-slate-500 font-black uppercase tracking-[0.3em]">Syncing Support Grid...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12 pr-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-950 to-[#0b0b1e] p-10 rounded-[3rem] border border-red-900/20 shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="size-2 rounded-full bg-red-500 animate-ping"></span>
                        <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.4em]">Ticketing Interface</span>
                    </div>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Support Operations</h1>
                    <p className="text-slate-400 mt-3 max-w-xl font-medium leading-relaxed">Manage user inquiries and technical reports across the ecosystem.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 w-fit">
                {['all', 'open', 'resolved', 'closed'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            filter === f ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Tickets List */}
                <div className="lg:col-span-12 space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredTickets.map((ticket) => (
                            <motion.div
                                key={ticket.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`glass-card-premium overflow-hidden group border-l-4 ${
                                    ticket.status === 'open' ? 'border-l-blue-500' : 
                                    ticket.status === 'resolved' ? 'border-l-green-500' : 'border-l-slate-700'
                                }`}
                            >
                                <div className="p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
                                    <div className="flex items-center gap-6 flex-1 min-w-0">
                                        <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center text-red-400 font-black text-xs border border-white/10 shrink-0">
                                            #{ticket.id.slice(0, 5)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-black text-white truncate">{ticket.username}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                                    ticket.status === 'open' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                                                    ticket.status === 'resolved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                                    'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                                }`}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                <span className="text-red-400">{ticket.issueType}</span>
                                                <span className="size-1 bg-slate-800 rounded-full"></span>
                                                <span>{ticket.createdAt?.toDate()?.toLocaleString() || 'Ancient'}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-1 max-w-md w-full">
                                        <p className="text-sm text-slate-400 font-medium line-clamp-1 italic">"{ticket.description}"</p>
                                    </div>

                                    <div className="flex items-center gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity translate-z-0">
                                        <button
                                            onClick={() => setSelectedTicket(ticket)}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all"
                                        >
                                            Inspect
                                        </button>
                                        <div className="h-4 w-px bg-white/10 mx-1" />
                                        {ticket.status === 'open' && (
                                            <button
                                                onClick={() => handleUpdateStatus(ticket.id, ticket.uid, 'resolved')}
                                                className="px-4 py-2 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white border border-green-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(ticket.id)}
                                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {filteredTickets.length === 0 && (
                            <div className="py-32 text-center glass-card-premium border-dashed border-red-900/20">
                                <span className="material-symbols-outlined text-5xl text-slate-800 mb-4 block">assignment_turned_in</span>
                                <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Clear Slate</h3>
                                <p className="text-[9px] text-slate-600 mt-2 uppercase">No pending requests in this sector</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Ticket Details Portal/Modal */}
            <AnimatePresence>
                {selectedTicket && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTicket(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0b0b1e] border border-white/5 w-full max-w-2xl rounded-[2.5rem] shadow-4xl relative z-10 overflow-hidden"
                        >
                            <div className="p-10 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="size-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-3xl text-red-400">confirmation_number</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Detail View</span>
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">#{selectedTicket.id}</span>
                                            </div>
                                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{selectedTicket.username}</h2>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        selectedTicket.status === 'open' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 
                                        selectedTicket.status === 'resolved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                    }`}>
                                        {selectedTicket.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Student ID</p>
                                        <p className="text-sm font-bold text-white tracking-widest">{selectedTicket.studentId}</p>
                                    </div>
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Issue Context</p>
                                        <p className="text-sm font-bold text-red-400 uppercase tracking-widest">{selectedTicket.issueType}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Investigation Report</p>
                                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 min-h-[120px] max-h-[250px] overflow-y-auto">
                                        <p className="text-slate-300 leading-relaxed font-medium">{selectedTicket.description}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    {selectedTicket.status !== 'resolved' && (
                                        <Button
                                            className="flex-1 h-14 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest text-[10px]"
                                            onClick={() => handleUpdateStatus(selectedTicket.id, selectedTicket.uid, 'resolved')}
                                        >
                                            Establish Resolution
                                        </Button>
                                    )}
                                    {selectedTicket.status !== 'closed' && (
                                        <Button
                                            className="flex-1 h-14 bg-slate-700 hover:bg-slate-600 text-white font-black uppercase tracking-widest text-[10px]"
                                            onClick={() => handleUpdateStatus(selectedTicket.id, selectedTicket.uid, 'closed')}
                                        >
                                            Decommission Ticket
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        className="size-14 p-0 shrink-0 border-white/10 hover:border-red-500/50"
                                        onClick={() => setSelectedTicket(null)}
                                    >
                                        <span className="material-symbols-outlined text-slate-500">close</span>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminTickets

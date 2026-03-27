import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNotification } from '../../context/NotificationContext'
import Card from './Card'
import Button from './Button'

const NotificationCenter = ({ isOpen, onClose }) => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotification()
    const dropdownRef = useRef(null)

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, onClose])

    const getTypeIcon = (type) => {
        switch (type) {
            case 'achievement': return 'military_tech'
            case 'system': return 'info'
            case 'clash': return 'swords'
            case 'social': return 'group'
            default: return 'notifications'
        }
    }

    const getTypeColor = (type) => {
        switch (type) {
            case 'achievement': return 'text-yellow-500'
            case 'system': return 'text-blue-500'
            case 'clash': return 'text-red-500'
            case 'social': return 'text-green-500'
            default: return 'text-primary'
        }
    }

    if (!isOpen) return null

    return (
        <div
            ref={dropdownRef}
            className="absolute top-14 right-0 w-[400px] max-h-[600px] flex flex-col bg-[#0b0b1e]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[1000] overflow-hidden animate-slide-up origin-top-right ring-1 ring-white/10"
        >
            {/* Header */}
            <div className="p-6 pb-4 flex items-center justify-between bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16"></div>
                <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter">
                        NOTIFICATIONS
                        {unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-blue-500/20">
                                {unreadCount} NEW
                            </span>
                        )}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Systems Intelligence Relay</p>
                </div>
                <div className="flex items-center gap-3">
                    {notifications.length > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-[9px] font-black text-blue-400 hover:text-white uppercase tracking-[0.2em] transition-all bg-blue-500/10 hover:bg-blue-600 px-3 py-1.5 rounded-full border border-blue-500/20"
                        >
                            Sync All
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="size-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5"
                    >
                        <span className="material-symbols-outlined text-base">close</span>
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar space-y-2 mb-4">
                {notifications.length === 0 ? (
                    <div className="py-20 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent blur-3xl"></div>
                        <div className="size-20 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-6 relative">
                            <span className="material-symbols-outlined text-4xl text-slate-700">sensors_off</span>
                            <div className="absolute -inset-1 bg-blue-500/10 blur-xl rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">No Signal Detected</p>
                        <p className="text-[9px] text-slate-600 mt-2 uppercase tracking-widest leading-relaxed">System standby. All parameters nominal.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => !n.read && markAsRead(n.id, n.isGlobal)}
                                className={`group p-4 rounded-2xl transition-all border relative overflow-hidden cursor-pointer ${
                                    !n.read 
                                    ? 'bg-blue-600/[0.07] border-blue-500/20 hover:bg-blue-600/[0.1]' 
                                    : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                                }`}
                            >
                                <div className="flex gap-4 relative z-10">
                                    <div className={`size-12 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-transform group-hover:scale-110 group-hover:-rotate-3 shadow-xl ${
                                        !n.read ? 'bg-blue-500/20 border-blue-500/30' : 'bg-white/5 border-white/10'
                                    } ${getTypeColor(n.type)}`}>
                                        <span className={`material-symbols-outlined text-2xl ${!n.read ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`}>
                                            {getTypeIcon(n.type)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <p className={`text-[13px] font-black tracking-tight ${!n.read ? 'text-white' : 'text-slate-400'}`}>
                                                {n.title.toUpperCase()}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">
                                                    {n.createdAt?.toDate ? new Date(n.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Syncing...'}
                                                </span>
                                                {!n.read && (
                                                    <span className="size-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse" />
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium group-hover:text-slate-400 transition-colors">
                                            {n.message}
                                        </p>
                                        {n.link && (
                                            <div className="mt-3 flex">
                                                <Link
                                                    to={n.link}
                                                    onClick={onClose}
                                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${
                                                        !n.read 
                                                        ? 'bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white' 
                                                        : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'
                                                    }`}
                                                >
                                                    Interface
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {!n.read && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="p-4 bg-gradient-to-t from-white/[0.03] to-transparent border-t border-white/5">
                    <button
                        onClick={clearAll}
                        className="w-full py-3 text-[10px] font-black text-slate-600 hover:text-red-400 uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 bg-white/[0.01] hover:bg-red-500/5 rounded-2xl border border-white/5 hover:border-red-500/20"
                    >
                        <span className="material-symbols-outlined text-sm">terminal</span>
                        Clear Encryption Keys
                    </button>
                </div>
            )}
        </div>
    )
}

export default NotificationCenter

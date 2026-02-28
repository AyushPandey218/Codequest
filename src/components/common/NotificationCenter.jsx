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
            className="absolute top-12 right-0 w-80 md:w-96 max-h-[500px] flex flex-col bg-[#1c1c27] border border-white/5 rounded-2xl shadow-2xl z-[999] overflow-hidden animate-scale-in origin-top-right"
        >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/2">
                <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="bg-primary text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h3>
                </div>
                <div className="flex gap-2">
                    {notifications.length > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-wider transition-colors"
                        >
                            Mark all as read
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="size-16 rounded-full bg-white/2 flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl text-slate-700">notifications_off</span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">All caught up!</p>
                        <p className="text-slate-600 text-xs mt-1">No new notifications yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => !n.read && markAsRead(n.id)}
                                className={`p-4 hover:bg-white/2 transition-colors cursor-pointer group relative ${!n.read ? 'bg-primary/5' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <div className={`size-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5 ${getTypeColor(n.type)}`}>
                                        <span className="material-symbols-outlined text-xl">
                                            {getTypeIcon(n.type)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-0.5">
                                            <p className={`text-sm font-bold truncate ${!n.read ? 'text-white' : 'text-slate-400'}`}>
                                                {n.title}
                                            </p>
                                            {!n.read && (
                                                <div className="size-2 bg-primary rounded-full flex-shrink-0 shadow-sm shadow-primary/50" />
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                            {n.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[10px] text-slate-600 font-medium">
                                                {n.createdAt?.toDate ? new Date(n.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                            </span>
                                            {n.link && (
                                                <Link
                                                    to={n.link}
                                                    onClick={onClose}
                                                    className="text-[10px] text-primary hover:underline font-bold uppercase tracking-wider"
                                                >
                                                    View Details
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="p-3 border-t border-white/5 bg-white/2">
                    <button
                        onClick={clearAll}
                        className="w-full py-2 text-[10px] font-bold text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-xs">delete_sweep</span>
                        Clear all notifications
                    </button>
                </div>
            )}
        </div>
    )
}

export default NotificationCenter

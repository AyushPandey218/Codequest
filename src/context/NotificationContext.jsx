import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { collection, query, where, onSnapshot, updateDoc, doc, writeBatch, serverTimestamp, addDoc, orderBy, limit } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'
import AchievementToast from '../components/common/AchievementToast'
import NotificationToast from '../components/common/NotificationToast'

const NotificationContext = createContext(null)

export const useNotification = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider')
    }
    return context
}

export const NotificationProvider = ({ children }) => {
    const { user, updateProfile } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [toasts, setToasts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Real-time listener for both Private and Global notifications
    useEffect(() => {
        if (!user?.uid) {
            setNotifications([])
            setIsLoading(false)
            return
        }

        setIsLoading(true)

        // 1. Private Notifications Listener
        const privateQuery = query(
            collection(db, 'notifications'),
            where('uid', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(50)
        )

        // 2. Global Notifications Listener
        const globalQuery = query(
            collection(db, 'global_notifications'),
            orderBy('createdAt', 'desc'),
            limit(20)
        )

        let privateNotifs = []
        let globalNotifs = []

        const updateMergedNotifs = () => {
            // Filter global notifications based on user's lastClearedGlobal timestamp
            const lastCleared = user.lastClearedGlobal?.seconds || 0
            const filteredGlobal = globalNotifs.filter(n => (n.createdAt?.seconds || 0) > lastCleared)

            const merged = [...privateNotifs, ...filteredGlobal]
                .sort((a, b) => {
                    const aTime = a.createdAt?.seconds || 0
                    const bTime = b.createdAt?.seconds || 0
                    return bTime - aTime
                })
            
            // Mark global notifications as read based on user's lastReadGlobal timestamp
            const processed = merged.map(n => {
                if (n.isGlobal) {
                    const lastRead = user.lastReadGlobal?.seconds || 0
                    const createdAt = n.createdAt?.seconds || 0
                    return { ...n, read: createdAt <= lastRead }
                }
                return n
            })

            setNotifications(processed)
            setIsLoading(false)
        }

        const unsubPrivate = onSnapshot(privateQuery, (snapshot) => {
            privateNotifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isGlobal: false }))
            updateMergedNotifs()
        })

        const unsubGlobal = onSnapshot(globalQuery, (snapshot) => {
            globalNotifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isGlobal: true }))
            updateMergedNotifs()
        })

        return () => {
            unsubPrivate()
            unsubGlobal()
        }
    }, [user?.uid, user?.lastReadGlobal, user?.lastClearedGlobal])

    const showAchievement = useCallback((achievementId) => {
        setToasts(prev => [...prev, { id: Date.now(), achievementId, type: 'achievement' }])
    }, [])

    const showToast = useCallback((message, type = 'info') => {
        setToasts(prev => [...prev, { id: Date.now(), message, type }])
    }, [])

    const createNotification = useCallback(async (notif, targetUid = null) => {
        const uid = targetUid || user?.uid
        if (!uid) return
        try {
            await addDoc(collection(db, 'notifications'), {
                uid,
                ...notif,
                read: false,
                createdAt: serverTimestamp()
            })
        } catch (error) {
            console.error('Error creating notification:', error)
        }
    }, [user?.uid])

    const markAsRead = useCallback(async (id, isGlobal = false) => {
        try {
            if (isGlobal) {
                // For global notifs, we update the user's lastReadGlobal to NOW
                await updateProfile({ lastReadGlobal: serverTimestamp() })
            } else {
                await updateDoc(doc(db, 'notifications', id), { read: true })
            }
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }, [updateProfile])

    const markAllAsRead = useCallback(async () => {
        if (!user?.uid) return
        try {
            // 1. Mark private as read
            const unreadPrivate = notifications.filter(n => !n.read && !n.isGlobal)
            if (unreadPrivate.length > 0) {
                const batch = writeBatch(db)
                unreadPrivate.forEach(n => {
                    batch.update(doc(db, 'notifications', n.id), { read: true })
                })
                await batch.commit()
            }

            // 2. Mark global as read (update user timestamp)
            await updateProfile({ lastReadGlobal: serverTimestamp() })

        } catch (error) {
            console.error('Error marking all as read:', error)
        }
    }, [user?.uid, notifications, updateProfile])

    const clearAll = useCallback(async () => {
        if (!user?.uid) return
        try {
            // 1. Delete private notifications from DB
            const privateNotifs = notifications.filter(n => !n.isGlobal)
            if (privateNotifs.length > 0) {
                const batch = writeBatch(db)
                privateNotifs.forEach(n => {
                    batch.delete(doc(db, 'notifications', n.id))
                })
                await batch.commit()
            }

            // 2. Hide global notifications for this user
            await updateProfile({ lastClearedGlobal: serverTimestamp() })
        } catch (error) {
            console.error('Error clearing notifications:', error)
        }
    }, [user?.uid, notifications, updateProfile])

    const dismissToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            isLoading,
            showAchievement,
            showToast,
            createNotification,
            markAsRead,
            markAllAsRead,
            clearAll
        }}>
            {children}

            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4">
                {toasts.map((t) => (
                    t.type === 'achievement' ? (
                        <AchievementToast
                            key={t.id}
                            achievementId={t.achievementId}
                            onDismiss={() => dismissToast(t.id)}
                        />
                    ) : (
                        <NotificationToast
                            key={t.id}
                            message={t.message}
                            type={t.type}
                            onDismiss={() => dismissToast(t.id)}
                        />
                    )
                ))}
            </div>
        </NotificationContext.Provider>
    )
}

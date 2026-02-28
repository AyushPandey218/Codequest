import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { collection, query, where, onSnapshot, updateDoc, doc, writeBatch, serverTimestamp, addDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'
import AchievementToast from '../components/common/AchievementToast'

const NotificationContext = createContext(null)

export const useNotification = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider')
    }
    return context
}

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [toasts, setToasts] = useState([])

    // Real-time listener for Firestore notifications
    useEffect(() => {
        if (!user?.uid) {
            setNotifications([])
            return
        }

        const q = query(
            collection(db, 'notifications'),
            where('uid', '==', user.uid)
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => {
                    // Sort by createdAt descending (newest first)
                    const aTime = a.createdAt?.seconds || 0
                    const bTime = b.createdAt?.seconds || 0
                    return bTime - aTime
                })
            setNotifications(notifs)
        })

        return () => unsubscribe()
    }, [user?.uid])

    /**
     * Shows an achievement notification (Toast)
     * And optionally creates a persistent notification record
     */
    const showAchievement = useCallback(async (achievementId, persist = true) => {
        // Show Toast
        setToasts(prev => [...prev, { id: Date.now(), achievementId, type: 'achievement' }])

        // Persist to Firestore if needed (Achievements data is already in achievements.js)
        // We'll handle persistent achievement creation in AuthContext to avoid duplication
    }, [])

    const createNotification = useCallback(async (notif) => {
        if (!user?.uid) return
        try {
            await addDoc(collection(db, 'notifications'), {
                uid: user.uid,
                ...notif,
                read: false,
                createdAt: serverTimestamp()
            })
        } catch (error) {
            console.error('Error creating notification:', error)
        }
    }, [user?.uid])

    const markAsRead = useCallback(async (id) => {
        try {
            await updateDoc(doc(db, 'notifications', id), { read: true })
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }, [])

    const markAllAsRead = useCallback(async () => {
        if (!user?.uid) return
        try {
            const batch = writeBatch(db)
            notifications.filter(n => !n.read).forEach(n => {
                batch.update(doc(db, 'notifications', n.id), { read: true })
            })
            await batch.commit()
        } catch (error) {
            console.error('Error marking all as read:', error)
        }
    }, [user?.uid, notifications])

    const clearAll = useCallback(async () => {
        if (!user?.uid) return
        try {
            const batch = writeBatch(db)
            notifications.forEach(n => {
                batch.delete(doc(db, 'notifications', n.id))
            })
            await batch.commit()
        } catch (error) {
            console.error('Error clearing all notifications:', error)
        }
    }, [user?.uid, notifications])

    const dismissToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            showAchievement,
            createNotification,
            markAsRead,
            markAllAsRead,
            clearAll
        }}>
            {children}

            {/* Render Toasts */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4">
                {toasts.map((t) => (
                    <AchievementToast
                        key={t.id}
                        achievementId={t.achievementId}
                        onDismiss={() => dismissToast(t.id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    )
}

import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'

export function useAdminNotifications() {
    
    /**
     * Pushes a notification to ALL users simultaneously
     */
    const pushGlobalNotification = async ({ title, message, type = 'system', link = null }) => {
        try {
            await addDoc(collection(db, 'global_notifications'), {
                title,
                message,
                type,
                link,
                createdAt: serverTimestamp()
            })
            return { success: true }
        } catch (error) {
            console.error('Error pushing global notification:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * Pushes a notification to a specific user
     */
    const pushDirectNotification = async (targetUid, { title, message, type = 'system', link = null }) => {
        if (!targetUid) return { success: false, error: 'Target User ID required' }
        try {
            await addDoc(collection(db, 'notifications'), {
                uid: targetUid,
                title,
                message,
                type,
                link,
                read: false,
                createdAt: serverTimestamp()
            })
            return { success: true }
        } catch (error) {
            console.error('Error pushing direct notification:', error)
            return { success: false, error: error.message }
        }
    }

    return { pushGlobalNotification, pushDirectNotification }
}

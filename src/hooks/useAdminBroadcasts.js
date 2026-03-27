import { useState, useEffect } from 'react'
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

export function useAdminBroadcasts() {
    const [broadcasts, setBroadcasts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const q = query(collection(db, 'broadcasts'), orderBy('createdAt', 'desc'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setBroadcasts(list)
            setIsLoading(false)
        }, (err) => {
            console.error("Error fetching admin broadcasts:", err)
            setIsLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const createBroadcast = async (data) => {
        try {
            await addDoc(collection(db, 'broadcasts'), {
                ...data, // title, message, type (info, warning, success)
                active: true,
                createdAt: serverTimestamp()
            })
            return true
        } catch (error) {
            console.error("Error creating broadcast:", error)
            throw error
        }
    }

    const deleteBroadcast = async (id) => {
        try {
            await deleteDoc(doc(db, 'broadcasts', id))
            return true
        } catch (error) {
            console.error("Error deleting broadcast:", error)
            throw error
        }
    }

    const toggleBroadcast = async (id, active) => {
        try {
            await updateDoc(doc(db, 'broadcasts', id), { active })
            return true
        } catch (error) {
            console.error("Error toggling broadcast:", error)
            throw error
        }
    }

    return { broadcasts, isLoading, createBroadcast, deleteBroadcast, toggleBroadcast }
}

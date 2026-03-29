import { useState, useEffect } from 'react'
import { collection, query, getDocs, orderBy, doc, updateDoc, deleteDoc, arrayRemove } from 'firebase/firestore'
import { db } from '../config/firebase'
import { getLevelFromXP } from '../utils/progressStorage'

export function useAdminUsers() {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchUsers = async () => {
        try {
            const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
            const snapshot = await getDocs(q)

            const fetchedUsers = snapshot.docs.map(doc => {
                const data = doc.data()
                const createdAt = data.createdAt?.toDate()

                return {
                    id: doc.id,
                    username: data.username || 'Anonymous',
                    email: data.email || 'No email',
                    xp: data.xp || 0,
                    level: getLevelFromXP(data.xp || 0),
                    role: data.role || 'user',
                    status: data.status || 'active',
                    foundEasterEgg: data.foundEasterEgg || false,
                    joined: createdAt
                        ? createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'Unknown'
                }
            })

            setUsers(fetchedUsers)
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching users:", error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const updateUserStatus = async (userId, newStatus) => {
        try {
            const userRef = doc(db, 'users', userId)
            await updateDoc(userRef, { status: newStatus })
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u))
        } catch (error) {
            console.error("Error updating user status:", error)
            throw error
        }
    }

    const deleteUser = async (userId) => {
        try {
            await deleteDoc(doc(db, 'users', userId))
            setUsers(prev => prev.filter(u => u.id !== userId))
        } catch (error) {
            console.error("Error deleting user:", error)
            throw error
        }
    }

    const resetEasterEgg = async (userId) => {
        try {
            const userRef = doc(db, 'users', userId)
            await updateDoc(userRef, { 
                foundEasterEgg: false,
                achievements: arrayRemove('wait_that_worked')
            })
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, foundEasterEgg: false } : u))
        } catch (error) {
            console.error("Error resetting easter egg:", error)
            throw error
        }
    }

    return { users, isLoading, updateUserStatus, deleteUser, resetEasterEgg, refetch: fetchUsers }
}

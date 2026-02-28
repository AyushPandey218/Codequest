import { useState, useEffect } from 'react'
import { collection, query, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'

export function useAdminUsers() {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
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
                        level: data.level || 1,
                        role: data.role || 'user',
                        status: data.status || 'active',
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

        fetchUsers()
    }, [])

    return { users, isLoading }
}

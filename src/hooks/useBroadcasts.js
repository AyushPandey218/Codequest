import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'

export function useBroadcasts() {
    const [activeBroadcast, setActiveBroadcast] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Fetch all active broadcasts and sort in-memory to avoid composite index requirement
        const q = query(
            collection(db, 'broadcasts'), 
            where('active', '==', true)
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                // Get all active docs
                const activeDocs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))

                // Sort by createdAt desc in memory
                // We use || 0 to handle cases where serverTimestamp hasn't updated yet
                activeDocs.sort((a, b) => {
                    const timeA = a.createdAt?.seconds || 0
                    const timeB = b.createdAt?.seconds || 0
                    return timeB - timeA
                })

                setActiveBroadcast(activeDocs[0])
            } else {
                setActiveBroadcast(null)
            }
            setIsLoading(false)
        }, (err) => {
            console.error("Error fetching broadcasts:", err)
            setIsLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return { activeBroadcast, isLoading }
}

import { useState, useEffect } from 'react'
import { doc, onSnapshot, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../context/AuthContext'

/**
 * Hook to manage real-time CodeClash match state
 * @param {string} clashId - The ID of the clash document
 * @returns {Object} { clash, players, activityFeed, updateScore, addActivity, loading, error }
 */
export const useClash = (clashId) => {
    const { user } = useAuth()
    const [clash, setClash] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!clashId) {
            setLoading(false)
            return
        }

        const unsubscribe = onSnapshot(
            doc(db, 'clashes', clashId),
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    setClash({ id: docSnapshot.id, ...docSnapshot.data() })
                } else {
                    setError('Clash not found')
                }
                setLoading(false)
            },
            (err) => {
                console.error('Error fetching clash:', err)
                setError(err.message)
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [clashId])

    /**
     * Update the current user's score in the clash
     * @param {number} testsPassed - Number of tests passed
     * @param {number} totalTests - Total number of tests
     */
    const updateScore = async (testsPassed, totalTests) => {
        if (!clashId || !user) return

        try {
            const playerKey = `players.${user.uid}`
            await updateDoc(doc(db, 'clashes', clashId), {
                [`${playerKey}.testsPassed`]: testsPassed,
                [`${playerKey}.totalTests`]: totalTests,
                [`${playerKey}.score`]: testsPassed * 25, // Basic scoring logic
                [`${playerKey}.lastUpdate`]: serverTimestamp(),
            })
        } catch (err) {
            console.error('Error updating score:', err)
        }
    }

    /**
     * Add an activity to the clash feed
     * @param {string} action - Description of the action
     * @param {string} icon - Icon name
     * @param {string} color - CSS color class
     */
    const addActivity = async (action, icon = 'info', color = 'text-blue-500') => {
        if (!clashId || !user) return

        try {
            await updateDoc(doc(db, 'clashes', clashId), {
                activityFeed: arrayUnion({
                    user: user.username || 'User',
                    uid: user.uid,
                    action,
                    icon,
                    color,
                    timestamp: new Date().toISOString(),
                })
            })
        } catch (err) {
            console.error('Error adding activity:', err)
        }
    }

    // Derived state for easier consumption
    const players = clash?.players ? Object.entries(clash.players).map(([uid, data]) => ({
        uid,
        isYou: uid === user?.uid,
        ...data
    })).sort((a, b) => (b.score || 0) - (a.score || 0)) : []

    const activityFeed = clash?.activityFeed || []

    return {
        clash,
        players,
        activityFeed,
        updateScore,
        addActivity,
        loading,
        error
    }
}

export default useClash

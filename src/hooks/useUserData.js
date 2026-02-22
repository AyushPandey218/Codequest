import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'
import { getProgressSummary } from '../utils/progressStorage'

// Get user data from localStorage progress storage
const getLocalUserData = (uid) => {
  const summary = getProgressSummary()
  return {
    id: uid,
    xp: summary.xp,
    level: summary.level,
    rank: 156, // Still mock rank for now
    streak: 7, // Still mock streak for now
    totalQuests: 50,
    completedQuests: summary.completedCount,
    achievements: ['first-quest', 'week-streak', 'python-master'],
    createdAt: new Date(),
  }
}

/**
 * Hook to fetch user data from Firestore
 * @param {string} uid - User ID
 * @returns {Object} { userData, loading, error }
 */
export const useUserData = (uid) => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!uid) {
      setUserData(null)
      setLoading(false)
      return
    }

    // Set local progress data immediately
    setUserData(getLocalUserData(uid))
    setLoading(false)

    // Then try to fetch from Firestore (will replace mock data if available)
    const unsubscribe = onSnapshot(
      doc(db, 'users', uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setUserData({ id: docSnapshot.id, ...docSnapshot.data() })
        }
        // If doesn't exist, keep mock data
        setLoading(false)
      },
      (err) => {
        console.warn('Firestore unavailable, using mock data:', err.message)
        // Keep mock data on error
        setError(null)
        setLoading(false)
      }
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [uid])

  return { userData, loading, error }
}

export default useUserData

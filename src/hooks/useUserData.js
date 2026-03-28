import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db, isDemoMode } from '../config/firebase'

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

    if (isDemoMode) {
      // Return mock data for demo mode
      setUserData({
        id: uid,
        username: 'demo_user',
        email: 'demo@codequest.com',
        role: 'admin',
        level: 10,
        xp: 2500,
        streak: 5,
        rating: 1200,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Demo`
      })
      setLoading(false)
      return
    }

    setLoading(true)

    // Fetch from Firestore
    const unsubscribe = onSnapshot(
      doc(db, 'users', uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setUserData({ id: docSnapshot.id, ...docSnapshot.data() })
        } else {
          setUserData(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error('Firestore error fetching user data:', err.message)
        setError(err.message)
        setLoading(false)
      }
    )

    // Cleanup subscription on unmount
    return () => (unsubscribe ? unsubscribe() : null)
  }, [uid])

  return { userData, loading, error }
}

export default useUserData

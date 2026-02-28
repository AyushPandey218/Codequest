import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'

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
    return () => unsubscribe()
  }, [uid])

  return { userData, loading, error }
}

export default useUserData

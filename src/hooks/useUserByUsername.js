import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Hook to find a user's UID by their username
 * @param {string} username - The username to search for
 * @returns {Object} { uid, loading, error }
 */
export const useUserByUsername = (username) => {
  const [uid, setUid] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!username) {
      setUid(null)
      setLoading(false)
      return
    }

    const fetchUid = async () => {
      setLoading(true)
      try {
        const q = query(
          collection(db, 'users'),
          where('username', '==', username),
          limit(1)
        )
        const querySnapshot = await getDocs(q)
        
        if (!querySnapshot.empty) {
          setUid(querySnapshot.docs[0].id)
        } else {
          setUid(null)
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching user by username:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchUid()
  }, [username])

  return { uid, loading, error }
}

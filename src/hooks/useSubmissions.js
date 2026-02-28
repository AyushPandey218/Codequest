import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Hook to fetch user submissions from Firestore
 * @param {string} uid - User ID
 * @returns {Object} { submissions, loading, error }
 */
export const useSubmissions = (uid) => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!uid) {
      setSubmissions([])
      setLoading(false)
      return
    }

    setLoading(true)

    // Fetch from Firestore
    try {
      const q = query(
        collection(db, 'submissions'),
        where('uid', '==', uid)
      )

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const submissionsData = []
          querySnapshot.forEach((doc) => {
            submissionsData.push({ id: doc.id, ...doc.data() })
          })

          // Sort client-side to avoid index requirement
          submissionsData.sort((a, b) => {
            const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : (a.timestamp ? new Date(a.timestamp).getTime() : 0)
            const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : (b.timestamp ? new Date(b.timestamp).getTime() : 0)
            return timeB - timeA
          })

          setSubmissions(submissionsData)
          setLoading(false)
        },
        (err) => {
          console.error('Firestore error fetching submissions:', err.message)
          setError(err.message)
          setLoading(false)
        }
      )

      return () => unsubscribe()
    } catch (err) {
      console.error('Query setup error:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [uid])

  return { submissions, loading, error }
}

export default useSubmissions

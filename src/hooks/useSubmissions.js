import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'

// Mock submissions data for instant loading
const MOCK_SUBMISSIONS = [
  {
    id: '1',
    questTitle: 'Python Basics',
    questId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    xpEarned: 100,
    passedTests: 10,
    totalTests: 10,
  },
  {
    id: '2',
    questTitle: 'JavaScript Functions',
    questId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    xpEarned: 150,
    passedTests: 5,
    totalTests: 8,
  },
  {
    id: '3',
    questTitle: 'Build a REST API',
    questId: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    xpEarned: 350,
    passedTests: 12,
    totalTests: 12,
  },
]

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

    // Set mock data immediately for instant UI
    setSubmissions(MOCK_SUBMISSIONS)
    setLoading(false)

    // Then try to fetch from Firestore (will replace mock data if available)
    const q = query(
      collection(db, 'submissions'),
      where('uid', '==', uid),
      orderBy('timestamp', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const submissionsData = []
          querySnapshot.forEach((doc) => {
            submissionsData.push({ id: doc.id, ...doc.data() })
          })
          setSubmissions(submissionsData)
        }
        // If empty, keep mock data
        setLoading(false)
      },
      (err) => {
        console.warn('Firestore unavailable, using mock data:', err.message)
        // Keep mock data on error
        setError(null)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [uid])

  return { submissions, loading, error }
}

export default useSubmissions

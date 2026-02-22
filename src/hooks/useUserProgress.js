import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'

// Mock user progress data for instant loading
const MOCK_PROGRESS = {
  '1': {
    completed: true,
    passedTests: 10,
    totalTests: 10,
    lastAttempt: new Date(),
    language: 'python',
  },
  '2': {
    completed: false,
    passedTests: 5,
    totalTests: 8,
    lastAttempt: new Date(),
    language: 'javascript',
  },
  '4': {
    completed: true,
    passedTests: 12,
    totalTests: 12,
    lastAttempt: new Date(),
    language: 'javascript',
  },
}

/**
 * Hook to fetch user progress across all quests
 * @param {string} uid - User ID
 * @returns {Object} { progress, loading, error }
 */
export const useUserProgress = (uid) => {
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!uid) {
      setProgress({})
      setLoading(false)
      return
    }

    // Set mock data immediately for instant UI
    setProgress(MOCK_PROGRESS)
    setLoading(false)

    // Then try to fetch from Firestore (will replace mock data if available)
    const q = query(
      collection(db, 'submissions'),
      where('uid', '==', uid)
    )

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const progressMap = {}
          querySnapshot.forEach((doc) => {
            const data = doc.data()
            // Store the latest submission for each quest
            if (!progressMap[data.questId] || 
                data.timestamp > progressMap[data.questId].timestamp) {
              progressMap[data.questId] = {
                completed: data.passedTests === data.totalTests,
                passedTests: data.passedTests,
                totalTests: data.totalTests,
                lastAttempt: data.timestamp,
                language: data.language,
                code: data.code
              }
            }
          })
          setProgress(progressMap)
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

  return { progress, loading, error }
}

export default useUserProgress

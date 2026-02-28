import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'

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

    setLoading(true)

    // Fetch from Firestore
    const q = query(
      collection(db, 'submissions'),
      where('uid', '==', uid)
    )

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const progressMap = {}
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const data = doc.data()
            // Store the latest submission for each quest
            const existing = progressMap[data.questId]
            const currentTimestamp = data.timestamp?.toMillis ? data.timestamp.toMillis() : (data.timestamp ? new Date(data.timestamp).getTime() : Date.now())
            const existingTimestamp = existing?.lastAttempt?.toMillis ? existing.lastAttempt.toMillis() : (existing?.lastAttempt ? new Date(existing.lastAttempt).getTime() : 0)

            if (!existing || currentTimestamp > existingTimestamp) {
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
        }
        setProgress(progressMap)
        setLoading(false)
      },
      (err) => {
        console.error('Firestore error fetching user progress:', err.message)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [uid])

  return { progress, loading, error }
}

export default useUserProgress

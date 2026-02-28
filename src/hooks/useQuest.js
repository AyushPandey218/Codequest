import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Hook to fetch quest details from Firestore
 * @param {string} questId - Quest ID
 * @returns {Object} { quest, loading, error }
 */
export const useQuest = (questId) => {
  const [quest, setQuest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!questId) {
      setQuest(null)
      setLoading(false)
      return
    }

    setLoading(true)

    // Fetch from Firestore
    const unsubscribe = onSnapshot(
      doc(db, 'quests', questId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setQuest({ id: docSnapshot.id, ...docSnapshot.data() })
        } else {
          setQuest(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error('Firestore error fetching quest:', err.message)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [questId])

  return { quest, loading, error }
}

export default useQuest

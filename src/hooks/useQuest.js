import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db, isDemoMode } from '../config/firebase'
import { questDetails } from '../data/quests'

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

    // Demo Mode: always use local data, no Firestore calls
    if (isDemoMode) {
      setQuest(questDetails[questId] || null)
      setLoading(false)
      return
    }

    const unsubscribe = onSnapshot(
      doc(db, 'quests', questId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setQuest({ id: docSnapshot.id, ...docSnapshot.data() })
        } else {
          // Fallback to local if doc missing in Firestore
          setQuest(questDetails[questId] || null)
        }
        setLoading(false)
      },
      (err) => {
        console.error('Firestore error fetching quest:', err.message)
        // Fallback on error
        setQuest(questDetails[questId] || null)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [questId])

  return { quest, loading, error }
}

export default useQuest

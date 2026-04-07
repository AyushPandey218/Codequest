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
        let mergedQuest = null;
        const localDetails = questDetails[questId] || {};

        if (docSnapshot.exists()) {
          const remoteData = docSnapshot.data();
          // Merge logic: local data provides defaults for missing remote fields
          mergedQuest = {
            ...localDetails,
            ...remoteData,
            id: docSnapshot.id
          };
        } else {
          // Fallback to local if doc missing in Firestore
          mergedQuest = questId in questDetails ? { ...localDetails, id: questId } : null;
        }

        setQuest(mergedQuest)
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

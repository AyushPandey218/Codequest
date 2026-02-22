import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'
import { questDetails as QUEST_DATA } from '../data/quests'

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

    // Serve from local data map immediately
    const localQuest = QUEST_DATA[questId]
    setQuest(localQuest || null)
    setLoading(false)

    // Then try Firestore
    const unsubscribe = onSnapshot(
      doc(db, 'quests', questId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setQuest({ id: docSnapshot.id, ...docSnapshot.data() })
        }
        setLoading(false)
      },
      (err) => {
        console.warn('Firestore unavailable, using local data:', err.message)
        setError(null)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [questId])

  return { quest, loading, error }
}

export default useQuest

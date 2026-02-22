import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'

import { quests as MOCK_QUESTS } from '../data/quests'

export const useQuestList = () => {
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setQuests(MOCK_QUESTS)
    setLoading(false)

    const q = query(collection(db, 'quests'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const questsData = []
          querySnapshot.forEach((doc) => {
            questsData.push({ id: doc.id, ...doc.data() })
          })
          setQuests(questsData)
        }
        setLoading(false)
      },
      (err) => {
        console.warn('Firestore unavailable, using mock data:', err.message)
        setError(null)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { quests, loading, error }
}

export default useQuestList

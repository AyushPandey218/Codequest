import { useState, useEffect } from 'react'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Hook to fetch all quests from Firestore
 * @returns {Object} { quests, loading, error }
 */
export const useQuestList = () => {
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        setLoading(true)
        const q = query(collection(db, 'quests'), orderBy('xp', 'desc'))
        const querySnapshot = await getDocs(q)
        const questsData = []
        querySnapshot.forEach((doc) => {
          questsData.push({ id: doc.id, ...doc.data() })
        })
        setQuests(questsData)
        setError(null)
      } catch (err) {
        console.error('Firestore error fetching quest list:', err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuests()
  }, [])

  return { quests, loading, error }
}

export default useQuestList

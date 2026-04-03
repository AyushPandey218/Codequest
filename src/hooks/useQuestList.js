import { useState, useEffect } from 'react'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db, isDemoMode } from '../config/firebase'
import { quests as localQuests } from '../data/quests'

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

        // Demo Mode: always use local data, no Firestore calls
        if (isDemoMode) {
          setQuests([...localQuests].sort((a, b) => b.xp - a.xp))
          setLoading(false)
          return
        }

        const q = query(collection(db, 'quests'), orderBy('xp', 'desc'))
        const querySnapshot = await getDocs(q)
        const questsData = []
        querySnapshot.forEach((doc) => {
          questsData.push({ id: doc.id, ...doc.data() })
        })
        
        // Sort by XP
        questsData.sort((a, b) => b.xp - a.xp)
        
        // If Firestore returned nothing, fall back to local
        if (questsData.length === 0) {
          setQuests([...localQuests].sort((a, b) => b.xp - a.xp))
        } else {
          setQuests(questsData)
        }
        setError(null)
      } catch (err) {
        console.error('Firestore error fetching quest list:', err.message)
        // Fallback on error
        setQuests([...localQuests].sort((a, b) => b.xp - a.xp))
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

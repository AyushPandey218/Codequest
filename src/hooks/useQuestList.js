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

        let firestoreQuests = []
        
        // Only fetch from Firestore if not in Demo Mode
        if (!isDemoMode) {
          try {
            const q = query(collection(db, 'quests'), orderBy('xp', 'desc'))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
              firestoreQuests.push({ id: doc.id, ...doc.data() })
            })
          } catch (err) {
            console.error('Firestore error fetching quest list:', err.message)
            // Continue with local data if firestore fails
          }
        }

        // Merge logic: Map for deduplication, Firestore data takes precedence for shared IDs
        const uniqueQuests = new Map()
        
        // Add all local quests first
        localQuests.forEach(q => uniqueQuests.set(q.id, q))
        
        // Override or add Firestore quests
        firestoreQuests.forEach(q => {
          uniqueQuests.set(q.id, {
            ...uniqueQuests.get(q.id),
            ...q
          })
        })

        // Sort by XP (descending)
        const mergedQuests = Array.from(uniqueQuests.values()).sort((a, b) => (b.xp || 0) - (a.xp || 0))
        
        setQuests(mergedQuests)
        setError(null)
      } catch (err) {
        console.error('Unexpected error in useQuestList:', err.message)
        // Ultimate fallback
        setQuests([...localQuests].sort((a, b) => (b.xp || 0) - (a.xp || 0)))
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

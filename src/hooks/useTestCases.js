import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db, isDemoMode } from '../config/firebase'
import { questDetails } from '../data/quests'

/**
 * Hook to fetch quest test cases.
 * - Always caps at a maximum of 3 test cases.
 * - In Demo Mode: uses local quests.js data directly.
 * - In Real Mode: fetches from Firestore, falls back to local quests.js on error or missing doc.
 * @param {string} questId - Quest ID
 * @returns {Object} { testCases, loading, error }
 */
export const useTestCases = (questId) => {
  const [testCases, setTestCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getLocalTestCases = (id) => {
    const quest = questDetails?.[id]
    if (!quest?.testCases) return []
    return quest.testCases.slice(0, 3)
  }

  useEffect(() => {
    if (!questId) {
      setTestCases([])
      setLoading(false)
      return
    }

    setLoading(true)

    // Demo Mode: always use local data, no Firestore calls
    if (isDemoMode) {
      setTestCases(getLocalTestCases(questId))
      setLoading(false)
      return
    }

    // Real Mode: fetch from Firestore, cap at 3, fallback to local
    const unsubscribe = onSnapshot(
      doc(db, 'quests', questId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const questData = docSnapshot.data()
          setTestCases((questData.testCases || []).slice(0, 3))
        } else {
          // No Firestore record — fall back to local quests.js
          setTestCases(getLocalTestCases(questId))
        }
        setLoading(false)
      },
      (err) => {
        console.error('Firestore error fetching test cases:', err.message)
        // On error, fall back to local data so the UI still works
        setTestCases(getLocalTestCases(questId))
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [questId])

  return { testCases, loading, error }
}

export default useTestCases

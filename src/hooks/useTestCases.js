import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Hook to fetch quest test cases from Firestore
 * @param {string} questId - Quest ID
 * @returns {Object} { testCases, loading, error }
 */
export const useTestCases = (questId) => {
  const [testCases, setTestCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!questId) {
      setTestCases([])
      setLoading(false)
      return
    }

    setLoading(true)

    // Fetch from Firestore
    const unsubscribe = onSnapshot(
      doc(db, 'quests', questId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const questData = docSnapshot.data()
          setTestCases(questData.testCases || [])
        } else {
          setTestCases([])
        }
        setLoading(false)
      },
      (err) => {
        console.error('Firestore error fetching test cases:', err.message)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [questId])

  return { testCases, loading, error }
}

export default useTestCases

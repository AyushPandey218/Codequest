import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Hook to fetch leaderboard data from Firestore (users collection)
 * @param {number} limitCount - Number of top users to fetch (default: 50)
 * @param {string} currentUserId - (Optional) Current logged-in user ID to highlight
 * @returns {Object} { leaderboard, loading, error, refresh }
 */
export const useLeaderboard = (limitCount = 50, currentUserId = null) => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const q = query(
        collection(db, 'users'),
        orderBy('xp', 'desc'),
        limit(limitCount)
      )

      const querySnapshot = await getDocs(q)
      const leaderboardData = []

      let index = 0
      querySnapshot.forEach((doc) => {
        const data = doc.data()

        // Filter out the seed/mock users created in migrateData.js
        if (doc.id === 'demo_codequest_com' || doc.id === 'admin_codequest_com' || data.email === 'demo@codequest.com' || data.email === 'admin@codequest.com') {
          return;
        }

        leaderboardData.push({
          id: doc.id,
          ...data,
          xp: Number(data.xp) || 0,
          questsCompleted: Number(data.questsCompleted) || Number(data.completedQuests) || 0,
          rank: index + 1,
          isCurrentUser: currentUserId ? doc.id === currentUserId : false
        })
        index++
      })

      setLeaderboard(leaderboardData)
      setError(null)
    } catch (err) {
      console.error('Firestore error fetching leaderboard:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [limitCount, currentUserId])

  return { leaderboard, loading, error, refresh: fetchLeaderboard }
}

export default useLeaderboard

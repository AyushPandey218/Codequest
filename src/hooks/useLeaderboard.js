import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Hook to fetch leaderboard data from Firestore in real-time with period filtering
 * @param {string} period - 'all', 'today', 'weekly', 'monthly'
 * @param {number} limitCount - Number of top users to fetch
 * @param {string} currentUserId - Current logged-in user ID
 */
export const useLeaderboard = (period = 'all', limitCount = 50, currentUserId = null) => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    
    // Map period to field name
    const periodMap = {
      all: 'xp',
      today: 'xp_today',
      weekly: 'xp_weekly',
      monthly: 'xp_monthly'
    }

    const sortField = periodMap[period] || 'xp'

    const q = query(
      collection(db, 'users'),
      orderBy(sortField, 'desc'),
      limit(limitCount)
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const leaderboardData = []
      let index = 0
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        
        // Use the appropriate XP for display based on period
        const displayXP = Number(data[sortField]) || 0

        leaderboardData.push({
          id: doc.id,
          ...data,
          displayXP, // Field used for the leaderboard value
          xp: Number(data.xp) || 0,
          questsCompleted: Number(data.questsCompleted) || Number(data.completedQuests) || 0,
          rank: index + 1,
          isCurrentUser: currentUserId ? doc.id === currentUserId : false
        })
        index++
      })

      setLeaderboard(leaderboardData)
      setLoading(false)
      setError(null)
    }, (err) => {
      console.error('Firestore error fetching leaderboard:', err.message)
      setError(err.message)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [period, limitCount, currentUserId])

  return { leaderboard, loading, error }
}

export default useLeaderboard

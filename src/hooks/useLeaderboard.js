import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db, isDemoMode } from '../config/firebase'

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
    if (isDemoMode) {
      // Return mock leaderboard for demo mode
      const mockUsers = [
        { id: '1', username: 'top_coder', xp: 5000, level: 15, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', rank: 1 },
        { id: '2', username: 'python_pro', xp: 4200, level: 12, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', rank: 2 },
        { id: '3', username: 'js_ninja', xp: 3800, level: 11, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', rank: 3 },
        { id: '4', username: 'demo_user', xp: 2500, level: 10, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo', rank: 4, isCurrentUser: true },
        { id: '5', username: 'newbie', xp: 100, level: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', rank: 5 }
      ]
      setLeaderboard(mockUsers)
      setLoading(false)
      return
    }

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

    return () => (unsubscribe ? unsubscribe() : null)
  }, [period, limitCount, currentUserId])

  return { leaderboard, loading, error }
}

export default useLeaderboard

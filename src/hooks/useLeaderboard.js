import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'
import { getUserXP, getCompletedQuests } from '../utils/progressStorage'
import { useAuth } from '../context/AuthContext'

// Mock leaderboard data for instant loading
const MOCK_LEADERBOARD = [
  { id: '1', username: 'CodeMaster', avatar: null, xp: 12450, questsCompleted: 45, change: 'up' },
  { id: '2', username: 'PythonPro', avatar: null, xp: 11200, questsCompleted: 42, change: 'same' },
  { id: '3', username: 'JSNinja', avatar: null, xp: 10800, questsCompleted: 40, change: 'down' },
  { id: '4', username: 'AlgoWizard', avatar: null, xp: 9500, questsCompleted: 38, change: 'up' },
  { id: '5', username: 'ReactQueen', avatar: null, xp: 8900, questsCompleted: 35, change: 'up' },
  { id: '6', username: 'DevDynamo', avatar: null, xp: 8200, questsCompleted: 33, change: 'down' },
  { id: '7', username: 'ByteBender', avatar: null, xp: 7800, questsCompleted: 31, change: 'same' },
  { id: '8', username: 'LoopLegend', avatar: null, xp: 7400, questsCompleted: 29, change: 'up' },
  { id: '9', username: 'DataDiva', avatar: null, xp: 7100, questsCompleted: 28, change: 'down' },
  { id: '10', username: 'CodeCrusader', avatar: null, xp: 6800, questsCompleted: 27, change: 'up' },
  { id: '11', username: 'PixelPusher', avatar: null, xp: 6500, questsCompleted: 26, change: 'same' },
  { id: '12', username: 'ScriptSage', avatar: null, xp: 6200, questsCompleted: 25, change: 'up' },
  { id: '13', username: 'FunctionFanatic', avatar: null, xp: 5900, questsCompleted: 24, change: 'down' },
  { id: '14', username: 'ArrayAce', avatar: null, xp: 5600, questsCompleted: 23, change: 'up' },
  { id: '15', username: 'SyntaxStar', avatar: null, xp: 5300, questsCompleted: 22, change: 'same' },
].map((user, index) => ({ ...user, rank: index + 1 }))

/**
 * Hook to fetch leaderboard data from Firestore
 * @param {number} limitCount - Number of top users to fetch (default: 100)
 * @returns {Object} { leaderboard, loading, error }
 */
export const useLeaderboard = (limitCount = 100) => {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Helper to merge and sort
    const processLeaderboard = (data) => {
      const userXP = getUserXP()
      const completed = getCompletedQuests()

      // Remove stale user record if it exists in the incoming data
      let filteredData = data.filter(p => p.id !== user?.uid)

      // Add current user with real XP
      if (user) {
        filteredData.push({
          id: user.uid,
          username: user.username || 'You',
          avatar: user.avatar,
          xp: userXP,
          questsCompleted: completed.size,
          change: 'same',
          isCurrentUser: true
        })
      }

      // Sort by XP descending
      return filteredData
        .sort((a, b) => b.xp - a.xp)
        .slice(0, limitCount)
        .map((player, index) => ({ ...player, rank: index + 1 }))
    }

    // Set initial processed data with mock
    setLeaderboard(processLeaderboard(MOCK_LEADERBOARD))
    setLoading(false)

    // Then try to fetch from Firestore (will replace mock data if available)
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('xp', 'desc'),
      limit(limitCount)
    )

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const leaderboardData = []
          querySnapshot.forEach((doc) => {
            leaderboardData.push({
              id: doc.id,
              ...doc.data()
            })
          })
          setLeaderboard(processLeaderboard(leaderboardData))
        }
        // If empty, keep mock data
        setLoading(false)
      },
      (err) => {
        console.warn('Firestore unavailable, using mock data:', err.message)
        // Keep mock data on error
        setError(null)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [limitCount])

  return { leaderboard, loading, error }
}

export default useLeaderboard

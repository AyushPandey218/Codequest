import { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'
import { useUserData } from '../hooks/useUserData'
import { useUserProgress } from '../hooks/useUserProgress'
import { useSubmissions } from '../hooks/useSubmissions'
import { getProgressSummary } from '../utils/progressStorage'
import { quests } from '../data/quests'

const UserContext = createContext(null)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()

  // Fetch real data from Firestore
  const { userData, loading: userDataLoading, error: userDataError } = useUserData(user?.uid)
  const { progress, loading: progressLoading, error: progressError } = useUserProgress(user?.uid)
  const { submissions, loading: submissionsLoading, error: submissionsError } = useSubmissions(user?.uid)

  // Combine loading states
  const isLoading = userDataLoading || progressLoading || submissionsLoading

  // Combine error states
  const error = userDataError || progressError || submissionsError

  // Calculate user stats from real data (prefer Firestore, fallback to localStorage)
  const localProgress = getProgressSummary()

  const userStats = userData ? {
    totalQuests: userData.totalQuests || 0,
    completedQuests: userData.completedQuests || 0,
    totalXP: userData.xp || 0,
    level: userData.level || 1,
    rank: userData.rank || null,
    streak: userData.streak || 0,
    achievements: userData.achievements || [],
    recentActivity: submissions.length > 0 ? submissions.slice(0, 10).map(sub => ({
      id: sub.id,
      type: 'quest',
      name: sub.questTitle || 'Quest',
      date: sub.timestamp?.toDate?.()?.toLocaleDateString?.() || 'N/A',
      xp: sub.xpEarned || 0,
    })) : localProgress.completedQuests.slice(0, 5).map(id => {
      const q = quests.find(quest => quest.id === id)
      return {
        id,
        type: 'quest',
        name: q?.title || 'Quest',
        date: 'Recently',
        xp: q?.xp || 0
      }
    }),
  } : {
    // Complete local fallback if no Firestore user data
    totalQuests: 15, // total quests in system
    completedQuests: localProgress.completedCount,
    totalXP: localProgress.xp,
    level: localProgress.level,
    streak: localProgress.streak,
    achievements: [],
    recentActivity: localProgress.completedQuests.slice(0, 5).map(id => {
      const q = quests.find(quest => quest.id === id)
      return {
        id,
        type: 'quest',
        name: q?.title || 'Quest',
        date: 'Recently',
        xp: q?.xp || 0
      }
    }),
  }

  const value = {
    userData,
    userProgress: progress,
    userStats,
    submissions,
    isLoading,
    error,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

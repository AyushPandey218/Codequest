import { createContext, useContext, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useUserData } from '../hooks/useUserData'
import { useUserProgress } from '../hooks/useUserProgress'
import { useSubmissions } from '../hooks/useSubmissions'
import { useModuleProgress } from '../hooks/useModuleProgress'
import { useNotification } from './NotificationContext'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../config/firebase'
import { checkAchievements } from '../utils/achievementChecker'
import { achievements } from '../data/achievements'

import { modules } from '../data/modules'
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
  const { user } = useAuth()
  const { showAchievement, createNotification } = useNotification()

  // Fetch real data from Firestore
  const uid = user?.uid || user?.id // Support both Firebase uid and legacy id
  const { userData, loading: userDataLoading, error: userDataError } = useUserData(uid)
  const { progress, loading: progressLoading, error: progressError } = useUserProgress(uid)
  const { submissions, loading: submissionsLoading, error: submissionsError } = useSubmissions(uid)
  const { moduleProgress, loading: moduleLoading, error: moduleError } = useModuleProgress(uid)

  // Combine loading states
  const isLoading = userDataLoading || progressLoading || submissionsLoading || moduleLoading

  // Combine error states
  const error = userDataError || progressError || submissionsError || moduleError

  // Calculate user stats from real Firestore data
  const totalXP = Number(userData?.xp) || 0
  const completedCount = Object.keys(progress || {}).length

  // Calculate completed modules
  const completedModulesCount = modules.filter(module => {
    const prog = moduleProgress?.[module.id]
    if (!prog) return false
    return (prog.completedLessons?.length || 0) >= (module.lessons || 0)
  }).length

  // Calculate granular quest stats
  const completedQuestsList = quests.filter(q => progress?.[q.id]?.completed)
  const expertQuests = completedQuestsList.filter(q => q.difficulty === 'Expert').length
  const webQuests = completedQuestsList.filter(q => q.category === 'Web' || q.category === 'Web Dev').length
  const dataQuests = completedQuestsList.filter(q => q.category === 'Data' || q.category === 'Data Analysis').length
  const algoQuests = completedQuestsList.filter(q => q.category === 'Algorithms' || q.category === 'DSA').length

  // Calculate unique languages used with success
  const successfulSubmissions = submissions.filter(s => s.passedTests === s.totalTests && s.totalTests > 0)
  const languagesUsedByQuest = {}
  successfulSubmissions.forEach(s => {
    if (!languagesUsedByQuest[s.questId]) languagesUsedByQuest[s.questId] = new Set()
    languagesUsedByQuest[s.questId].add(s.language)
  })

  // Total unique languages that have at least one success
  const uniqueLanguagesSet = new Set(successfulSubmissions.map(s => s.language))
  const languagesUsedCount = uniqueLanguagesSet.size

  const userStats = userData ? {
    totalQuests: Number(userData.totalQuests) || 22,
    completedQuests: completedCount,
    completedModules: completedModulesCount,
    expertQuests,
    webQuests,
    dataQuests,
    algoQuests,
    languagesUsed: languagesUsedCount,
    totalXP: totalXP,
    level: Math.max(1, Math.floor(totalXP / 200) + 1), // Derived from XP
    rank: (userData.rank && !Number.isNaN(Number(userData.rank))) ? Number(userData.rank) : null,
    streak: Number(userData.streak) || 0,
    achievements: userData.achievements || [],
    profileCompleted: !!(userData.bio && userData.university && userData.website),
    recentActivity: submissions.map(sub => ({
      id: sub.id,
      type: 'quest',
      name: sub.questTitle || 'Quest',
      date: sub.timestamp?.toDate ? sub.timestamp.toDate().toLocaleDateString() : (sub.timestamp ? new Date(sub.timestamp).toLocaleDateString() : 'N/A'),
      xp: sub.xpEarned || 0,
    })),
  } : {
    totalQuests: 0,
    completedQuests: 0,
    completedModules: 0,
    expertQuests: 0,
    webQuests: 0,
    dataQuests: 0,
    algoQuests: 0,
    languagesUsed: 0,
    totalXP: 0,
    level: 1,
    streak: 0,
    achievements: [],
    profileCompleted: false,
    recentActivity: [],
  }

  // Auto-sync completedQuests to Firestore
  useEffect(() => {
    if (user?.uid && userData && !isLoading && !submissionsLoading) {
      if (userData.completedQuests !== completedCount) {
        updateDoc(doc(db, 'users', user.uid), {
          completedQuests: completedCount
        }).catch(err => console.error('Failed to auto-sync completedQuests:', err));
      }
    }
  }, [user?.uid, userData, completedCount, isLoading, submissionsLoading]);

  // Check achievements on load/update (useful for profile completion sync)
  useEffect(() => {
    if (user?.uid && !isLoading && userStats.profileCompleted) {
      checkAndAwardAchievements(userStats);
    }
  }, [userStats.profileCompleted, isLoading]);

  const checkAndAwardAchievements = async (stats) => {
    if (!user?.uid) return []

    // Get current achievements from user object in context (merged from Firestore)
    const currentAchievements = userStats.achievements || []
    const newAchievements = checkAchievements(stats, currentAchievements)

    if (newAchievements.length > 0) {
      try {
        const userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, {
          achievements: arrayUnion(...newAchievements)
        })

        // Trigger notifications for each new achievement
        newAchievements.forEach(id => {
          showAchievement(id)

          // Also create a persistent notification in Firestore
          const achievement = achievements.find(a => a.id === id)
          if (achievement) {
            createNotification({
              title: 'Achievement Unlocked! 🏆',
              message: `You earned the ${achievement.name} badge: ${achievement.description}`,
              type: 'achievement',
              achievementId: id,
              link: `/app/profile/${user.username}`
            })
          }
        })

        return newAchievements
      } catch (error) {
        console.error('Error awarding achievements:', error)
      }
    }
    return []
  }

  const value = {
    userData,
    userProgress: progress,
    moduleProgress,
    userStats,
    submissions,
    checkAndAwardAchievements,
    isLoading,
    error,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

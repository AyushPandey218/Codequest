import { useState, useEffect } from 'react'
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from '../config/firebase'

export function useAdminStats() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeQuests: 0,
        completionsToday: 0,
        recentActivity: [],
        isLoading: true
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Fetch total users
                const usersSnapshot = await getDocs(collection(db, 'users'))
                const userCount = usersSnapshot.size

                // 2. Fetch active quests
                const questsSnapshot = await getDocs(collection(db, 'quests'))
                const questCount = questsSnapshot.size

                // 3. Fetch recent activity (submissions)
                const activityQuery = query(
                    collection(db, 'submissions'),
                    orderBy('createdAt', 'desc'),
                    limit(5)
                )
                const activitySnapshot = await getDocs(activityQuery)

                let completionsToday = 0
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                const activityData = activitySnapshot.docs.map(doc => {
                    const data = doc.data()
                    const createdAt = data.createdAt?.toDate() || new Date()

                    if (createdAt >= today) {
                        completionsToday++
                    }

                    return {
                        id: doc.id,
                        icon: data.status === 'success' ? 'military_tech' : 'code',
                        text: `Submission by ${data.userId || 'User'} on ${data.questId}`,
                        time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        color: data.status === 'success' ? 'text-green-400' : 'text-blue-400'
                    }
                })

                setStats({
                    totalUsers: userCount,
                    activeQuests: questCount,
                    completionsToday,
                    recentActivity: activityData,
                    isLoading: false
                })
            } catch (error) {
                console.error("Error fetching admin stats:", error)
                setStats(prev => ({ ...prev, isLoading: false }))
            }
        }

        fetchStats()
    }, [])

    return stats
}

import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { quests } from '../data/quests'

export function useAdminAnalytics() {
    const [analytics, setAnalytics] = useState({
        dailyActiveUsers: 0,
        questCompletions: 0,
        newSignups: 0,
        totalCommunityActivity: 0,
        topQuests: [],
        levelDistribution: { l1_10: 0, l11_30: 0, l31_50: 0, l51_plus: 0 },
        engagement: {
            questSuccessRate: 0,
            communityActivePct: 0,
            profileCompletionPct: 0,
            retention7d: 0
        },
        isLoading: true
    })

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const now = new Date()
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                const lastWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000))

                // 1. Fetch Users
                const usersSnapshot = await getDocs(collection(db, 'users'))
                const totalUsers = usersSnapshot.size || 1
                let newSignups = 0
                let completedProfiles = 0
                const levelDist = { l1_10: 0, l11_30: 0, l31_50: 0, l51_plus: 0 }
                
                usersSnapshot.forEach(doc => {
                    const data = doc.data()
                    if (data.createdAt?.toDate) {
                        if (data.createdAt.toDate() >= lastWeek) newSignups++
                    }
                    if (data.bio && data.university) completedProfiles++
                    
                    const lvl = data.level || 1
                    if (lvl <= 10) levelDist.l1_10++
                    else if (lvl <= 30) levelDist.l11_30++
                    else if (lvl <= 50) levelDist.l31_50++
                    else levelDist.l51_plus++
                })

                // 2. Fetch Submissions
                const submissionsSnapshot = await getDocs(collection(db, 'submissions'))
                let questCompletions = 0
                const topQuestsMap = {}
                const uniqueActiveUsersToday = new Set()
                const uniqueUsersWithSubmissions = new Set()

                submissionsSnapshot.forEach(doc => {
                    const data = doc.data()
                    uniqueUsersWithSubmissions.add(data.userId)
                    
                    if (data.createdAt?.toDate) {
                        const submittedAt = data.createdAt.toDate()
                        if (submittedAt >= today) uniqueActiveUsersToday.add(data.userId)
                    }

                    if (data.status === 'success') {
                        questCompletions++
                        const qid = data.questId
                        if (!topQuestsMap[qid]) {
                            const questMeta = quests.find(q => q.id === qid)
                            topQuestsMap[qid] = { 
                                name: questMeta?.title || qid, 
                                completions: 0, 
                                difficulty: questMeta?.difficulty || 'Medium', 
                                totalTimeMs: 0 
                            }
                        }
                        topQuestsMap[qid].completions++
                        if (data.timeSpent) topQuestsMap[qid].totalTimeMs += data.timeSpent
                    }
                })

                // 3. Fetch Community Activity
                const postsSnap = await getDocs(collection(db, 'communityPosts'))
                const repliesSnap = await getDocs(collection(db, 'communityReplies'))
                const totalActivity = postsSnap.size + repliesSnap.size
                
                const communityUsers = new Set()
                postsSnap.forEach(d => communityUsers.add(d.data().authorUid))
                repliesSnap.forEach(d => communityUsers.add(d.data().authorUid))

                // Calculate Top Quests
                const topQuestsArray = Object.values(topQuestsMap)
                    .sort((a, b) => b.completions - a.completions)
                    .slice(0, 5)
                    .map(q => ({
                        ...q,
                        avgTime: q.totalTimeMs > 0 ? `${Math.round(q.totalTimeMs / q.completions)} min` : "N/A"
                    }))

                // Finalize State
                setAnalytics({
                    dailyActiveUsers: uniqueActiveUsersToday.size,
                    questCompletions,
                    newSignups,
                    totalCommunityActivity: totalActivity,
                    topQuests: topQuestsArray,
                    levelDistribution: {
                        l1_10: Math.round((levelDist.l1_10 / totalUsers) * 100),
                        l11_30: Math.round((levelDist.l11_30 / totalUsers) * 100),
                        l31_50: Math.round((levelDist.l31_50 / totalUsers) * 100),
                        l51_plus: Math.round((levelDist.l51_plus / totalUsers) * 100),
                    },
                    engagement: {
                        questSuccessRate: Math.round((questCompletions / (submissionsSnapshot.size || 1)) * 100),
                        communityActivePct: Math.round((communityUsers.size / totalUsers) * 100),
                        profileCompletionPct: Math.round((completedProfiles / totalUsers) * 100),
                        retention7d: Math.round((uniqueUsersWithSubmissions.size / totalUsers) * 100) // Simplified
                    },
                    isLoading: false
                })
            } catch (error) {
                console.error("Error fetching admin analytics:", error)
                setAnalytics(prev => ({ ...prev, isLoading: false }))
            }
        }

        fetchAnalytics()
    }, [])

    return analytics
}

/**
 * Progress Storage Utility
 * Manages XP, levels, and quest completions in localStorage.
 */

const KEYS = {
    COMPLETED_QUESTS: 'cq_completed_quests', // JSON array of quest IDs
    USER_XP: 'cq_user_xp',                  // number
    USER_STREAK: 'cq_user_streak',          // number
    LAST_ACTIVITY_DATE: 'cq_last_date',     // string (YYYY-MM-DD)
    ACTIVITY_HISTORY: 'cq_activity_history'  // JSON object { date: count }
}

// XP required per level (level 1 = 0 XP, level 2 = 200 XP, etc.)
const XP_PER_LEVEL = 200

/** Get all completed quest IDs as a Set */
export const getCompletedQuests = () => {
    try {
        const raw = localStorage.getItem(KEYS.COMPLETED_QUESTS)
        return new Set(raw ? JSON.parse(raw) : [])
    } catch {
        return new Set()
    }
}

/** Check if a specific quest is completed */
export const isQuestCompleted = (questId) => {
    return getCompletedQuests().has(questId)
}

/** Get user's current streak */
export const getUserStreak = () => {
    const raw = localStorage.getItem(KEYS.USER_STREAK)
    return raw ? parseInt(raw, 10) : 0
}

/** Get activity history */
export const getActivityHistory = () => {
    try {
        const raw = localStorage.getItem(KEYS.ACTIVITY_HISTORY)
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

/** Update streak and activity history */
const updateStreakAndActivity = () => {
    const today = new Date().toISOString().split('T')[0]
    const lastDate = localStorage.getItem(KEYS.LAST_ACTIVITY_DATE)
    const currentStreak = getUserStreak()
    const history = getActivityHistory()

    // Update daily count
    history[today] = (history[today] || 0) + 1
    localStorage.setItem(KEYS.ACTIVITY_HISTORY, JSON.stringify(history))

    if (lastDate === today) {
        // Already active today, streak doesn't change
        return
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (lastDate === yesterdayStr) {
        // Active yesterday, increment streak
        localStorage.setItem(KEYS.USER_STREAK, String(currentStreak + 1))
    } else {
        // Gap in activity, reset streak to 1
        localStorage.setItem(KEYS.USER_STREAK, '1')
    }

    localStorage.setItem(KEYS.LAST_ACTIVITY_DATE, today)
}

/** Mark a quest as completed and add XP */
export const markQuestComplete = (questId, xpEarned = 0) => {
    const completed = getCompletedQuests()
    const alreadyDone = completed.has(questId)

    completed.add(questId)
    localStorage.setItem(KEYS.COMPLETED_QUESTS, JSON.stringify([...completed]))

    // Update activity history and streak regardless of whether it was already done
    // (though streak only increments once per day)
    updateStreakAndActivity()

    // Only award XP once per quest
    if (!alreadyDone) {
        const currentXP = getUserXP()
        const newXP = currentXP + xpEarned
        localStorage.setItem(KEYS.USER_XP, String(newXP))
        return { xpBefore: currentXP, xpAfter: newXP, xpEarned, alreadyCompleted: false }
    }

    return { xpBefore: getUserXP(), xpAfter: getUserXP(), xpEarned: 0, alreadyCompleted: true }
}

/** Get user's total XP */
export const getUserXP = () => {
    const raw = localStorage.getItem(KEYS.USER_XP)
    return raw ? parseInt(raw, 10) : 0
}

/** Calculate level from XP */
export const getLevelFromXP = (xp) => {
    return Math.floor(xp / XP_PER_LEVEL) + 1
}

/** Get XP progress within current level (0–1) */
export const getLevelProgress = (xp) => {
    return (xp % XP_PER_LEVEL) / XP_PER_LEVEL
}

/** Get full user progress summary */
export const getProgressSummary = () => {
    const xp = getUserXP()
    const level = getLevelFromXP(xp)
    const completed = getCompletedQuests()
    const streak = getUserStreak()
    const history = getActivityHistory()

    return {
        xp,
        level,
        streak,
        activityHistory: history,
        levelProgress: getLevelProgress(xp),
        xpToNextLevel: XP_PER_LEVEL - (xp % XP_PER_LEVEL),
        completedCount: completed.size,
        completedQuests: [...completed],
    }
}

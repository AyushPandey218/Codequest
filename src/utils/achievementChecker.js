import { achievements } from '../data/achievements'

/**
 * Checks if the user has earned any new achievements
 * 
 * @param {Object} stats - Current user statistics (completedQuests, level, streak, etc.)
 * @param {Array} currentAchievements - List of IDs the user already has
 * @returns {Array} - List of newly earned achievement IDs
 */
export const checkAchievements = (stats, currentAchievements = []) => {
    const newAchievements = []

    achievements.forEach(achievement => {
        // If user already has this achievement, skip it
        if (currentAchievements.includes(achievement.id)) {
            return
        }

        // Check if criteria are met
        try {
            if (achievement.criteria(stats)) {
                newAchievements.push(achievement.id)
            }
        } catch (error) {
            console.error(`Error checking achievement ${achievement.id}:`, error)
        }
    })

    return newAchievements
}

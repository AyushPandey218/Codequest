/**
 * Progress Storage Utility (Utilities Only)
 * Pure functions for level and XP calculations.
 * Data is now stored in Firestore via hooks and AuthContext.
 */

// XP required per level (level 1 = 0 XP, level 2 = 200 XP, etc.)
export const XP_PER_LEVEL = 200

/** Calculate level from XP */
export const getLevelFromXP = (xp) => {
    if (!xp) return 1
    return Math.floor(xp / XP_PER_LEVEL) + 1
}

/** Get XP progress within current level (0–1) */
export const getLevelProgress = (xp) => {
    if (!xp) return 0
    return (xp % XP_PER_LEVEL) / XP_PER_LEVEL
}

/** Get remaining XP to next level */
export const getXPToNextLevel = (xp) => {
    if (!xp) return XP_PER_LEVEL
    return XP_PER_LEVEL - (xp % XP_PER_LEVEL)
}

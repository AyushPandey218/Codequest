/**
 * Progress Storage Utility
 * Tiered XP calculation logic for player levels.
 * 
 * Formula:
 * - Levels 1-10: 100 XP per level
 * - Level 11+: 1,000 XP per level
 */

/** XP required for the current level's span */
export const getXPThresholdForLevel = (level) => {
    return level < 10 ? 100 : 1000;
}

/** Total XP required to reach a specific level */
export const getXPRequiredForLevel = (level) => {
    if (level <= 1) return 0;
    if (level <= 10) return (level - 1) * 100;
    // Level 10 is reached at 900 XP. Level 11 is 1900 (+1000).
    return 900 + (level - 10) * 1000;
}

/** Calculate level from total XP */
export const getLevelFromXP = (xp) => {
    if (!xp || xp < 100) return 1;
    // Tier 1: 0 to 900 XP (Level 1 to 10)
    if (xp < 900) return Math.floor(xp / 100) + 1;
    // Tier 2: 900+ XP (Level 11+)
    return Math.floor((xp - 900) / 1000) + 10;
}

/** Get XP progress within current level (0–1) */
export const getLevelProgress = (xp) => {
    if (!xp) return 0;
    const level = getLevelFromXP(xp);
    const currentBase = getXPRequiredForLevel(level);
    const nextBase = getXPRequiredForLevel(level + 1);
    const diff = nextBase - currentBase;
    return (xp - currentBase) / diff;
}

/** Get remaining XP to next level */
export const getXPToNextLevel = (xp) => {
    if (!xp) return 100;
    const level = getLevelFromXP(xp);
    const nextBase = getXPRequiredForLevel(level + 1);
    return Math.max(0, nextBase - xp);
}

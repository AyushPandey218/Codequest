/**
 * Chess-style ELO rating calculator for CodeClash
 * K-factor of 32 (standard for players under 2400)
 */
const K = 32

/**
 * Calculate the expected score for a player
 * @param {number} myRating
 * @param {number} opponentRating
 * @returns {number} expected score between 0 and 1
 */
const expectedScore = (myRating, opponentRating) => {
    return 1 / (1 + Math.pow(10, (opponentRating - myRating) / 400))
}

/**
 * Calculate the ELO rating change after a match
 * @param {number} myRating - Current player's rating
 * @param {number} opponentRating - Opponent's rating
 * @param {'win'|'draw'|'loss'} outcome - Match result
 * @returns {number} Rating delta (positive or negative, rounded to integer)
 */
export const calculateElo = (myRating, opponentRating, outcome) => {
    const expected = expectedScore(myRating, opponentRating)
    const actual = outcome === 'win' ? 1.0 : outcome === 'draw' ? 0.5 : 0.0
    return Math.round(K * (actual - expected))
}

export default calculateElo

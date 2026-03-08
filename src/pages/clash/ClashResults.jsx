import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'
import { useClash } from '../../hooks/useClash'
import { useQuest } from '../../hooks/useQuest'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../config/firebase'
import { doc, updateDoc, increment } from 'firebase/firestore'
import { getLevelFromXP } from '../../utils/progressStorage'
import { calculateElo } from '../../utils/eloCalculator'

const FIRST_SUBMIT_BONUS = 50  // bonus points for submitting before opponent

const ClashResults = () => {
  const { clashId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { clash, players, loading: clashLoading } = useClash(clashId)
  const { quest, loading: questLoading } = useQuest(clash?.questId)
  const [statsUpdated, setStatsUpdated] = useState(false)

  // -- Identify players --
  const yourPlayer = players.find(p => p.uid === user?.uid)
  const opponent = players.find(p => p.uid !== user?.uid)

  // -- Scoring --
  // Base: testsPassed * 100 (set in useClash.updateScore)
  // Bonus: +50 if you submitted before your opponent
  const yourSubmitMs = yourPlayer?.submittedAt?.toMillis?.() ?? null
  const oppSubmitMs = opponent?.submittedAt?.toMillis?.() ?? null
  const yourSubmittedFirst =
    yourSubmitMs !== null && (oppSubmitMs === null || yourSubmitMs < oppSubmitMs)

  const yourFinalScore = (yourPlayer?.score || 0) + (yourSubmittedFirst ? FIRST_SUBMIT_BONUS : 0)
  const oppFinalScore = (opponent?.score || 0) + (
    oppSubmitMs !== null && (yourSubmitMs === null || oppSubmitMs < yourSubmitMs)
      ? FIRST_SUBMIT_BONUS : 0
  )

  // -- Outcome --
  let outcome // 'win' | 'draw' | 'loss'
  if (yourFinalScore > oppFinalScore) {
    outcome = 'win'
  } else if (yourFinalScore < oppFinalScore) {
    outcome = 'loss'
  } else {
    outcome = 'draw'
  }
  const isWinner = outcome === 'win'
  const isDraw = outcome === 'draw'

  // -- ELO calculation --
  const myRating = user?.rating ?? 1000
  const oppRating = yourPlayer && opponent ? (opponent.rating ?? 1000) : 1000
  const ratingDelta = yourPlayer && opponent
    ? calculateElo(myRating, oppRating, outcome)
    : 0

  // -- XP calculation --
  const xpEarned = isWinner
    ? (yourPlayer?.testsPassed || 0) * 20 + 120
    : isDraw
      ? (yourPlayer?.testsPassed || 0) * 10 + 30
      : (yourPlayer?.testsPassed || 0) * 5 + 20

  const results = {
    isWinner,
    isDraw,
    outcome,
    yourScore: yourFinalScore,
    xpEarned,
    ratingDelta,
    firstSubmitBonus: yourSubmittedFirst ? FIRST_SUBMIT_BONUS : 0,
    difficulty: quest?.difficulty || clash?.difficulty || 'Medium',
  }

  // -- Persist stats to Firestore (only once) --
  useEffect(() => {
    if (user && yourPlayer && !statsUpdated && !clashLoading && !questLoading) {
      const updateStats = async () => {
        try {
          const userRef = doc(db, 'users', user.uid)
          const newXP = (user.xp || 0) + results.xpEarned
          const newLevel = getLevelFromXP(newXP)

          await updateDoc(userRef, {
            xp: increment(results.xpEarned),
            rating: increment(results.ratingDelta),
            level: newLevel,
            clashesTotal: increment(1),
            clashesWon: increment(isWinner ? 1 : 0),
          })
          setStatsUpdated(true)
        } catch (err) {
          console.error('Error updating stats:', err)
        }
      }
      updateStats()
    }
  }, [user, yourPlayer, statsUpdated, clashLoading, questLoading])

  const achievements = [
    { title: 'First Place', icon: 'emoji_events', color: 'text-yellow-500', earned: isWinner },
    { title: 'Perfect Score', icon: 'stars', color: 'text-purple-500', earned: yourPlayer?.testsPassed === (quest?.testCases?.length || 0) && (quest?.testCases?.length || 0) > 0 },
    { title: 'Speed Demon', icon: 'bolt', color: 'text-orange-500', earned: isWinner && yourSubmittedFirst },
    { title: 'Code Master', icon: 'verified', color: 'text-blue-500', earned: (user?.level || 0) > 5 },
  ]

  const solution = quest?.solution?.JavaScript ||
    `// Solution code for ${quest?.title} is being processed.`

  if (clashLoading || questLoading) {
    return (
      <div className="h-screen w-full bg-[#0a0a1a] flex flex-col items-center justify-center gap-6">
        <div className="size-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] animate-pulse">Calculating Results...</p>
      </div>
    )
  }

  // -- Banner styling based on outcome --
  const bannerGradient = isWinner
    ? 'bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20'
    : isDraw
      ? 'bg-gradient-to-br from-blue-500/15 via-purple-500/15 to-blue-500/15'
      : 'bg-gradient-to-br from-slate-500/10 to-slate-800/20'
  const bannerIcon = isWinner ? 'emoji_events' : isDraw ? 'handshake' : 'sports_score'
  const bannerIconBg = isWinner
    ? 'bg-gradient-to-br from-yellow-400 to-orange-600 shadow-[0_0_50px_rgba(234,179,8,0.3)]'
    : isDraw
      ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_50px_rgba(99,102,241,0.3)]'
      : 'bg-slate-700'
  const bannerTitle = isWinner ? 'VICTORY!' : isDraw ? 'DRAW!' : 'GG WELL PLAYED'
  const bannerSub = isWinner
    ? 'You dominated the arena today'
    : isDraw
      ? 'Perfectly matched — honours even'
      : 'You showed great tactical skill'

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-in p-6">
      {/* Victory / Draw / Defeat Banner */}
      <Card className={`overflow-hidden relative border-none shadow-2xl ${bannerGradient}`}>
        <div className="relative p-8 md:p-16 text-center">
          <div className={`inline-flex items-center justify-center size-32 rounded-full mb-8 ${bannerIconBg} ${isWinner ? 'animate-bounce' : ''}`}>
            <span className="material-symbols-outlined text-white text-6xl">{bannerIcon}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
            {bannerTitle}
          </h1>
          <p className="text-xl text-white/60 mb-10 font-medium">{bannerSub}</p>

          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
            {/* Final score */}
            <div className="text-center group">
              <p className="text-5xl font-black text-white group-hover:scale-110 transition-transform font-mono">
                {results.yourScore}
              </p>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">Final Score</p>
              {results.firstSubmitBonus > 0 && (
                <p className="text-[10px] font-bold text-orange-400 mt-1 uppercase tracking-widest">
                  +{results.firstSubmitBonus} First Submit Bonus
                </p>
              )}
            </div>
            <div className="w-[1px] h-12 bg-white/10" />
            {/* XP */}
            <div className="text-center group">
              <p className="text-5xl font-black text-yellow-400 group-hover:scale-110 transition-transform font-mono">
                +{results.xpEarned}
              </p>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">XP Gained</p>
            </div>
            <div className="w-[1px] h-12 bg-white/10" />
            {/* ELO delta */}
            <div className="text-center group">
              <p className={`text-5xl font-black group-hover:scale-110 transition-transform font-mono ${results.ratingDelta > 0 ? 'text-green-400' : results.ratingDelta < 0 ? 'text-red-400' : 'text-white/40'
                }`}>
                {results.ratingDelta > 0 ? '+' : ''}{results.ratingDelta}
              </p>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">ELO Rating</p>
              <p className="text-[10px] font-bold text-white/20 mt-1">
                {myRating} → {myRating + results.ratingDelta}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Rankings Card */}
          <Card className="bg-[#14142b]/60 border-white/5 backdrop-blur-xl p-8">
            <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">leaderboard</span>
              Arena Standings
            </h2>
            <div className="space-y-4">
              {/* Sort by final score (with bonus applied) for display */}
              {players
                .map(p => ({
                  ...p,
                  finalScore: (p.score || 0) + (
                    p.uid === user?.uid ? (yourSubmittedFirst ? FIRST_SUBMIT_BONUS : 0)
                      : (oppSubmitMs !== null && (yourSubmitMs === null || oppSubmitMs < yourSubmitMs) ? FIRST_SUBMIT_BONUS : 0)
                  )
                }))
                .sort((a, b) => b.finalScore - a.finalScore)
                .map((player, idx) => (
                  <div
                    key={player.uid}
                    className={`p-6 rounded-3xl border transition-all flex items-center gap-6 ${player.isYou ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5'}`}
                  >
                    <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-xl ${idx === 0 ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20' : 'bg-white/10 text-white/40'}`}>
                      {isDraw ? '=' : idx + 1}
                    </div>
                    <Avatar src={player.avatar} size="lg" className={idx === 0 && !isDraw ? 'ring-2 ring-yellow-500' : ''} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-lg text-white">{player.username}</h3>
                        {player.isYou && <Badge variant="primary">YOU</Badge>}
                      </div>
                      <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Level {player.level || 1} Pilot · Rating {player.rating ?? 1000}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-white font-mono">{player.finalScore}</p>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-tighter">{player.testsPassed || 0} Tests Passed</p>
                      {player.submittedAt && (
                        <p className="text-[10px] font-bold text-orange-400 mt-0.5">⚡ Submitted</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* Solution Tab */}
          <Card className="bg-[#14142b]/60 border-white/5 backdrop-blur-xl p-0 overflow-hidden">
            <div className="flex bg-[#0f0f1d]/50 p-1 border-b border-white/5">
              <button className="px-8 py-4 text-xs font-black uppercase tracking-widest text-primary bg-[#1a1a2e] rounded-t-2xl">Optimal Solution</button>
            </div>
            <div className="p-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#0a0a1a] rounded-2xl border border-white/5 p-8 font-mono text-sm leading-relaxed overflow-x-auto text-blue-400">
                  <pre>{solution}</pre>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          {/* Stats Card */}
          <Card className="bg-[#14142b]/60 border-white/5 backdrop-blur-xl p-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8">Match Statistics</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-3 text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/40">Test Accuracy</span>
                  <span className="text-white">{((yourPlayer?.testsPassed || 0) / (quest?.testCases?.length || 5) * 100).toFixed(0)}%</span>
                </div>
                <ProgressBar value={(yourPlayer?.testsPassed || 0) / (quest?.testCases?.length || 5) * 100} variant="primary" className="h-2 rounded-full" />
              </div>
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-white/40">Outcome</span>
                  <span className={`text-xs font-black uppercase ${isWinner ? 'text-yellow-400' : isDraw ? 'text-blue-400' : 'text-white'}`}>
                    {isWinner ? 'Winner 🏆' : isDraw ? 'Draw 🤝' : 'Runner Up'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-white/40">Difficulty</span>
                  <span className="text-xs font-black text-primary uppercase">{results.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-white/40">First Submit</span>
                  <span className={`text-xs font-black uppercase ${yourSubmittedFirst ? 'text-orange-400' : 'text-white/40'}`}>
                    {yourSubmittedFirst ? '⚡ You' : oppSubmitMs ? 'Opponent' : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-white/40">Rating Before</span>
                  <span className="text-xs font-black text-white">{myRating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-white/40">Rating After</span>
                  <span className={`text-xs font-black ${results.ratingDelta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {myRating + results.ratingDelta} ({results.ratingDelta > 0 ? '+' : ''}{results.ratingDelta})
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="bg-[#14142b]/60 border-white/5 backdrop-blur-xl p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Achievements</h3>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((ach, i) => (
                <div key={i} className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${ach.earned ? 'bg-white/5 border-white/10' : 'bg-black/20 border-white/5 opacity-40'}`}>
                  <span className={`material-symbols-outlined text-2xl ${ach.earned ? ach.color : 'text-white/20'}`}>{ach.icon}</span>
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-wide leading-tight">{ach.title}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            <Button onClick={() => navigate('/app/clash')} fullWidth variant="primary" size="lg" className="h-16 font-black uppercase tracking-widest shadow-xl shadow-primary/20">Rematch</Button>
            <Button onClick={() => navigate('/app/dashboard')} fullWidth variant="outline" size="lg" className="h-16 border-white/10 text-white/60 hover:text-white font-black uppercase tracking-widest">Command Center</Button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ClashResults

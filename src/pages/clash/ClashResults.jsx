import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
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

const ClashResults = () => {
  const { clashId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { clash, players, loading: clashLoading } = useClash(clashId)
  const { quest, loading: questLoading } = useQuest(clash?.questId)
  const [statsUpdated, setStatsUpdated] = useState(false)

  // Determine winner and calculate stats
  const yourPlayer = players.find(p => p.uid === user?.uid)
  const opponent = players.find(p => p.uid !== user?.uid)

  // Winner logic: Most tests passed. If equal, whoever updated last (or first, depending on logic, let's say whoever finished first)
  const isWinner = yourPlayer && opponent ?
    (yourPlayer.testsPassed > (opponent.testsPassed || 0)) ||
    (yourPlayer.testsPassed === (opponent.testsPassed || 0) && (yourPlayer.lastUpdate?.toMillis() < opponent.lastUpdate?.toMillis()))
    : (yourPlayer?.testsPassed === (quest?.testCases?.length || 5))

  const results = {
    isWinner,
    yourRank: isWinner ? 1 : 2,
    yourScore: yourPlayer?.score || 0,
    xpEarned: (yourPlayer?.testsPassed || 0) * 20 + (isWinner ? 100 : 20),
    ratingChange: isWinner ? 25 : -15,
    matchDuration: 'Completed',
    difficulty: quest?.difficulty || clash?.difficulty || 'Medium',
  }

  // Update user stats in Firestore (only once)
  useEffect(() => {
    if (user && yourPlayer && !statsUpdated && !clashLoading && !questLoading) {
      const updateStats = async () => {
        try {
          const userRef = doc(db, 'users', user.uid)
          const newXP = (user.xp || 0) + results.xpEarned
          const newLevel = getLevelFromXP(newXP)

          await updateDoc(userRef, {
            xp: increment(results.xpEarned),
            rating: increment(results.ratingChange),
            level: newLevel,
            clashesTotal: increment(1),
            clashesWon: increment(isWinner ? 1 : 0)
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
    { title: 'Perfect Score', icon: 'stars', color: 'text-purple-500', earned: yourPlayer?.testsPassed === quest?.testCases?.length },
    { title: 'Speed Demon', icon: 'bolt', color: 'text-orange-500', earned: isWinner && clash?.difficulty === 'hard' },
    { title: 'Code Master', icon: 'verified', color: 'text-blue-500', earned: user?.level > 5 },
  ]

  const solution = quest?.solution?.JavaScript ||
    `// Solution code for ${quest?.title} is being processed.`;

  if (clashLoading || questLoading) {
    return (
      <div className="h-screen w-full bg-[#0a0a1a] flex flex-col items-center justify-center gap-6">
        <div className="size-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] animate-pulse">Calculating Results...</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-in p-6">
      {/* Victory/Defeat Banner */}
      <Card className={`overflow-hidden relative border-none shadow-2xl ${isWinner ? 'bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20' : 'bg-gradient-to-br from-slate-500/10 to-slate-800/20'}`}>
        <div className="relative p-8 md:p-16 text-center">
          <div className={`inline-flex items-center justify-center size-32 rounded-full mb-8 ${isWinner ? 'bg-gradient-to-br from-yellow-400 to-orange-600 shadow-[0_0_50px_rgba(234,179,8,0.3)]' : 'bg-slate-700'} animate-bounce`}>
            <span className="material-symbols-outlined text-white text-6xl">{isWinner ? 'emoji_events' : 'sports_score'}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
            {isWinner ? 'VICTORY!' : 'GG WELL PLAYED'}
          </h1>
          <p className="text-xl text-white/60 mb-10 font-medium">
            {isWinner ? 'You dominated the arena today' : 'You showed great tactical skill'}
          </p>

          <div className="flex items-center justify-center gap-12 flex-wrap">
            <div className="text-center group">
              <p className="text-5xl font-black text-white group-hover:scale-110 transition-transform font-mono">
                {results.yourScore}
              </p>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">Final Score</p>
            </div>
            <div className="w-[1px] h-12 bg-white/10" />
            <div className="text-center group">
              <p className="text-5xl font-black text-yellow-400 group-hover:scale-110 transition-transform font-mono">
                +{results.xpEarned}
              </p>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">XP Gained</p>
            </div>
            <div className="w-[1px] h-12 bg-white/10" />
            <div className="text-center group">
              <p className={`text-5xl font-black group-hover:scale-110 transition-transform font-mono ${results.ratingChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {results.ratingChange >= 0 ? '+' : ''}{results.ratingChange}
              </p>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">Rating</p>
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
              {players.map((player, idx) => (
                <div
                  key={player.uid}
                  className={`p-6 rounded-3xl border transition-all flex items-center gap-6 ${player.isYou ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5'}`}
                >
                  <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-xl ${idx === 0 ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20' : 'bg-white/10 text-white/40'}`}>
                    {idx + 1}
                  </div>
                  <Avatar src={player.avatar} size="lg" className={idx === 0 ? 'ring-2 ring-yellow-500' : ''} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-lg text-white">{player.username}</h3>
                      {player.isYou && <Badge variant="primary">YOU</Badge>}
                    </div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Level {player.level || 1} Pilot</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white font-mono">{player.score || 0}</p>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-tighter">{player.testsPassed || 0} Tests Passed</p>
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
                  <span className="text-white/40">Accuracy</span>
                  <span className="text-white">{((yourPlayer?.testsPassed || 0) / (quest?.testCases?.length || 5) * 100).toFixed(0)}%</span>
                </div>
                <ProgressBar value={(yourPlayer?.testsPassed || 0) / (quest?.testCases?.length || 5) * 100} variant="primary" className="h-2 rounded-full" />
              </div>
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-white/40">Status</span>
                  <span className="text-xs font-black text-white uppercase">{results.isWinner ? 'Winner' : 'Runner Up'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-white/40">Difficulty</span>
                  <span className="text-xs font-black text-primary uppercase">{results.difficulty}</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            <Button onClick={() => navigate('/app/clash')} fullWidth variant="primary" size="lg" className="h-16 font-black uppercase tracking-widest shadow-xl shadow-primary/20">Rematch pilots</Button>
            <Button onClick={() => navigate('/app/dashboard')} fullWidth variant="outline" size="lg" className="h-16 border-white/10 text-white/60 hover:text-white font-black uppercase tracking-widest">Command Center</Button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ClashResults

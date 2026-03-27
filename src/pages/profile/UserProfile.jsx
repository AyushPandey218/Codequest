import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'
import { getLevelProgress } from '../../utils/progressStorage'
import { quests } from '../../data/quests'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Button from '../../components/common/Button'
import { achievements as allAchievements } from '../../data/achievements'
import { useLeaderboard } from '../../hooks/useLeaderboard'

/**
 * Simple SVG Line Chart for ELO History
 */
const EloChart = ({ data }) => {
  if (!data || data.length < 2) {
    return (
      <div className="h-24 flex items-center justify-center text-slate-500 text-xs italic">
        Not enough match history to show rating trend.
      </div>
    )
  }

  const height = 100
  const width = 300
  const padding = 10

  const minRating = Math.min(...data.map(d => d.rating))
  const maxRating = Math.max(...data.map(d => d.rating))
  const range = maxRating - minRating || 100

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding
    const y = height - ((d.rating - minRating) / range) * (height - padding * 2) - padding
    return { x, y }
  })

  const linePath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`

  return (
    <div className="relative h-24 w-full group">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#chartGradient)" />
        <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#4f46e5" className="opacity-0 group-hover:opacity-100 transition-opacity" />
        ))}
      </svg>
    </div>
  )
}

import { useUserData } from '../../hooks/useUserData'
import { useSubmissions } from '../../hooks/useSubmissions'
import { useUserByUsername } from '../../hooks/useUserByUsername'

const UserProfile = () => {
  const navigate = useNavigate()
  const { userId } = useParams()
  const { user: currentUser } = useAuth()
  
  // 1. Determine whose profile we're looking at
  const isOwnProfile = !userId || userId === currentUser?.username

  // 2. Get global leaderboard to find rank and UID (if we only have username)
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard('all', 100)
  
  // 3. Resolve the target UID
  const leaderboardUser = leaderboard.find(l => l.username === userId)
  const { uid: resolvedUid, loading: resolvingUid } = useUserByUsername(isOwnProfile ? null : userId)
  
  const profileUserId = isOwnProfile 
    ? currentUser?.uid 
    : (leaderboardUser?.id || resolvedUid)

  // 4. Fetch the target user's specific data
  const { userData: targetUserData, loading: userLoading } = useUserData(profileUserId)
  const { submissions: targetSubmissions, loading: subLoading } = useSubmissions(profileUserId)
  
  const loading = leaderboardLoading || userLoading || subLoading || resolvingUid
  const [activeHistoryTab, setActiveHistoryTab] = useState('All')

  // Real rank calculation
  const userInLeaderboard = leaderboard.find(l => l.id === profileUserId)
  const realRank = userInLeaderboard?.rank || '100+'
  const percentile = typeof realRank === 'number' ? Math.max(1, 100 - realRank) : 50

  // 12-day Activity Chart Data
  const recent12Days = (() => {
    if (!targetSubmissions || !targetSubmissions.length) return Array(12).fill(0)
    const result = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const count = targetSubmissions.filter(s => {
        if (!s.timestamp) return false
        const sDate = s.timestamp?.toDate ? s.timestamp.toDate() : new Date(s.timestamp)
        return sDate.toISOString().split('T')[0] === dateStr
      }).length
      result.push(count)
    }
    return result
  })()

  // Profile data mapping - uses targetUserData and targetSubmissions
  const profile = {
    username: targetUserData?.username || userId || 'User',
    handle: `@${(targetUserData?.username || userId)?.toLowerCase().replace(/\s/g, '_')}_dev`,
    avatar: targetUserData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
    bio: targetUserData?.bio || (isOwnProfile ? 'No bio yet' : 'Logic Architect | Building the future 🚀'),
    location: targetUserData?.university || targetUserData?.location || 'Global',
    joinDate: targetUserData?.createdAt?.toDate 
      ? `Joined ${targetUserData.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` 
      : 'Joined Recently',
    github: targetUserData?.website?.replace('https://', '') || (targetUserData?.username ? `github.com/${targetUserData.username.toLowerCase()}` : ''),
    level: Math.max(1, Math.floor((targetUserData?.xp || 0) / 200) + 1),
    xp: Number(targetUserData?.xp) || 0,
    totalXPNeeded: (Math.max(1, Math.floor((targetUserData?.xp || 0) / 200) + 1)) * 200,
    streak: Number(targetUserData?.streak) || 0,
    completedCount: Number(targetUserData?.completedQuests) || 0,
    badges: targetUserData?.achievements?.length || 0,
    codingHours: (Number(targetUserData?.completedQuests) || 0) * 2 + 5,
    globalRank: realRank,
    percentile: percentile,
    rating: Number(targetUserData?.rating) || 1200,
    ratingHistory: targetUserData?.ratingHistory || [],
    languageStats: targetUserData?.languageStats || {},
    winRate: (targetUserData?.clashesTotal > 0)
      ? ((targetUserData.clashesWon / targetUserData.clashesTotal) * 100).toFixed(1)
      : '0.0'
  }

  // Get quest history
  const historyQuests = quests
    .filter(q => targetUserData?.completedQuestsList?.includes(q.id) || false) // We should probably have a better way to track this
    .map(q => ({
      ...q,
      date: 'N/A',
      score: '100%',
      status: 'SUCCESS'
    }))

  // Get real earned achievements data
  const earnedAchievements = (targetUserData?.achievements || [])
    .map(id => allAchievements.find(a => a.id === id))
    .filter(Boolean)

  // Recent Badges section update
  const recentBadges = earnedAchievements.slice(-3).reverse()
  const filteredHistory = historyQuests.filter(q => {
    if (activeHistoryTab === 'Completed') return true // All in this list are completed
    return true
  })

  return (
    <div className="max-w-[1400px] mx-auto p-4 lg:p-8 min-h-screen bg-background-dark text-white selection:bg-primary/30 space-y-8">
      
      {/* Back Button / Breadcrumb (Shared public view only) */}
      {!isOwnProfile && (
        <div className="flex items-center gap-4 animate-fade-in">
          <button 
            onClick={() => navigate(-1)} 
            className="group p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all hover:scale-110 active:scale-90 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-lg">west</span>
          </button>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Returning to the Climb</p>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter">Legends Archive</h1>
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${isOwnProfile ? 'pt-4' : ''}`}>

        {/* --- SIDEBAR (Left Column) --- */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-panel-dark border-white/5 p-6 flex flex-col items-center relative overflow-hidden group">
            {/* Settings Icon (Top Right) */}
            <button className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>

            {/* Avatar */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all"></div>
              <Avatar
                src={profile.avatar}
                name={profile.username}
                size="xl"
                online={true}
                className="relative z-10 ring-2 ring-primary/50"
              />
            </div>

            {/* User Details */}
            <div className="text-center w-full space-y-1 mb-6">
              <h2 className="text-2xl font-bold">{profile.username}</h2>
              <p className="text-primary text-sm font-medium">{profile.handle}</p>
            </div>

            {/* Bio */}
            <p className="text-slate-400 text-sm text-center px-2 mb-8 leading-relaxed">
              {profile.bio}
            </p>

            {/* Action Buttons - Only show on own profile */}
            {isOwnProfile && (
              <div className="flex gap-2 w-full mb-8">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 gap-2 py-2.5"
                  onClick={() => navigate('/app/profile/edit')}
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit Profile
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-[#282839] border-white/5 hover:bg-[#323267] size-10 flex items-center justify-center p-0"
                  onClick={() => navigate('/app/profile/edit')}
                >
                  <span className="material-symbols-outlined text-lg">settings</span>
                </Button>
                <Button variant="secondary" size="sm" className="bg-[#282839] border-white/5 hover:bg-[#323267] size-10 flex items-center justify-center p-0">
                  <span className="material-symbols-outlined text-lg">share</span>
                </Button>
              </div>
            )}

            {/* Meta Info List */}
            <div className="w-full space-y-3 pt-6 border-t border-white/5">
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <span className="material-symbols-outlined text-lg">location_on</span>
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <span className="material-symbols-outlined text-lg">calendar_today</span>
                <span>{profile.joinDate}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <span className="material-symbols-outlined text-lg">link</span>
                <a href={`https://${profile.github}`} className="hover:text-primary transition-colors truncate">{profile.github}</a>
              </div>
            </div>
          </Card>

          {/* Global Rank Card */}
          <Card className="bg-[#12122a] border-white/5 p-6 overflow-hidden relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-yellow-500">analytics</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Global Rank</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-4xl font-black text-white">#{profile.globalRank}</h3>
              <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">arrow_upward</span>
                Top {100 - Math.round(profile.percentile)}%
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              You're doing better than {Math.round(profile.percentile)}% of learners!
            </p>

            {/* Decorative Chart Background */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-20"></div>
          </Card>
        </div>

        {/* --- MAIN CONTENT (Right Columns) --- */}
        <div className="lg:col-span-9 space-y-6">

          {/* Level Progress Header */}
          <Card className="bg-[#12122a] border-white/5 p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div className="space-y-1">
                <h3 className="text-3xl font-bold">Level {profile.level}</h3>
                <p className="text-primary font-semibold tracking-wide">{profile.levelTitle}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">{profile.xp.toLocaleString()}</span>
                <span className="text-slate-500 font-medium"> / {profile.totalXPNeeded.toLocaleString()} XP</span>
              </div>
            </div>

            {/* Sleek Progress Bar */}
            <div className="relative h-3 bg-white/5 rounded-full overflow-hidden mb-2">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-purple-500 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${(getLevelProgress(profile.xp) * 100) || 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-tighter text-slate-500 font-bold">
              <span>Current Level</span>
              <span>Next Level</span>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Streak', value: `${profile.streak} Days`, icon: 'local_fire_department', color: 'text-orange-500', desc: 'Days active' },
              { label: 'Quests', value: profile.completedCount, icon: 'check_circle', color: 'text-blue-500', desc: 'Completed' },
              { label: 'Rating', value: profile.rating, icon: 'military_tech', color: 'text-purple-500', desc: 'ELO Rating' },
              { label: 'Win Rate', value: `${profile.winRate}%`, icon: 'trending_up', color: 'text-green-500', desc: 'Clash Success' },
            ].map((stat, i) => (
              <Card key={i} className="bg-[#12122a] border-white/5 p-5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`material-symbols-outlined ${stat.color} text-xl`}>{stat.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</span>
                </div>
                <h4 className="text-2xl font-bold mb-0.5">{stat.value}</h4>
                <p className="text-[10px] text-slate-600 font-bold uppercase">{stat.desc}</p>
              </Card>
            ))}
          </div>

          {/* Middle Row (Badges + Activity) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Badges */}
            <Card className="bg-[#12122a] border-white/5 p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold">Recent Badges</h3>
                <button className="text-xs text-primary font-bold hover:underline">View All</button>
              </div>
              <div className="flex justify-around items-center gap-4 flex-wrap">
                {recentBadges.length > 0 ? recentBadges.map((badge, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 group">
                    <div className={`size-16 rounded-full ${badge.bgColor || 'bg-primary/10'} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
                      <span className={`material-symbols-outlined text-3xl ${badge.color || 'text-primary'}`}>{badge.icon}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase text-center max-w-[80px]">{badge.name}</span>
                  </div>
                )) : (
                  <div className="text-slate-500 text-xs italic">No badges earned yet</div>
                )}
              </div>
            </Card>

            {/* ELO History (Line Chart) */}
            <Card className="bg-[#12122a] border-white/5 p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold">Rating Progress</h3>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary"></div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ELO Rating</span>
                </div>
              </div>

              <EloChart data={profile.ratingHistory} />

              <p className="text-[11px] text-slate-500 font-medium text-center italic mt-4">
                Global rating over your last {profile.ratingHistory.length} matches.
              </p>
            </Card>
          </div>

          {/* Language Stack Section */}
          <Card className="bg-[#12122a] border-white/5 p-6">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-500 text-xl">terminal</span>
              Language Proficiency
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(profile.languageStats).length > 0 ? Object.entries(profile.languageStats).map(([lang, count]) => (
                <div key={lang} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-300">{lang}</span>
                    <span className="text-slate-500 font-medium">{count} matches</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${Math.min(100, (count / (targetUserData?.clashesTotal || 1)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 text-center py-4 text-slate-500 text-sm italic">
                  No match history yet. Start a Code Clash to see your language stats!
                </div>
              )}
            </div>
          </Card>

          {/* Achievements Gallery */}
          <Card className="bg-[#12122a] border-white/5 p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-500">military_tech</span>
                Achievements Gallery
              </h3>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {earnedAchievements.length} / {allAchievements.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {allAchievements.map((achievement, i) => {
                const isEarned = targetUserData?.achievements?.includes(achievement.id)
                return (
                  <div key={i} className={`flex flex-col items-center gap-3 group ${!isEarned ? 'opacity-30 grayscale' : ''}`}>
                    <div className={`size-16 rounded-2xl ${isEarned ? achievement.bgColor : 'bg-white/5'} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-all duration-300 relative`}>
                      <span className={`material-symbols-outlined text-3xl ${isEarned ? achievement.color : 'text-slate-500'}`}>
                        {achievement.icon}
                      </span>
                      {isEarned && (
                        <div className="absolute -top-1 -right-1 size-4 bg-green-500 rounded-full border-2 border-[#12122a] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[8px] text-white font-bold">check</span>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`text-[10px] font-bold uppercase tracking-tight ${isEarned ? 'text-white' : 'text-slate-500'}`}>
                        {achievement.name}
                      </p>
                      {isEarned && (
                        <p className="text-[8px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-2">
                          {achievement.description}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Quest History Table */}
          <Card className="bg-[#12122a] border-white/5 overflow-hidden">
            <div className="p-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-xl">Quest History</h3>
              <div className="flex p-1 bg-[#1d1d35] rounded-xl self-start">
                {['All', 'Completed', 'In Progress'].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveHistoryTab(t)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeHistoryTab === t ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-600 uppercase tracking-widest border-b border-white/5">
                    <th className="px-6 py-4">Quest Name</th>
                    <th className="px-6 py-4">Difficulty</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredHistory.length > 0 ? filteredHistory.map((quest, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-[#1d1d35] flex items-center justify-center text-xl border border-white/5 group-hover:border-primary/30 transition-colors">
                            {quest.icon}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white mb-0.5">{quest.title}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{quest.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={quest.difficulty === 'Easy' ? 'success' : quest.difficulty === 'Medium' ? 'warning' : 'danger'}
                          size="sm"
                          className="font-bold uppercase tracking-tighter"
                        >
                          {quest.difficulty}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-400">
                        {quest.date}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-white">
                        {quest.score}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-green-400 text-xs font-black italic tracking-tighter">
                          <span className="material-symbols-outlined text-sm">done_all</span>
                          {quest.status}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-20">history</span>
                        <p className="text-sm">No activity recorded for this period.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default UserProfile

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getProgressSummary } from '../../utils/progressStorage'
import { quests } from '../../data/quests'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Button from '../../components/common/Button'

/**
 * User Profile Page - Rebuilt to match the premium dark theme design
 * Features Sidebar info and Dashboard-style stats
 */
const UserProfile = () => {
  const navigate = useNavigate()
  const { userId } = useParams()
  const { user: currentUser } = useAuth()

  // Get real progress data from storage
  const [progress, setProgress] = useState(() => getProgressSummary())
  const [activeHistoryTab, setActiveHistoryTab] = useState('All')

  // Determine if viewing own profile
  const isOwnProfile = !userId || userId === currentUser?.username

  // Profile data mapping - mix of real and "realistic" mock for cosmetic stats
  const profile = {
    username: isOwnProfile ? (currentUser?.username || 'User') : userId,
    handle: `@${(isOwnProfile ? currentUser?.username : userId)?.toLowerCase().replace(/\s/g, '_')}_dev`,
    avatar: isOwnProfile ? currentUser?.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
    bio: 'CS Student | Coding Enthusiast | Building the future one line at a time 🚀',
    location: 'San Francisco, CA',
    joinDate: 'Joined September 2024',
    github: `github.com/${(isOwnProfile ? currentUser?.username : userId)?.toLowerCase()}`,
    level: progress.level,
    xp: progress.xp,
    totalXPNeeded: (progress.level) * 200 + 200, // Based on XP_PER_LEVEL = 200
    levelTitle: progress.level > 20 ? 'Logic Legend' : progress.level > 10 ? 'Algorithm Architect' : 'Code Initiate',
    streak: progress.streak,
    completedCount: progress.completedCount,
    badges: Math.floor(progress.completedCount / 2) + 1,
    codingHours: progress.completedCount * 2 + 5,
    globalRank: 42 + (100 - progress.level),
    percentile: Math.min(99, 85 + progress.level / 2)
  }

  // Get quest history (the real ones completed)
  const historyQuests = quests
    .filter(q => progress.completedQuests.includes(q.id))
    .map(q => ({
      ...q,
      date: 'Oct 24, 2024', // Mock date for now or could derive from activityHistory keys
      score: '100%',
      status: 'SUCCESS'
    }))

  // Filter quests based on tab
  const filteredHistory = historyQuests.filter(q => {
    if (activeHistoryTab === 'Completed') return true // All in this list are completed
    return true
  })

  return (
    <div className="max-w-[1400px] mx-auto p-4 lg:p-8 min-h-screen bg-background-dark text-white selection:bg-primary/30">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

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
                className="size-32 border-2 border-primary/50 relative z-10"
              />
              <div className="absolute bottom-1 right-1 size-5 bg-green-500 border-4 border-[#12122a] rounded-full"></div>
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
                style={{ width: `${(progress.levelProgress * 100) || 0}%` }}
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
              { label: 'Badges', value: profile.badges, icon: 'military_tech', color: 'text-purple-500', desc: 'Earned' },
              { label: 'Hours', value: profile.codingHours, icon: 'schedule', color: 'text-green-500', desc: 'Coding time' },
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
              <div className="flex justify-around items-center">
                {[
                  { name: 'Bug Hunter', icon: 'bug_report', bg: 'bg-orange-500/10', text: 'text-orange-400' },
                  { name: 'Clean Code', icon: 'code', bg: 'bg-blue-500/10', text: 'text-blue-400' },
                  { name: 'Speedster', icon: 'bolt', bg: 'bg-purple-500/10', text: 'text-purple-400' },
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 group">
                    <div className={`size-16 rounded-full ${badge.bg} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
                      <span className={`material-symbols-outlined text-3xl ${badge.text}`}>{badge.icon}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{badge.name}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* activity (Bar Chart Mock) */}
            <Card className="bg-[#12122a] border-white/5 p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold">Activity</h3>
                <button className="text-[10px] text-slate-500 font-bold uppercase py-1 px-3 bg-[#1d1d35] rounded-lg">Last 30 Days</button>
              </div>
              <div className="flex items-end justify-between h-24 gap-1 px-2 mb-4">
                {[35, 60, 45, 80, 55, 90, 70, 40, 65, 85, 50, 75].map((val, i) => (
                  <div
                    key={i}
                    className={`w-full rounded-t-sm transition-all duration-500 ${i === 5 ? 'bg-primary' : 'bg-primary/20 hover:bg-primary/40'}`}
                    style={{ height: `${val}%` }}
                  ></div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 font-medium text-center italic">
                {profile.completedCount} quests completed in the last 30 days.
              </p>
            </Card>
          </div>

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

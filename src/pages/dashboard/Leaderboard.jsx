import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLeaderboard } from '../../hooks/useLeaderboard'
import { useUser } from '../../context/UserContext'
import Card from '../../components/common/Card'
import Avatar from '../../components/common/Avatar'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'

const Leaderboard = () => {
  const { user } = useAuth()
  const { leaderboard, loading, error, refresh } = useLeaderboard(100, user?.uid)
  const { userStats } = useUser()
  const [timeFilter, setTimeFilter] = useState('weekly')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Normalize each entries' data from Firestore field names
  const safeNum = (val) => {
    const n = parseFloat(val)
    return isNaN(n) ? 0 : Math.floor(n)
  }

  const normalizedLeaderboard = leaderboard.map(p => ({
    ...p,
    xp: safeNum(p.xp),
    questsCompleted: safeNum(p.questsCompleted) || safeNum(p.totalCompletedQuests),
  }))

  // Get top 3 for podium
  const topThree = normalizedLeaderboard.slice(0, 3).map(player => ({
    ...player,
    badge: player.rank === 1 ? 'Gold' : player.rank === 2 ? 'Silver' : 'Bronze'
  }))
  // Podium display order: 2nd, 1st, 3rd
  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean)

  // Get remaining players for list (ranks 4+)
  const leaderboardList = normalizedLeaderboard.slice(3)

  // Find current user's rank in the leaderboard
  const currentUserEntry = normalizedLeaderboard.find(p => p.isCurrentUser)
  const currentUserRank = currentUserEntry || {
    rank: '?',
    username: user?.username || user?.displayName || 'You',
    avatar: user?.avatar || user?.photoURL,
    xp: userStats?.totalXP || 0,
    questsCompleted: userStats?.completedQuests || 0,
  }

  const getPodiumHeight = (rank) => {
    if (rank === 1) return 'h-48'
    if (rank === 2) return 'h-40'
    if (rank === 3) return 'h-32'
    return 'h-32'
  }

  const getPodiumColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-orange-600'
    if (rank === 2) return 'from-slate-300 to-slate-500'
    if (rank === 3) return 'from-orange-400 to-orange-600'
    return 'from-slate-400 to-slate-600'
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div>
          <div className="h-10 bg-slate-200 dark:bg-[#282839] rounded animate-pulse w-1/2 mb-2"></div>
          <div className="h-5 bg-slate-200 dark:bg-[#282839] rounded animate-pulse w-1/3"></div>
        </div>
        <Card variant="elevated" className="p-8">
          <div className="h-64 bg-slate-200 dark:bg-[#282839] rounded animate-pulse"></div>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto">
        <Card variant="elevated" className="p-8 text-center">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Failed to Load Leaderboard
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Leaderboard 🏆
          </h1>
          <p className="text-slate-600 dark:text-text-secondary mt-1">
            Compete with students worldwide
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon="refresh"
          onClick={refresh}
          isLoading={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card variant="elevated" className="p-4 animate-fade-in animate-delay-100">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Time Filter */}
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Time Period
            </label>
            <div className="flex gap-2">
              {['daily', 'weekly', 'monthly', 'all-time'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-[#282839] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#323267]'
                    }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Category
            </label>
            <div className="flex gap-2">
              {['all', 'python', 'javascript', 'algorithms'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setCategoryFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${categoryFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-[#282839] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#323267]'
                    }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Top 3 Podium */}
      <Card variant="elevated" className="p-8 overflow-hidden relative animate-scale-in animate-delay-200">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 pointer-events-none" />

        <div className="relative flex items-end justify-center gap-4 md:gap-8">
          {podiumOrder.map((leader) => (
            <div
              key={leader.rank}
              className="flex flex-col items-center group"
            >
              {/* Crown for #1 */}
              {leader.rank === 1 && (
                <span className="text-3xl mb-1">👑</span>
              )}
              {/* Avatar */}
              <div className="relative mb-4">
                <Avatar
                  src={leader.avatar}
                  name={leader.username}
                  size="xl"
                  ring
                  ringColor={
                    leader.rank === 1 ? 'ring-yellow-400' :
                      leader.rank === 2 ? 'ring-slate-400' :
                        'ring-orange-600'
                  }
                  className="transform group-hover:scale-110 transition-transform"
                />
                {/* Rank Badge */}
                <div className={`absolute -top-2 -right-2 size-8 rounded-full bg-gradient-to-br ${getPodiumColor(leader.rank)} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                  #{leader.rank}
                </div>
              </div>

              {/* User Info */}
              <Link to={`/app/profile/${leader.username}`}>
                <h3 className="font-bold text-slate-900 dark:text-white hover:text-primary transition-colors">
                  {leader.username}
                  {leader.isCurrentUser && <span className="ml-1 text-primary text-xs">(You)</span>}
                </h3>
              </Link>
              <p className="text-sm text-slate-600 dark:text-text-secondary mb-2">
                {leader.questsCompleted} quest{leader.questsCompleted !== 1 ? 's' : ''} done
              </p>
              <Badge variant="warning" icon="stars">
                {leader.xp.toLocaleString()} XP
              </Badge>

              {/* Podium */}
              <div className={`w-32 md:w-40 ${getPodiumHeight(leader.rank)} bg-gradient-to-b ${getPodiumColor(leader.rank)} rounded-t-xl mt-4 flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10" />
                <span className="text-white text-4xl md:text-5xl font-black relative z-10">
                  {leader.rank}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Your Rank */}
      <Card variant="elevated" className="p-6 bg-primary/5 border-primary/20 animate-slide-up animate-delay-300">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
            #{currentUserRank.rank}
          </div>
          <Avatar src={currentUserRank.avatar || user?.avatar || user?.photoURL} name={currentUserRank.username} size="lg" ring ringColor="ring-primary" />
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 dark:text-white">
              {currentUserRank.username} <span className="text-primary text-sm">(You)</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-text-secondary">
              {currentUserRank.questsCompleted || userStats?.completedQuests || 0} quests completed
            </p>
          </div>
          <Badge variant="warning" icon="stars" size="md">
            {(currentUserRank.xp || userStats?.totalXP || 0).toLocaleString()} XP
          </Badge>
        </div>
      </Card>

      {/* Leaderboard List */}
      <Card variant="elevated" className="overflow-hidden animate-fade-in animate-delay-400">
        <div className="p-6 border-b border-slate-200 dark:border-border-dark">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Rankings
          </h2>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-border-dark">
          {leaderboardList.map((leader) => (
            <div
              key={leader.rank}
              className="p-6 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-[#1f1f35] transition-colors"
            >
              {/* Rank */}
              <div className="w-12 text-center">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  #{leader.rank}
                </span>
              </div>

              {/* Change Indicator */}
              <div className="w-6">
                {leader.change === 'up' && (
                  <span className="material-symbols-outlined text-green-500 text-xl">trending_up</span>
                )}
                {leader.change === 'down' && (
                  <span className="material-symbols-outlined text-red-500 text-xl">trending_down</span>
                )}
                {leader.change === 'same' && (
                  <span className="material-symbols-outlined text-slate-400 text-xl">remove</span>
                )}
              </div>

              {/* Avatar & Info */}
              <Avatar src={leader.avatar} name={leader.username} size="md" />
              <div className="flex-1">
                <Link to={`/app/profile/${leader.username}`}>
                  <h3 className="font-bold text-slate-900 dark:text-white hover:text-primary transition-colors">
                    {leader.username}
                    {leader.isCurrentUser && <span className="ml-1 text-primary text-sm">(You)</span>}
                  </h3>
                </Link>
                <p className="text-sm text-slate-600 dark:text-text-secondary">
                  {leader.questsCompleted} quest{leader.questsCompleted !== 1 ? 's' : ''} completed
                </p>
              </div>

              {/* XP */}
              <div className="text-right">
                <p className="font-bold text-slate-900 dark:text-white">
                  {leader.xp.toLocaleString()}
                </p>
                <p className="text-xs text-slate-600 dark:text-text-secondary">XP</p>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="p-6 border-t border-slate-200 dark:border-border-dark">
          <Button variant="outline" className="w-full">
            Load More Rankings
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Leaderboard

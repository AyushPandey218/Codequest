import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'
import { useQuestList } from '../../hooks/useQuestList'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import ProgressBar from '../../components/common/ProgressBar'
import Button from '../../components/common/Button'
import { getProgressSummary } from '../../utils/progressStorage'

const Dashboard = () => {
  const { user } = useAuth()
  const { userStats, userProgress, isLoading: userLoading } = useUser()
  const { quests, loading: questsLoading } = useQuestList()

  // Real XP & level data from localStorage
  const [progress, setProgress] = useState(() => getProgressSummary())
  // Animate the XP bar (start at 0, fill to real value)
  const [barValue, setBarValue] = useState(0)

  useEffect(() => {
    const summary = getProgressSummary()
    setProgress(summary)
    // Delay bar fill for smooth animation on mount
    const t = setTimeout(() => setBarValue(Math.round(summary.levelProgress * 100)), 300)
    return () => clearTimeout(t)
  }, [])

  // Stats Grid — real data from localStorage
  const stats = [
    {
      label: 'XP Earned',
      value: progress.xp.toLocaleString(),
      icon: 'stars',
      color: 'text-yellow-400'
    },
    {
      label: 'Quests Completed',
      value: progress.completedCount,
      icon: 'task_alt',
      color: 'text-green-400'
    },
    {
      label: 'Current Level',
      value: `Lvl ${progress.level}`,
      icon: 'military_tech',
      color: 'text-blue-400'
    },
    {
      label: 'Day Streak',
      value: `${progress.streak || 0} days`,
      icon: 'local_fire_department',
      color: 'text-orange-400'
    },
  ]

  // Get recent quests with progress
  const recentQuests = quests
    .filter(quest => userProgress[quest.id])
    .slice(0, 3)
    .map(quest => ({
      ...quest,
      progress: userProgress[quest.id]?.completed ? 100 :
        (userProgress[quest.id]?.passedTests / userProgress[quest.id]?.totalTests * 100) || 0
    }))

  // Get first incomplete quest as daily challenge
  const dailyChallenge = quests.find(quest => !userProgress[quest.id]?.completed) || null

  const isLoading = userLoading || questsLoading

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="h-10 bg-slate-200 dark:bg-[#282839] rounded animate-pulse w-3/4 mb-2"></div>
            <div className="h-5 bg-slate-200 dark:bg-[#282839] rounded animate-pulse w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} variant="elevated" className="p-6">
              <div className="h-16 bg-slate-200 dark:bg-[#282839] rounded animate-pulse"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user?.username || 'Coder'}! 👋
          </h1>
          <p className="text-slate-600 dark:text-text-secondary mt-1">
            Ready to level up your coding skills today?
          </p>
        </div>
        <Link to="/app/quests">
          <Button variant="primary" icon="explore">
            Browse Quests
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} variant="elevated" className={`p-6 animate-scale-in animate-delay-${(index + 1) * 100}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-text-secondary font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`size-12 rounded-xl bg-slate-100 dark:bg-[#282839] flex items-center justify-center ${stat.color}`}>
                <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quests */}
        <div className="lg:col-span-2 space-y-6 animate-slide-in-left animate-delay-200">
          {/* Daily Challenge */}
          {dailyChallenge ? (
            <Card variant="elevated" className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="warning" icon="bolt" size="sm" className="mb-2">
                    Daily Challenge
                  </Badge>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {dailyChallenge.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {dailyChallenge.description}
                  </p>
                </div>
                <span className="material-symbols-outlined text-4xl text-primary">emoji_events</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-lg">schedule</span>
                    <span>{dailyChallenge.duration || '45 min'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-yellow-600 dark:text-yellow-400">
                    <span className="material-symbols-outlined text-lg">stars</span>
                    <span>{dailyChallenge.xp || 100} XP</span>
                  </div>
                </div>
                <Link to={`/app/quests/${dailyChallenge.id}`}>
                  <Button variant="primary" size="sm">
                    Start Challenge
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card variant="elevated" className="p-6 bg-slate-50 dark:bg-[#1c1c27] text-center">
              <p className="text-slate-600 dark:text-slate-400">
                🎉 All quests completed! Check back later for new challenges.
              </p>
            </Card>
          )}

          {/* Continue Learning */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Continue Learning
              </h2>
              <Link to="/app/quests" className="text-sm font-medium text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentQuests.length > 0 ? (
                recentQuests.map((quest) => (
                  <Link key={quest.id} to={`/app/quests/${quest.id}`}>
                    <Card variant="elevated" hover className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{quest.icon || '📝'}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {quest.title}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-text-secondary">
                                {quest.category || 'Quest'}
                              </p>
                            </div>
                            <Badge
                              variant={
                                quest.difficulty === 'Easy' ? 'success' :
                                  quest.difficulty === 'Medium' ? 'warning' :
                                    quest.difficulty === 'Hard' ? 'danger' : 'primary'
                              }
                              size="sm"
                            >
                              {quest.difficulty}
                            </Badge>
                          </div>
                          <ProgressBar value={quest.progress} className="mb-3" />
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600 dark:text-text-secondary">
                              {Math.round(quest.progress)}% Complete
                            </span>
                            <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                              +{quest.xp} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))
              ) : (
                <Card variant="elevated" className="p-6 text-center">
                  <p className="text-slate-600 dark:text-slate-400">
                    No quests in progress. Start a new quest to begin learning!
                  </p>
                  <Link to="/app/quests">
                    <Button variant="primary" size="sm" className="mt-4">
                      Browse Quests
                    </Button>
                  </Link>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Activity & Quick Actions */}
        <div className="space-y-6 animate-slide-in-right animate-delay-300">
          {/* Quick Actions */}
          <Card variant="elevated" className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link to="/app/clash" className="block">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-[#282839] hover:bg-slate-200 dark:hover:bg-[#323267] transition-colors text-left">
                  <span className="material-symbols-outlined text-primary text-2xl">swords</span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white text-sm">Code Clash</p>
                    <p className="text-xs text-slate-600 dark:text-text-secondary">Compete live</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
                </button>
              </Link>

              <Link to="/app/leaderboard" className="block">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-[#282839] hover:bg-slate-200 dark:hover:bg-[#323267] transition-colors text-left">
                  <span className="material-symbols-outlined text-yellow-500 text-2xl">leaderboard</span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white text-sm">Leaderboard</p>
                    <p className="text-xs text-slate-600 dark:text-text-secondary">Check rankings</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
                </button>
              </Link>

              <Link to="/app/community" className="block">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-[#282839] hover:bg-slate-200 dark:hover:bg-[#323267] transition-colors text-left">
                  <span className="material-symbols-outlined text-green-500 text-2xl">forum</span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white text-sm">Community</p>
                    <p className="text-xs text-slate-600 dark:text-text-secondary">Join discussions</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
                </button>
              </Link>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card variant="elevated" className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {userStats?.recentActivity?.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-sm">
                      {activity.type === 'quest' ? 'task_alt' : 'swords'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {activity.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-text-secondary">
                      {activity.date} • +{activity.xp} XP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Level Progress — real XP data with animated bar */}
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Level {progress.level}
              </h3>
              <Badge variant="primary">
                {progress.xp.toLocaleString()} XP
              </Badge>
            </div>

            {/* XP bar with smooth CSS transition */}
            <div
              style={{
                height: '10px',
                borderRadius: '999px',
                background: '#1c1c27',
                overflow: 'hidden',
                marginBottom: '8px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${barValue}%`,
                  background: 'linear-gradient(90deg, #2b2bee, #7c3aed)',
                  borderRadius: '999px',
                  transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: barValue > 0 ? '0 0 8px rgba(43,43,238,0.6)' : 'none',
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {Math.round(barValue)}% to Level {progress.level + 1}
              </p>
              <p className="text-xs font-semibold text-primary">
                {progress.xpToNextLevel} XP needed
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

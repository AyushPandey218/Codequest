import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'
import { useSubmissions } from '../../hooks/useSubmissions'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import ProgressBar from '../../components/common/ProgressBar'
import { getProgressSummary } from '../../utils/progressStorage'

const ProgressScreen = () => {
  const { user } = useAuth()
  const { userStats, isLoading } = useUser()
  const { submissions } = useSubmissions(user?.uid)

  const [progress, setProgress] = useState(() => getProgressSummary())

  useEffect(() => {
    setProgress(getProgressSummary())
  }, [])

  // Calculate weekly activity from real history in localStorage
  const weeklyActivity = (() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const result = []

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayName = days[d.getDay()]
      result.push({
        day: dayName,
        quests: progress.activityHistory[dateStr] || 0
      })
    }

    return result
  })()

  const maxQuests = Math.max(...weeklyActivity.map(d => d.quests), 1)

  // Skills progress data
  const skillProgress = [
    { skill: 'Python', level: 12, progress: 85, color: 'bg-blue-500' },
    { skill: 'JavaScript', level: 10, progress: 70, color: 'bg-yellow-500' },
    { skill: 'Algorithms', level: 8, progress: 55, color: 'bg-purple-500' },
    { skill: 'Data Structures', level: 9, progress: 65, color: 'bg-green-500' },
  ]

  // Learning paths data
  const learningPaths = [
    { id: 1, name: 'Python Fundamentals', icon: '🐍', completed: 12, total: 15, progress: 80 },
    { id: 2, name: 'Web Development', icon: '🌐', completed: 8, total: 20, progress: 40 },
    { id: 3, name: 'Algorithms & DS', icon: '🧮', completed: 15, total: 25, progress: 60 },
  ]

  // Recent achievements data
  const recentAchievements = [
    {
      id: 1,
      title: 'First Quest',
      description: 'Complete your first quest',
      icon: 'emoji_events',
      color: 'text-yellow-500',
      unlocked: true,
      date: '2 days ago',
    },
    {
      id: 2,
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: 'local_fire_department',
      color: 'text-orange-500',
      unlocked: true,
      date: '1 week ago',
    },
    {
      id: 3,
      title: 'Speed Demon',
      description: 'Complete 5 quests in under 30 minutes',
      icon: 'bolt',
      color: 'text-blue-500',
      unlocked: false,
      progress: 60,
    },
    {
      id: 4,
      title: 'Code Master',
      description: 'Reach level 15',
      icon: 'verified',
      color: 'text-purple-500',
      unlocked: false,
      progress: 80,
    },
  ]

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Your Progress 📈
          </h1>
          <p className="text-slate-600 dark:text-text-secondary mt-1">
            Track your learning journey
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated" className="p-6 animate-scale-in animate-delay-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600 dark:text-text-secondary">
              Total XP
            </span>
            <span className="material-symbols-outlined text-yellow-400 text-2xl">stars</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {progress.xp.toLocaleString()}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Real Student Stats
          </p>
        </Card>

        <Card variant="elevated" className="p-6 animate-scale-in animate-delay-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600 dark:text-text-secondary">
              Quests Done
            </span>
            <span className="material-symbols-outlined text-green-400 text-2xl">task_alt</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {progress.completedCount}
          </p>
          <p className="text-xs text-slate-600 dark:text-text-secondary mt-1">
            of 15 available
          </p>
        </Card>

        <Card variant="elevated" className="p-6 animate-scale-in animate-delay-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600 dark:text-text-secondary">
              Current Streak
            </span>
            <span className="material-symbols-outlined text-orange-400 text-2xl">local_fire_department</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {progress.streak} days
          </p>
          <p className="text-xs text-slate-600 dark:text-text-secondary mt-1">
            Keep the fire burning!
          </p>
        </Card>

        <Card variant="elevated" className="p-6 animate-scale-in animate-delay-400">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600 dark:text-text-secondary">
              Current Level
            </span>
            <span className="material-symbols-outlined text-blue-400 text-2xl">military_tech</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            Lvl {progress.level}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            {progress.xpToNextLevel} XP to next
          </p>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Activity Chart */}
          <Card variant="elevated" className="p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Weekly Activity
            </h2>
            <div className="flex items-end justify-between gap-3 h-48">
              {weeklyActivity.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex-1 w-full flex items-end">
                    <div
                      className="w-full bg-primary/20 rounded-t-lg hover:bg-primary transition-colors cursor-pointer relative group"
                      style={{ height: `${(day.quests / maxQuests) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                        {day.quests} quests
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-text-secondary">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Skill Progress */}
          <Card variant="elevated" className="p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Skill Levels
            </h2>
            <div className="space-y-5">
              {skillProgress.map((skill, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-lg ${skill.color} bg-opacity-20 flex items-center justify-center`}>
                        <span className={`material-symbols-outlined ${skill.color.replace('bg-', 'text-')}`}>
                          code
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {skill.skill}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-text-secondary">
                          Level {skill.level}
                        </p>
                      </div>
                    </div>
                    <Badge variant="default" size="sm">
                      {skill.progress}%
                    </Badge>
                  </div>
                  <ProgressBar value={skill.progress} variant="primary" />
                </div>
              ))}
            </div>
          </Card>

          {/* Learning Paths */}
          <Card variant="elevated" className="p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Learning Paths
            </h2>
            <div className="space-y-4">
              {learningPaths.map((path) => (
                <div
                  key={path.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#282839] hover:bg-slate-100 dark:hover:bg-[#323267] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{path.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {path.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-text-secondary">
                        {path.completed} of {path.total} completed
                      </p>
                    </div>
                    <Badge variant="primary">
                      {path.progress}%
                    </Badge>
                  </div>
                  <ProgressBar value={path.progress} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card variant="elevated" className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar
                src={user?.avatar}
                name={user?.username}
                size="xl"
                ring
                ringColor="ring-primary"
                className="mb-4"
              />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {user?.username || 'User'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-text-secondary mb-4">
                Level {progress.level} Coder
              </p>
              <div className="w-full">
                <ProgressBar value={Math.round(progress.levelProgress * 100)} showLabel />
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card variant="elevated" className="p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Achievements
            </h2>
            <div className="space-y-3">
              {recentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-xl border transition-all ${achievement.unlocked
                      ? 'bg-slate-50 dark:bg-[#282839] border-slate-200 dark:border-border-dark'
                      : 'bg-slate-100/50 dark:bg-[#1c1c27]/50 border-slate-200/50 dark:border-border-dark/50 opacity-60'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`size-10 rounded-lg bg-slate-200 dark:bg-[#323267] flex items-center justify-center flex-shrink-0 ${achievement.color}`}>
                      <span className="material-symbols-outlined">
                        {achievement.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {achievement.title}
                        </h4>
                        {achievement.unlocked && (
                          <span className="material-symbols-outlined text-green-500 text-sm">
                            check_circle
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-text-secondary mb-2">
                        {achievement.description}
                      </p>
                      {achievement.unlocked ? (
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Unlocked {achievement.date}
                        </p>
                      ) : (
                        <div>
                          <ProgressBar value={achievement.progress} size="sm" />
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            {achievement.progress}% complete
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card variant="elevated" className="p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
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
                      {activity.date}
                    </p>
                  </div>
                  <Badge variant="warning" size="sm">
                    +{activity.xp}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProgressScreen

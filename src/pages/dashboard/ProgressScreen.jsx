import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'
import { useSubmissions } from '../../hooks/useSubmissions'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import ProgressBar from '../../components/common/ProgressBar'
import { getLevelProgress, getXPToNextLevel } from '../../utils/progressStorage'
import { achievements } from '../../data/achievements'
import { modules } from '../../data/modules'

const ProgressScreen = () => {
  const { user } = useAuth()
  const { userStats, moduleProgress, submissions: contextSubmissions, isLoading } = useUser()
  const { submissions } = useSubmissions(user?.uid)

  // ─── Weekly Activity ────────────────────────────────────────────────────────
  const weeklyActivity = (() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const result = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayName = days[d.getDay()]
      const count = submissions.filter(sub => {
        const subDate = sub.timestamp?.toDate ? sub.timestamp.toDate() : new Date(sub.timestamp)
        return subDate.toISOString().split('T')[0] === dateStr
      }).length
      result.push({ day: dayName, quests: count })
    }
    return result
  })()
  const maxQuests = Math.max(...weeklyActivity.map(d => d.quests), 1)

  // ─── Skill Progress (derived from successful submissions) ───────────────────
  const successfulSubs = submissions.filter(s => s.passedTests === s.totalTests && s.totalTests > 0)

  const calcSkill = (filterFn, max = 20) => {
    const count = successfulSubs.filter(filterFn).length
    return {
      count,
      level: Math.min(Math.floor(count / 2) + 1, max),
      progress: Math.min(Math.round((count / max) * 100), 100)
    }
  }

  const pythonSkill = calcSkill(s => s.language?.toLowerCase().includes('python'))
  const jsSkill = calcSkill(s => s.language?.toLowerCase().includes('javascript') || s.language?.toLowerCase().includes('js'))
  const algoSkill = {
    count: userStats?.algoQuests || 0,
    level: Math.min((userStats?.algoQuests || 0) + 1, 20),
    progress: Math.min(Math.round(((userStats?.algoQuests || 0) / 10) * 100), 100)
  }
  const dataSkill = {
    count: userStats?.dataQuests || 0,
    level: Math.min((userStats?.dataQuests || 0) + 1, 20),
    progress: Math.min(Math.round(((userStats?.dataQuests || 0) / 8) * 100), 100)
  }

  const skillProgress = [
    { skill: 'Python', level: pythonSkill.level, progress: pythonSkill.progress, color: 'bg-blue-500', textColor: 'text-blue-500', icon: 'code' },
    { skill: 'JavaScript', level: jsSkill.level, progress: jsSkill.progress, color: 'bg-yellow-500', textColor: 'text-yellow-500', icon: 'javascript' },
    { skill: 'Algorithms', level: algoSkill.level, progress: algoSkill.progress, color: 'bg-purple-500', textColor: 'text-purple-500', icon: 'account_tree' },
    { skill: 'Data Analysis', level: dataSkill.level, progress: dataSkill.progress, color: 'bg-green-500', textColor: 'text-green-500', icon: 'query_stats' },
  ]

  // ─── Learning Paths (from real module progress) ─────────────────────────────
  const learningPaths = modules.map(mod => {
    const prog = moduleProgress?.[mod.id]
    const totalLessons = mod.lessons || 0
    const completedCount = prog?.completedLessons?.length || 0
    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
    return {
      id: mod.id,
      name: mod.title,
      icon: mod.icon || '📦',
      completed: completedCount,
      total: totalLessons,
      progress,
    }
  })

  // ─── Achievements (real + upcoming) ────────────────────────────────────────
  const earnedIds = new Set(userStats?.achievements || [])

  const achievementDisplayList = achievements.slice(0, 6).map(a => {
    const unlocked = earnedIds.has(a.id)
    // Calculate progress for locked achievements
    let progress = 0
    if (!unlocked && userStats) {
      if (a.criteria) {
        try {
          // We can't directly get "how close" from a boolean, so we do best-effort
          // For quests: completedQuests / threshold
          if (a.id.startsWith('quest_master')) {
            const threshold = a.id === 'quest_master_5' ? 5 : a.id === 'quest_master_10' ? 10 : userStats.totalQuests
            progress = Math.min(Math.round(((userStats.completedQuests || 0) / threshold) * 100), 99)
          } else if (a.id.startsWith('level')) {
            const threshold = a.id === 'level_5' ? 5 : 10
            progress = Math.min(Math.round(((userStats.level || 1) / threshold) * 100), 99)
          } else if (a.id.startsWith('xp')) {
            const threshold = a.id === 'xp_1000' ? 1000 : 5000
            progress = Math.min(Math.round(((userStats.totalXP || 0) / threshold) * 100), 99)
          } else if (a.id.startsWith('streak')) {
            const threshold = a.id === 'streak_3' ? 3 : 7
            progress = Math.min(Math.round(((userStats.streak || 0) / threshold) * 100), 99)
          } else if (a.id === 'module_master') {
            progress = Math.min(Math.round(((userStats.completedModules || 0) / 1) * 100), 99)
          }
        } catch (e) { progress = 0 }
      }
    }
    return { ...a, unlocked, progress }
  })

  // ─── Recent Activity ────────────────────────────────────────────────────────
  const recentActivity = userStats?.recentActivity?.slice(0, 5) || []

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
            <span className="text-sm font-medium text-slate-600 dark:text-text-secondary">Total XP</span>
            <span className="material-symbols-outlined text-yellow-400 text-2xl">stars</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {(userStats?.totalXP || 0).toLocaleString()}
          </p>
        </Card>

        <Card variant="elevated" className="p-6 animate-scale-in animate-delay-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600 dark:text-text-secondary">Quests Done</span>
            <span className="material-symbols-outlined text-green-400 text-2xl">task_alt</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {userStats?.completedQuests || 0}
          </p>
          <p className="text-xs text-slate-600 dark:text-text-secondary mt-1">
            of {userStats?.totalQuests || 0} available
          </p>
        </Card>

        <Card variant="elevated" className="p-6 animate-scale-in animate-delay-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600 dark:text-text-secondary">Current Streak</span>
            <span className="material-symbols-outlined text-orange-400 text-2xl">local_fire_department</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {userStats?.streak || 0} days
          </p>
          <p className="text-xs text-slate-600 dark:text-text-secondary mt-1">Keep the fire burning!</p>
        </Card>

        <Card variant="elevated" className="p-6 animate-scale-in animate-delay-400">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600 dark:text-text-secondary">Current Level</span>
            <span className="material-symbols-outlined text-blue-400 text-2xl">military_tech</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            Lvl {userStats?.level || 1}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            {getXPToNextLevel(userStats?.totalXP || 0)} XP to next
          </p>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Activity Chart */}
          <Card variant="elevated" className="p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Weekly Activity</h2>
            <div className="flex items-end justify-between gap-3 h-48">
              {weeklyActivity.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex-1 w-full flex items-end">
                    <div
                      className="w-full bg-primary/20 rounded-t-lg hover:bg-primary transition-colors cursor-pointer relative group"
                      style={{ height: `${Math.max((day.quests / maxQuests) * 100, day.quests > 0 ? 8 : 2)}%` }}
                    >
                      {day.quests > 0 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                          {day.quests} submission{day.quests !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-text-secondary">{day.day}</span>
                </div>
              ))}
            </div>
            {submissions.length === 0 && (
              <p className="text-center text-xs text-slate-500 mt-3">Start solving quests to see your activity here!</p>
            )}
          </Card>

          {/* Skill Progress */}
          <Card variant="elevated" className="p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Skill Levels</h2>
            <div className="space-y-5">
              {skillProgress.map((skill, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-lg ${skill.color}/10 border border-white/5 flex items-center justify-center`}>
                        <span className={`material-symbols-outlined ${skill.textColor} text-xl`}>{skill.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{skill.skill}</p>
                        <p className="text-xs text-slate-600 dark:text-text-secondary">Level {skill.level}</p>
                      </div>
                    </div>
                    <Badge variant="default" size="sm">{skill.progress}%</Badge>
                  </div>
                  <ProgressBar value={skill.progress} variant="primary" />
                </div>
              ))}
            </div>
          </Card>

          {/* Learning Paths */}
          <Card variant="elevated" className="p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Learning Paths</h2>
            <div className="space-y-4">
              {learningPaths.map((path) => (
                <div
                  key={path.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#282839] hover:bg-slate-100 dark:hover:bg-[#323267] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{path.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white">{path.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-text-secondary">
                        {path.completed} of {path.total} lessons completed
                      </p>
                    </div>
                    <Badge variant={path.progress === 100 ? 'success' : 'primary'}>{path.progress}%</Badge>
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
                src={user?.avatar || user?.photoURL}
                name={user?.username}
                size="xl"
                ring
                ringColor="ring-primary"
                className="mb-4"
              />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user?.username || 'User'}</h3>
              <p className="text-sm text-slate-600 dark:text-text-secondary mb-4">
                Level {userStats?.level || 1} Coder
              </p>
              <div className="w-full">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{userStats?.totalXP || 0} XP</span>
                  <span>{getXPToNextLevel(userStats?.totalXP || 0)} XP to next</span>
                </div>
                <ProgressBar value={Math.round(getLevelProgress(userStats?.totalXP || 0) * 100)} showLabel />
              </div>

              {/* Category Breakdown */}
              <div className="mt-4 w-full grid grid-cols-3 gap-2">
                {[
                  { label: 'Algo', count: userStats?.algoQuests || 0, color: 'text-purple-500' },
                  { label: 'Web', count: userStats?.webQuests || 0, color: 'text-blue-500' },
                  { label: 'Data', count: userStats?.dataQuests || 0, color: 'text-green-500' },
                ].map(cat => (
                  <div key={cat.label} className="p-2 rounded-lg bg-slate-50 dark:bg-[#282839] text-center">
                    <p className={`text-lg font-bold ${cat.color}`}>{cat.count}</p>
                    <p className="text-[10px] text-slate-500">{cat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Achievements</h2>
              <Badge variant="default" size="sm">{earnedIds.size} / {achievements.length}</Badge>
            </div>
            <div className="space-y-3">
              {achievementDisplayList.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-xl border transition-all ${achievement.unlocked
                    ? 'bg-slate-50 dark:bg-[#282839] border-slate-200 dark:border-border-dark'
                    : 'bg-slate-100/50 dark:bg-[#1c1c27]/50 border-slate-200/50 dark:border-border-dark/50 opacity-60'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`size-10 rounded-lg ${achievement.bgColor || 'bg-[#323267]'} flex items-center justify-center flex-shrink-0 ${achievement.color}`}>
                      <span className="material-symbols-outlined text-xl">{achievement.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{achievement.name}</h4>
                        {achievement.unlocked && (
                          <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-text-secondary mb-2">{achievement.description}</p>
                      {achievement.unlocked ? (
                        <p className="text-xs text-slate-500">Earned ✓</p>
                      ) : achievement.progress > 0 ? (
                        <div>
                          <ProgressBar value={achievement.progress} size="sm" />
                          <p className="text-xs text-slate-500 mt-1">{achievement.progress}% complete</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card variant="elevated" className="p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.length > 0 ? recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-sm">
                      {activity.type === 'quest' ? 'task_alt' : 'swords'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{activity.name}</p>
                    <p className="text-xs text-slate-600 dark:text-text-secondary">{activity.date}</p>
                  </div>
                  <Badge variant="warning" size="sm">+{activity.xp} XP</Badge>
                </div>
              )) : (
                <p className="text-sm text-slate-500 text-center py-4">No activity yet. Solve a quest!</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProgressScreen

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'

const UserProfile = () => {
  const { userId } = useParams()
  const { user: currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const isOwnProfile = userId === currentUser?.username || !userId

  const profile = {
    username: isOwnProfile ? (currentUser?.username || 'alexdev') : userId,
    avatar: isOwnProfile ? currentUser?.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
    level: 12,
    xp: 2450,
    nextLevelXP: 3000,
    rank: 42,
    joinDate: 'January 2024',
    location: 'San Francisco, CA',
    bio: 'Passionate developer learning algorithms and data structures. Love competitive programming!',
    streakDays: 7,
    totalQuests: 45,
    completedQuests: 28,
    clashWins: 15,
    clashTotal: 22,
  }

  const stats = [
    { label: 'Total XP', value: profile.xp.toLocaleString(), icon: 'stars', color: 'text-yellow-500' },
    { label: 'Global Rank', value: `#${profile.rank}`, icon: 'leaderboard', color: 'text-blue-500' },
    { label: 'Quests Done', value: profile.completedQuests, icon: 'task_alt', color: 'text-green-500' },
    { label: 'Win Rate', value: `${Math.round((profile.clashWins / profile.clashTotal) * 100)}%`, icon: 'trophy', color: 'text-orange-500' },
  ]

  const skills = [
    { name: 'Python', level: 12, progress: 85, icon: '🐍' },
    { name: 'JavaScript', level: 10, progress: 65, icon: '⚡' },
    { name: 'Algorithms', level: 8, progress: 45, icon: '🧮' },
    { name: 'Data Structures', level: 9, progress: 60, icon: '📊' },
  ]

  const achievements = [
    { id: 1, title: 'First Quest', description: 'Complete your first quest', icon: 'emoji_events', unlocked: true, date: '2024-01-15' },
    { id: 2, title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: 'local_fire_department', unlocked: true, date: '2024-01-20' },
    { id: 3, title: 'Code Master', description: 'Reach level 10', icon: 'verified', unlocked: true, date: '2024-01-25' },
    { id: 4, title: 'Speed Demon', description: 'Complete 5 quests in under 30 minutes', icon: 'bolt', unlocked: true, date: '2024-01-28' },
    { id: 5, title: 'Bug Hunter', description: 'Find and fix 50 bugs', icon: 'bug_report', unlocked: false, progress: 38 },
    { id: 6, title: 'Clash Champion', description: 'Win 50 code clashes', icon: 'swords', unlocked: false, progress: 15 },
  ]

  const recentActivity = [
    { id: 1, type: 'quest', title: 'Array Manipulation Master', xp: 150, date: '2 hours ago', icon: 'task_alt', color: 'text-green-500' },
    { id: 2, type: 'clash', title: 'Won Code Clash vs CodeNinja', xp: 100, date: '5 hours ago', icon: 'swords', color: 'text-orange-500' },
    { id: 3, type: 'achievement', title: 'Unlocked "Speed Demon"', xp: 50, date: '1 day ago', icon: 'emoji_events', color: 'text-yellow-500' },
    { id: 4, type: 'quest', title: 'Binary Search Trees', xp: 200, date: '2 days ago', icon: 'task_alt', color: 'text-green-500' },
  ]

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Profile Header */}
      <Card variant="elevated" className="overflow-hidden animate-slide-up">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-br from-primary via-purple-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/debut-dark.png')] opacity-30" />
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20 gap-4">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
              <Avatar
                src={profile.avatar}
                name={profile.username}
                size="xl"
                ring
                ringColor="ring-4 ring-white dark:ring-background-dark"
                className="size-32 md:size-40 shadow-2xl"
              />
              <div className="text-center md:text-left pb-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {profile.username}
                </h1>
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <Badge variant="primary">Level {profile.level}</Badge>
                  <Badge variant="warning" icon="stars">
                    {profile.xp} XP
                  </Badge>
                  <Badge variant="info">Rank #{profile.rank}</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-text-secondary">
                  {profile.location} • Joined {profile.joinDate}
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-center md:justify-end pb-2">
              {isOwnProfile ? (
                <>
                  <Link to="/app/profile/edit">
                    <Button variant="primary" icon="edit">
                      Edit Profile
                    </Button>
                  </Link>
                  <Link to="/app/settings/account">
                    <Button variant="outline" icon="settings">
                      Settings
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button variant="primary" icon="person_add">
                    Follow
                  </Button>
                  <Button variant="outline" icon="mail">
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="mt-4 text-slate-700 dark:text-slate-300 text-center md:text-left">
              {profile.bio}
            </p>
          )}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} variant="elevated" className={`p-6 text-center animate-scale-in animate-delay-${(index + 1) * 100}`}>
            <div className={`size-12 rounded-xl bg-slate-100 dark:bg-[#282839] flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
              <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-slate-600 dark:text-text-secondary">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Card variant="elevated" className="overflow-hidden animate-fade-in animate-delay-300">
        <div className="flex border-b border-slate-200 dark:border-border-dark overflow-x-auto pb-2">
          {['overview', 'skills', 'achievements', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm capitalize whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Progress to Next Level
                  </h3>
                  <Card variant="bordered" className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Level {profile.level}
                      </span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Level {profile.level + 1}
                      </span>
                    </div>
                    <ProgressBar
                      value={(profile.xp / profile.nextLevelXP) * 100}
                      showLabel
                    />
                    <p className="text-xs text-center text-slate-600 dark:text-text-secondary mt-2">
                      {profile.nextLevelXP - profile.xp} XP to next level
                    </p>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Quest Progress
                  </h3>
                  <Card variant="bordered" className="p-4">
                    <div className="text-center mb-4">
                      <p className="text-4xl font-black text-slate-900 dark:text-white">
                        {profile.completedQuests}/{profile.totalQuests}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-text-secondary mt-1">
                        Quests Completed
                      </p>
                    </div>
                    <ProgressBar
                      value={(profile.completedQuests / profile.totalQuests) * 100}
                    />
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Clash Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Card variant="bordered" className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {profile.clashWins}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-text-secondary mt-1">
                        Wins
                      </p>
                    </Card>
                    <Card variant="bordered" className="p-4 text-center">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {profile.clashTotal - profile.clashWins}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-text-secondary mt-1">
                        Losses
                      </p>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Current Streak
                  </h3>
                  <Card variant="bordered" className="p-6 text-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 border-orange-200 dark:border-orange-800">
                    <span className="material-symbols-outlined text-6xl text-orange-500 mb-3 block animate-pulse">
                      local_fire_department
                    </span>
                    <p className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                      {profile.streakDays} Days
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Keep it going! 🔥
                    </p>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Top Skills
                  </h3>
                  <div className="space-y-3">
                    {skills.slice(0, 3).map((skill, index) => (
                      <Card key={index} variant="bordered" className="p-3">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{skill.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                {skill.name}
                              </span>
                              <Badge variant="default" size="sm">
                                Lvl {skill.level}
                              </Badge>
                            </div>
                            <ProgressBar value={skill.progress} size="sm" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <Card key={index} variant="bordered" className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="size-16 rounded-xl bg-slate-100 dark:bg-[#282839] flex items-center justify-center text-3xl">
                      {skill.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {skill.name}
                        </h3>
                        <Badge variant="primary">Level {skill.level}</Badge>
                      </div>
                      <ProgressBar value={skill.progress} showLabel />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  variant="bordered"
                  className={`p-6 ${
                    achievement.unlocked
                      ? 'bg-slate-50 dark:bg-[#282839]'
                      : 'opacity-60 grayscale'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`size-16 rounded-xl ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-600'
                        : 'bg-slate-200 dark:bg-[#323267]'
                    } flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-white text-3xl">
                        {achievement.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-text-secondary mb-3">
                        {achievement.description}
                      </p>
                      {achievement.unlocked ? (
                        <Badge variant="success" size="sm">
                          Unlocked {achievement.date}
                        </Badge>
                      ) : (
                        <div>
                          <ProgressBar value={achievement.progress} size="sm" />
                          <p className="text-xs text-slate-600 dark:text-text-secondary mt-1">
                            {achievement.progress}% complete
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <Card key={activity.id} variant="bordered" className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-slate-100 dark:bg-[#282839] flex items-center justify-center">
                      <span className={`material-symbols-outlined ${activity.color}`}>
                        {activity.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-text-secondary">
                        {activity.date}
                      </p>
                    </div>
                    <Badge variant="warning" icon="stars">
                      +{activity.xp}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default UserProfile

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuestList } from '../../hooks/useQuestList'
import { useUser } from '../../context/UserContext'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'

const QuestSelection = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeDifficulty, setActiveDifficulty] = useState('all')

  const { quests, loading, error } = useQuestList()
  const { userProgress } = useUser()
  const completedQuestIds = new Set(
    Object.keys(userProgress).filter(id => userProgress[id].completed)
  )

  const categories = [
    { id: 'all', label: 'All Quests', icon: 'grid_view' },
    { id: 'python', label: 'Python', icon: 'code' },
    { id: 'javascript', label: 'JavaScript', icon: 'javascript' },
    { id: 'algorithms', label: 'Algorithms', icon: 'psychology' },
    { id: 'web', label: 'Web Dev', icon: 'web' },
  ]

  const difficulties = ['all', 'easy', 'medium', 'hard', 'expert']

  // Add progress to quests from userProgress
  const questsWithProgress = quests.map(quest => ({
    ...quest,
    progress: userProgress[quest.id]?.completed ? 100 :
      userProgress[quest.id]?.passedTests && userProgress[quest.id]?.totalTests
        ? (userProgress[quest.id].passedTests / userProgress[quest.id].totalTests * 100)
        : 0
  }))

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'success',
      medium: 'warning',
      hard: 'danger',
      expert: 'primary',
    }
    return colors[difficulty] || 'default'
  }

  const filteredQuests = questsWithProgress.filter(quest => {
    const categoryMatch = activeCategory === 'all' || quest.category === activeCategory
    const difficultyMatch = activeDifficulty === 'all' || quest.difficulty?.toLowerCase() === activeDifficulty
    return categoryMatch && difficultyMatch
  })

  // Calculate stats — use localStorage completions as source of truth
  const totalQuests = quests.length
  const completedQuests = completedQuestIds.size
  const inProgressQuests = Object.values(userProgress).filter(p => !p.completed && p.passedTests > 0).length
  const notStartedQuests = totalQuests - completedQuests - inProgressQuests

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div>
          <div className="h-10 bg-slate-200 dark:bg-[#282839] rounded animate-pulse w-1/2 mb-2"></div>
          <div className="h-5 bg-slate-200 dark:bg-[#282839] rounded animate-pulse w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} variant="elevated" className="p-6">
              <div className="h-48 bg-slate-200 dark:bg-[#282839] rounded animate-pulse"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto">
        <Card variant="elevated" className="p-8 text-center">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Failed to Load Quests
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
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Back Link */}
      <Link to="/app/academy" className="flex items-center gap-2 text-slate-600 dark:text-text-secondary hover:text-primary transition-colors group">
        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
        <span className="text-sm font-medium">Back to Academy</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Quest Selection 🎯
          </h1>
          <p className="text-slate-600 dark:text-text-secondary mt-1">
            Choose your coding adventure
          </p>
        </div>
      </div>

      {/* Featured Journey Link */}
      <Link to="/app/paths" className="block transform transition-all hover:scale-[1.01] active:scale-[0.99]">
        <Card variant="elevated" className="relative overflow-hidden p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 hover:border-primary/40 group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-9xl -rotate-12">map</span>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-inner">
                 <span className="material-symbols-outlined text-3xl">route</span>
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Structured Learning Paths</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">Don't know where to start? Follow a curated path from zero to hero.</p>
              </div>
            </div>
            <Button variant="primary" className="shadow-lg shadow-primary/20 group-hover:px-8 transition-all">Explore Paths</Button>
          </div>
        </Card>
      </Link>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card variant="elevated" className="p-3 sm:p-4 text-center animate-scale-in animate-delay-100">
          <p className="text-2xl sm:text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
            {totalQuests}
          </p>
          <p className="text-[10px] sm:text-sm text-slate-600 dark:text-text-secondary mt-1">
            Total Quests
          </p>
        </Card>
        <Card variant="elevated" className="p-3 sm:p-4 text-center animate-scale-in animate-delay-200">
          <p className="text-2xl sm:text-4xl font-black tracking-tighter text-green-600 dark:text-green-400">
            {completedQuests}
          </p>
          <p className="text-[10px] sm:text-sm text-slate-600 dark:text-text-secondary mt-1">
            Completed
          </p>
        </Card>
        <Card variant="elevated" className="p-3 sm:p-4 text-center animate-scale-in animate-delay-300">
          <p className="text-2xl sm:text-4xl font-black tracking-tighter text-blue-600 dark:text-blue-400">
            {inProgressQuests}
          </p>
          <p className="text-[10px] sm:text-sm text-slate-600 dark:text-text-secondary mt-1">
            In Progress
          </p>
        </Card>
        <Card variant="elevated" className="p-3 sm:p-4 text-center animate-scale-in animate-delay-400">
          <p className="text-2xl sm:text-4xl font-black tracking-tighter text-purple-600 dark:text-purple-400">
            {notStartedQuests}
          </p>
          <p className="text-[10px] sm:text-sm text-slate-600 dark:text-text-secondary mt-1">
            Not Started
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="elevated" className="p-6 animate-fade-in animate-delay-200">
        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
            Category
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeCategory === category.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-slate-100 dark:bg-[#282839] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#323267]'
                  }`}
              >
                <span className="material-symbols-outlined text-lg">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
            Difficulty
          </h3>
          <div className="flex flex-wrap gap-2">
            {difficulties.map(difficulty => (
              <button
                key={difficulty}
                onClick={() => setActiveDifficulty(difficulty)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeDifficulty === difficulty
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-[#282839] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#323267]'
                  }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Quest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuests.map((quest, index) => (
          <Card key={quest.id} variant="elevated" hover className={`p-6 flex flex-col animate-scale-in animate-delay-${Math.min((index % 6 + 1) * 100, 500)}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{quest.icon}</div>
              <div className="flex items-center gap-2">
                {completedQuestIds.has(quest.id) && (
                  <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/30 px-2 py-1 rounded-full">
                    <span className="material-symbols-outlined text-sm">check_circle</span> Done
                  </span>
                )}
                <Badge variant={getDifficultyColor(quest.difficulty)} size="sm">
                  {quest.difficulty}
                </Badge>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {quest.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-text-secondary mb-4 flex-1">
              {quest.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {quest.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#282839] text-slate-600 dark:text-slate-300 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Progress */}
            {quest.progress > 0 && (
              <div className="mb-4">
                <ProgressBar value={quest.progress} size="sm" />
                <p className="text-xs text-slate-600 dark:text-text-secondary mt-1">
                  {quest.progress}% Complete
                </p>
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-text-secondary mb-4">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">schedule</span>
                <span>{quest.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">group</span>
                <span>{quest.completions}</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-bold">
                <span className="material-symbols-outlined text-lg">stars</span>
                <span>{quest.xp} XP</span>
              </div>
            </div>

            {/* Action Button */}
            <Link to={`/app/quests/${quest.id}`}>
              <Button
                variant={completedQuestIds.has(quest.id) ? 'outline' : 'primary'}
                size="md"
                className="w-full"
                icon={completedQuestIds.has(quest.id) ? 'replay' : 'rocket_launch'}
              >
                {completedQuestIds.has(quest.id) ? 'Solve Again' : 'Start Quest'}
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredQuests.length === 0 && (
        <Card variant="elevated" className="p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4 block">
            search_off
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No quests found
          </h3>
          <p className="text-slate-600 dark:text-text-secondary mb-4">
            Try adjusting your filters to see more quests
          </p>
          <Button
            variant="primary"
            onClick={() => {
              setActiveCategory('all')
              setActiveDifficulty('all')
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  )
}

export default QuestSelection

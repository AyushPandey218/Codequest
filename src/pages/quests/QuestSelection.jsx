import { useState, useMemo } from 'react'
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

  // WORKING LOGIC - Deduplicate & Normalize
  const processedQuests = useMemo(() => {
    if (!quests || !Array.isArray(quests)) return []
    const unique = new Map()
    quests.forEach(q => {
      const key = q.id
      if (!unique.has(key)) {
        unique.set(key, {
          ...q,
          difficulty: q.difficulty || q.Difficulty || 'Medium',
          category: q.category || q.Category || 'other',
          progress: userProgress[q.id]?.completed ? 100 :
            userProgress[q.id]?.passedTests && userProgress[q.id]?.totalTests
              ? (userProgress[q.id].passedTests / userProgress[q.id].totalTests * 100)
              : 0
        })
      }
    })
    return Array.from(unique.values())
  }, [quests, userProgress])

  // WORKING LOGIC - Strict Filtering
  const filteredQuests = useMemo(() => {
    return processedQuests.filter(q => {
      // 1. Category Filter
      const qCat = (q.category || '').toString().toLowerCase().trim()
      const aCat = activeCategory.toLowerCase().trim()
      const categoryMatch = aCat === 'all' || qCat === aCat
      if (!categoryMatch) return false

      // 2. Difficulty Filter
      const qDiff = (q.difficulty || '').toString().toLowerCase().trim()
      const aDiff = activeDifficulty.toLowerCase().trim()
      return aDiff === 'all' || qDiff === aDiff
    })
  }, [processedQuests, activeCategory, activeDifficulty])

  // Stats for the cards
  const totalQuests = processedQuests.length
  const completedQuests = processedQuests.filter(q => q.progress === 100).length
  const inProgressQuests = Object.values(userProgress).filter(p => !p.completed && p.passedTests > 0).length
  const notStartedQuests = totalQuests - completedQuests - inProgressQuests

  const getDifficultyColor = (difficulty) => {
    const d = (difficulty || '').toLowerCase()
    const colors = {
      easy: 'success',
      medium: 'warning',
      hard: 'danger',
      expert: 'primary',
    }
    return colors[d] || 'default'
  }

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} variant="elevated" className="p-6 h-64 animate-pulse bg-white/5" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto p-4">
        <Card variant="elevated" className="p-8 text-center">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
          <h2 className="text-xl font-bold text-white mb-2">Failed to Load Quests</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 p-1">
      {/* Back Link */}
      <Link to="/app/academy" className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors group px-1">
        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
        <span className="text-sm font-medium uppercase tracking-widest text-[10px]">Back to Academy</span>
      </Link>

      {/* Header */}
      <div className="px-1">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
          Quest Selection 🎯
        </h1>
        <p className="text-slate-400 mt-1 font-medium">
          Choose your coding adventure
        </p>
      </div>

      {/* Featured Journey Link */}
      <Link to="/app/paths" className="block transform transition-all hover:scale-[1.01] active:scale-[0.99] px-1">
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
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Structured Learning Paths</h2>
                <p className="text-sm text-slate-300 max-w-md">Don't know where to start? Follow a curated path from zero to hero.</p>
              </div>
            </div>
            <Button variant="primary" className="shadow-lg shadow-primary/20 group-hover:px-8 transition-all h-12">Explore Paths</Button>
          </div>
        </Card>
      </Link>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-1">
        {[
          { label: 'Total Quests', value: totalQuests, color: 'text-white' },
          { label: 'Completed', value: completedQuests, color: 'text-green-400' },
          { label: 'In Progress', value: inProgressQuests, color: 'text-blue-400' },
          { label: 'Not Started', value: notStartedQuests, color: 'text-purple-400' }
        ].map((s, i) => (
          <Card key={i} variant="elevated" className="p-4 text-center bg-[#1c1c27] border-white/5">
            <p className={`text-2xl sm:text-4xl font-black tracking-tighter ${s.color}`}>{s.value}</p>
            <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card variant="elevated" className="p-6 bg-[#1c1c27] border-white/5 shadow-xl mx-1">
        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeCategory === category.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
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
          <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Difficulty</h3>
          <div className="flex flex-wrap gap-2">
            {difficulties.map(difficulty => (
              <button
                key={difficulty}
                onClick={() => setActiveDifficulty(difficulty)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize ${activeDifficulty === difficulty
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Quest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1 pb-12">
        {filteredQuests.map((quest, index) => (
          <Card key={quest.id} variant="elevated" hover className="p-6 flex flex-col bg-[#1c1c27] border-white/5 hover:border-primary/30 transition-all group">
            {/* Card Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl group-hover:scale-110 transition-transform">{quest.icon || '🎯'}</div>
              <div className="flex items-center gap-2">
                {completedQuestIds.has(quest.id) && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 border border-green-400/30 px-2 py-0.5 rounded-full uppercase">
                    <span className="material-symbols-outlined text-sm">check_circle</span> Done
                  </span>
                )}
                <Badge variant={getDifficultyColor(quest.difficulty)} size="sm" className="font-bold uppercase tracking-wider text-[10px]">
                  {quest.difficulty}
                </Badge>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{quest.title}</h3>
            <p className="text-sm text-slate-400 mb-4 flex-1 line-clamp-2">{quest.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {(quest.tags || []).slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-500 text-[10px] font-bold uppercase">
                  {tag}
                </span>
              ))}
            </div>

            {/* Progress */}
            {quest.progress > 0 && (
              <div className="mb-4">
                <ProgressBar value={quest.progress} size="sm" className="h-1 bg-white/5" />
                <p className="text-[10px] font-bold text-primary mt-1 uppercase leading-none">
                  {Math.round(quest.progress)}% COMPLETED
                </p>
              </div>
            )}

            {/* Meta Info Row */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-6 font-bold uppercase tracking-tighter">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>{quest.duration || '20m'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">group</span>
                <span>{quest.completions || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <span className="material-symbols-outlined text-sm">stars</span>
                <span>{quest.xp} XP</span>
              </div>
            </div>

            {/* Action Button */}
            <Link to={`/app/quests/${quest.id}`} className="block">
              <Button 
                variant={completedQuestIds.has(quest.id) ? 'elevated' : 'primary'} 
                className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  completedQuestIds.has(quest.id) ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'shadow-lg shadow-primary/25'
                }`}
              >
                {completedQuestIds.has(quest.id) ? 'Solve Again' : 'Start mission'}
                <span className="material-symbols-outlined text-lg ml-2">rocket_launch</span>
              </Button>
            </Link>
          </Card>
        ))}

        {filteredQuests.length === 0 && (
          <div className="col-span-full py-20 text-center">
             <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">search_off</span>
             <h3 className="text-xl font-bold text-white mb-2">No Quests Found</h3>
             <p className="text-slate-500 mb-8">Try adjusting your filters to find more challenges.</p>
             <Button variant="primary" onClick={() => { setActiveDifficulty('all'); setActiveCategory('all'); }}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestSelection

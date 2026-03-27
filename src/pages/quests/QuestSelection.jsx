import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuestList } from '../../hooks/useQuestList'
import { useUser } from '../../context/UserContext'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'

const QuestSelection = () => {
  const [activeDifficulty, setActiveDifficulty] = useState('all')
  const { quests, loading, error } = useQuestList()
  const { userProgress } = useUser()

  // 1. DEDUPLICATE & NORMALIZE DATA
  const processedQuests = useMemo(() => {
    if (!quests || !Array.isArray(quests)) return []
    
    const unique = new Map()
    quests.forEach(q => {
      // Use Title as the unique key if ID is missing or duplicate
      const slug = (q.title || q.id || 'unknown').toString().toLowerCase().trim()
      if (!unique.has(slug)) {
        unique.set(slug, {
          ...q,
          // Force normalize the difficulty field name
          difficulty: q.difficulty || q.Difficulty || 'Medium',
          progress: userProgress[q.id]?.completed ? 100 :
            userProgress[q.id]?.passedTests && userProgress[q.id]?.totalTests
              ? (userProgress[q.id].passedTests / userProgress[q.id].totalTests * 100)
              : 0
        })
      }
    })
    return Array.from(unique.values()).sort((a, b) => (b.xp || 0) - (a.xp || 0))
  }, [quests, userProgress])

  // 2. APPLY FILTER
  const filteredQuests = useMemo(() => {
    const aDiff = activeDifficulty.toLowerCase().trim()
    if (aDiff === 'all') return processedQuests
    
    return processedQuests.filter(q => {
      const qDiff = (q.difficulty || '').toString().toLowerCase().trim()
      return qDiff === aDiff
    })
  }, [processedQuests, activeDifficulty])

  // 3. CALCULATE STATS
  const stats = useMemo(() => ({
    total: processedQuests.length,
    completed: processedQuests.filter(q => q.progress === 100).length,
    inProgress: processedQuests.filter(q => q.progress > 0 && q.progress < 100).length,
    notStarted: processedQuests.filter(q => q.progress === 0).length
  }), [processedQuests])

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
      <div className="max-w-[1400px] mx-auto space-y-8 p-4">
        <div className="h-12 bg-white/5 rounded-2xl animate-pulse w-1/3 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Card key={i} className="h-64 animate-pulse opacity-50" />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <span className="material-symbols-outlined text-red-500 text-6xl mb-4">error</span>
        <h2 className="text-2xl font-bold text-white mb-2">Error Loading Quests</h2>
        <p className="text-slate-400 mb-8">{error}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>Retry Connection</Button>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 sm:space-y-8 animate-fade-in p-1">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link to="/app/academy" className="inline-flex items-center gap-2 text-primary hover:text-blue-400 mb-4 transition-colors font-bold uppercase tracking-widest text-[10px]">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Academy
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Quest Selection <span className="text-gradient">🎯</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Choose your challenge and prove your mastery.</p>
        </div>

        {/* Mini Stats Summary */}
        <div className="flex gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10">
          {[
            { label: 'Total', value: stats.total, color: 'text-white' },
            { label: 'Done', value: stats.completed, color: 'text-green-400' },
            { label: 'Active', value: stats.inProgress, color: 'text-blue-400' },
            { label: 'New', value: stats.notStarted, color: 'text-purple-400' },
          ].map(s => (
            <div key={s.label} className="px-4 py-2 text-center min-w-[70px]">
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Journey Link */}
      <Link to="/app/paths" className="block transform transition-all hover:scale-[1.005] active:scale-[0.995]">
        <Card variant="elevated" className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-primary/20 via-primary/5 to-purple-500/20 border-primary/30 hover:border-primary/50 group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all duration-700">
            <span className="material-symbols-outlined text-[120px] -rotate-12 translate-x-12 translate-y-4">explore</span>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="size-20 rounded-3xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                 <span className="material-symbols-outlined text-4xl">route</span>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase mb-1">Structured Learning Paths</h2>
                <p className="text-slate-300 max-w-lg font-medium">Follow expert-curated journeys to master full-stack domains from zero to hero.</p>
              </div>
            </div>
            <Button variant="primary" className="shadow-xl shadow-primary/30 group-hover:px-12 transition-all h-14 text-base">Explore Paths</Button>
          </div>
        </Card>
      </Link>

      {/* Filter Row */}
      <Card variant="elevated" className="p-4 sm:p-6 bg-[#1c1c27] flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/5 shadow-2xl">
        <div className="flex flex-col w-full sm:w-auto">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Filter by Difficulty</p>
          <div className="flex flex-wrap gap-2">
            {['all', 'easy', 'medium', 'hard', 'expert'].map(difficulty => (
              <button
                key={difficulty}
                onClick={() => setActiveDifficulty(difficulty)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 ${activeDifficulty === difficulty
                  ? 'bg-primary text-white shadow-lg shadow-primary/40 scale-105'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest pr-4">
           <span className="material-symbols-outlined text-sm">info</span>
           Found {filteredQuests.length} Challenges
        </div>
      </Card>

      {/* Quest Grid */}
      {filteredQuests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-12">
          {filteredQuests.map((quest, index) => (
            <Card key={quest.id} variant="elevated" hover className="h-full flex flex-col p-8 bg-[#1c1c27] border border-white/5 hover:border-primary/40 group transition-all duration-300 relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute -top-12 -right-12 size-32 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors" />
               
               {/* Badge & Icon Area */}
               <div className="flex items-start justify-between mb-8 relative z-10">
                 <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center text-4xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-500">
                    {quest.icon || '🎯'}
                 </div>
                 <Badge variant={getDifficultyColor(quest.difficulty)} className="px-3 py-1 font-black uppercase tracking-widest text-[10px]">
                   {quest.difficulty}
                 </Badge>
               </div>

               {/* Content */}
               <div className="relative z-10 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-primary transition-colors leading-tight">
                    {quest.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-8 font-medium line-clamp-2">
                    {quest.description}
                  </p>

                  <div className="mt-auto space-y-6">
                    {/* Tags */}
                    {quest.tags && quest.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {quest.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-500 text-[9px] font-black uppercase tracking-tighter">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta Stats Row */}
                    <div className="grid grid-cols-3 gap-2 pt-6 border-t border-white/5">
                      <div className="text-center">
                        <p className="text-xs font-black text-white">{quest.xp} XP</p>
                        <p className="text-[8px] font-bold text-slate-600 uppercase">Reward</p>
                      </div>
                      <div className="text-center border-x border-white/10">
                         <p className="text-xs font-black text-white">{quest.duration || '20m'}</p>
                         <p className="text-[8px] font-bold text-slate-600 uppercase">Time</p>
                      </div>
                      <div className="text-center">
                         <p className="text-xs font-black text-white">{quest.completions || 0}</p>
                         <p className="text-[8px] font-bold text-slate-600 uppercase">Solved</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {quest.progress > 0 && (
                      <div className="animate-fade-in">
                        <ProgressBar value={quest.progress} className="h-1 bg-white/5" />
                        <div className="flex justify-between mt-1.5">
                           <span className="text-[9px] font-black text-primary uppercase">{Math.round(quest.progress)}% Mastery</span>
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    <Link to={`/app/quests/${quest.id}`} className="block">
                      <Button 
                        variant={quest.progress === 100 ? 'elevated' : 'primary'} 
                        className={`w-full h-14 font-black text-sm uppercase tracking-widest shadow-lg ${
                          quest.progress === 100 ? 'bg-green-600 hover:bg-green-700 text-white' : ''
                        }`}
                      >
                         {quest.progress === 100 ? 'Replay Challenge' : quest.progress > 0 ? 'Resume Quest' : 'Start Mission'}
                         <span className="material-symbols-outlined text-xl ml-2">{quest.progress === 100 ? 'replay' : 'rocket_launch'}</span>
                      </Button>
                    </Link>
                  </div>
               </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card variant="elevated" className="py-24 text-center border-dashed border-2 border-white/5 bg-[#1c1c27]/50">
           <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
             <span className="material-symbols-outlined text-5xl text-primary">search_off</span>
           </div>
           <h3 className="text-2xl font-black text-white mb-2">No Quests Match Found</h3>
           <p className="text-slate-500 mb-8 max-w-md mx-auto">We couldn't find any {activeDifficulty} quests in this category. Try expanding your search horizons.</p>
           <Button variant="primary" onClick={() => setActiveDifficulty('all')}>Show All Quests</Button>
        </Card>
      )}
    </div>
  )
}

export default QuestSelection

import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import { useUser } from '../../context/UserContext'
import { learningPaths } from '../../data/learningPaths'

const AcademyHub = () => {
  const { userProgress } = useUser()

  const stats = [
    { label: 'Completed Quests', value: Object.values(userProgress).filter(p => p.completed).length, icon: 'task_alt', color: 'text-green-500' },
    { label: 'In Progress Paths', value: learningPaths.filter(path => path.questIds.some(id => userProgress[id])).length, icon: 'map', color: 'text-primary' },
    { label: 'Total XP', value: Object.values(userProgress).reduce((acc, curr) => acc + (curr.xp || 0), 0), icon: 'stars', color: 'text-yellow-500' },
  ]

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fade-in px-1">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#1c1c27] p-6 sm:p-8 md:p-12 border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <span className="material-symbols-outlined text-[180px] -rotate-12">school</span>
        </div>
        <div className="relative z-10 max-w-2xl">
          <Badge variant="primary" className="mb-4">Internal Academy</Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4 tracking-tight">
            Master the Art of <span className="text-gradient">Coding</span>
          </h1>
          <p className="text-lg text-slate-400 mb-8 font-medium">
            Your journey from zero to hero. Choose a structured path, tackle standalone quests, or explore deep-dive modules.
          </p>
          <div className="flex flex-wrap gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <span className={`material-symbols-outlined text-sm ${stat.color}`}>{stat.icon}</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">{stat.value} {stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Standalone Quests - PRIMARY FOCUS */}
        <div className="lg:col-span-2 group">
          <Link to="/app/quests">
            <Card variant="elevated" hover className="h-full p-8 border-2 border-transparent group-hover:border-emerald-500/30 transition-all bg-gradient-to-br from-[#0f172a] to-[#1e293b] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-9xl">explore</span>
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="size-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                    <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 px-6 h-12 font-bold rounded-xl transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20 hover:scale-[1.01] active:scale-[0.98]">
                    <span>Start Coding Now</span>
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </div>
                </div>
                
                <h2 className="text-3xl font-black text-white mb-3 tracking-tight uppercase">Quick Quests</h2>
                <p className="text-lg text-slate-300 mb-8 max-w-xl">
                  The heart of CodeQuest. Tackle hundreds of bite-sized coding challenges across Python, JavaScript, Algorithms, and Web Development.
                </p>
                
                <div className="mt-auto grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                  <div className="text-center">
                    <p className="text-2xl font-black text-white">400+</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available</p>
                  </div>
                  <div className="text-center border-x border-white/10 px-6">
                    <p className="text-2xl font-black text-yellow-500">50k+</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">XP to Earn</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-blue-400">Weekly</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Updates</p>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Learning Paths & Modules - SECONDARY FOCUS */}
        <div className="space-y-8">
          <Link to="/app/paths" className="block group">
            <Card variant="elevated" hover className="p-6 border-2 border-transparent group-hover:border-primary/30 transition-all bg-[#1c1c27]">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                  <span className="material-symbols-outlined">map</span>
                </div>
                <h3 className="text-lg font-bold text-white">Learning Paths</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">Follow structured, expert-curated journeys to master specific domains from scratch.</p>
              <div className="w-full h-9 px-4 text-sm inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all text-primary hover:bg-primary/10">
                <span>Explore Paths</span>
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </div>
            </Card>
          </Link>

          <Link to="/app/modules" className="block group">
            <Card variant="elevated" hover className="p-6 border-2 border-transparent group-hover:border-purple-500/30 transition-all bg-[#1c1c27]">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <h3 className="text-lg font-bold text-white">Project Modules</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">Deep-dive into specialized tools and real-world projects with step-by-step guidance.</p>
              <div className="w-full h-9 px-4 text-sm inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all text-purple-400 hover:bg-purple-500/10">
                <span>View Modules</span>
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Featured Notification */}
      <Card variant="elevated" className="p-6 border border-yellow-500/20 bg-yellow-500/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <span className="material-symbols-outlined text-8xl">auto_awesome</span>
        </div>
        <div className="flex items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-yellow-500 text-3xl">lightbulb</span>
              <div>
                <h4 className="font-bold text-white">Personalized Recommendation</h4>
                <p className="text-sm text-slate-400">Your recent interest in algorithms suggests you might enjoy: <span className="font-bold text-yellow-500 italic">"Recursive Maze Solver"</span></p>
              </div>
           </div>
           <Button variant="primary" size="sm" className="bg-yellow-600 hover:bg-yellow-700">Start Challenge</Button>
        </div>
      </Card>
    </div>
  )
}

export default AcademyHub

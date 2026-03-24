import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { pythonModules, getModuleProgress, isModuleUnlocked } from '../../data/pythonLessons'
import { jsModules, getJSModuleProgress, isJSModuleUnlocked } from '../../data/jsLessons'
import { cppModules, getCPPModuleProgress, isCPPModuleUnlocked } from '../../data/cppLessons'
import { javaModules, getJavaModuleProgress, isJavaModuleUnlocked } from '../../data/javaLessons'
import Badge from '../../components/common/Badge'
import ProgressBar from '../../components/common/ProgressBar'
import { useLessonProgress } from '../../hooks/useLessonProgress'
import { useState, useEffect } from 'react'

const TRACK_META = {
  python: {
    label: 'Python',
    icon: '🐍',
    color: 'from-[#3776ab] to-[#ffd43b]',
    glowColor: 'rgba(55, 118, 171, 0.4)',
    modules: pythonModules,
    getProgress: getModuleProgress,
    isUnlocked: isModuleUnlocked,
  },
  js: {
    label: 'JavaScript',
    icon: '⚡',
    color: 'from-[#f7df1e] to-[#ff9800]',
    glowColor: 'rgba(247, 223, 30, 0.3)',
    modules: jsModules,
    getProgress: getJSModuleProgress,
    isUnlocked: isJSModuleUnlocked,
  },
  cpp: {
    label: 'C++',
    icon: '🏗️',
    color: 'from-[#00599c] to-[#659ad2]',
    glowColor: 'rgba(0, 89, 156, 0.4)',
    modules: cppModules,
    getProgress: getCPPModuleProgress,
    isUnlocked: isCPPModuleUnlocked,
  },
  java: {
    label: 'Java',
    icon: '☕',
    color: 'from-[#5382a1] to-[#f89820]',
    glowColor: 'rgba(83, 130, 161, 0.4)',
    modules: javaModules,
    getProgress: getJavaModuleProgress,
    isUnlocked: isJavaModuleUnlocked,
  },
}

const POSITIONS = ['left', 'center', 'right', 'center', 'left', 'center']

const LearnHub = () => {
  const { trackId = 'python' } = useParams()
  const track = TRACK_META[trackId] || TRACK_META.python
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const { completedLessons, getTotalXP } = useLessonProgress(trackId)
  const totalLessons = track.modules.flatMap(m => m.lessons).length
  const completedCount = Object.keys(completedLessons).length
  const overallProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="max-w-[800px] mx-auto space-y-12 pb-24 relative px-4">
      
      {/* Background blobs for depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div 
          className="absolute size-[400px] rounded-full blur-[100px] opacity-20 transition-transform duration-1000"
          style={{ 
            backgroundColor: track.glowColor.replace('0.4', '1'),
            transform: `translate(${mousePos.x / 8}px, ${mousePos.y / 8}px)`
          }}
        />
      </div>

      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
        <div className="flex items-center gap-6">
          <Link to="/app/learn" className="group p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all hover:scale-110 active:scale-90">
            <span className="material-symbols-outlined text-lg">west</span>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-4xl drop-shadow-lg">{track.icon}</span>
              <h1 className="text-3xl font-black text-white tracking-tighter">
                {track.label} <span className="text-primary/80">Journey</span>
              </h1>
            </div>
            <p className="text-slate-500 text-sm font-medium tracking-wide ml-1">CLIMB THE MOUNTAIN OF MASTERY</p>
          </div>
        </div>
        
        {/* Quick XP Summary */}
        <div className="liquid-glass-strong p-4 rounded-3xl border border-white/10 flex items-center gap-4 min-w-[180px]">
          <div className="size-12 rounded-2xl bg-yellow-400/20 flex items-center justify-center border border-yellow-400/30">
            <span className="material-symbols-outlined text-yellow-400 text-2xl animate-glow-pulse">stars</span>
          </div>
          <div>
            <p className="text-2xl font-black text-yellow-400 tracking-tighter">{getTotalXP()} <span className="text-xs text-slate-500 uppercase">XP</span></p>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Global Ranking</p>
          </div>
        </div>
      </div>

      {/* Progress Dashboard */}
      <div className="glass-card-premium p-1 group">
        <div className="rounded-[22px] bg-white/[0.02] p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Current Standing</p>
              <h3 className="text-2xl font-black text-white">Track Progression</h3>
              <p className="text-slate-500 text-sm italic">You've mastered {completedCount} out of {totalLessons} coding nodes.</p>
            </div>
            <div className="relative size-20 shrink-0">
               <svg className="size-full" viewBox="0 0 36 36">
                  <path className="text-white/5 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className={`stroke-current transition-all duration-1000 leading-normal bg-gradient-to-r ${track.color}`} strokeWidth="3" strokeDasharray={`${overallProgress}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" style={{ color: track.glowColor.replace('0.4', '1') }} />
                  <text x="18" y="20.35" className="fill-white text-[8px] font-black text-center" textAnchor="middle">{overallProgress}%</text>
               </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {['Logic', 'Syntax', 'Problem Solving', 'Design'].map((skill, i) => (
               <div key={skill} className="bg-white/5 rounded-2xl p-3 border border-white/5">
                 <p className="text-[9px] font-black text-slate-500 uppercase mb-1">{skill}</p>
                 <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${track.color}`} style={{ width: `${Math.min(100, (overallProgress + (i*10)))}%` }} />
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* The Staircase Path */}
      <div className="relative pt-10">
        {/* Animated Glow Spine */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/5 -translate-x-1/2 rounded-full z-0 overflow-hidden">
           <div 
             className={`absolute top-0 w-full bg-gradient-to-b ${track.color} transition-all duration-1000`} 
             style={{ height: `${overallProgress}%` }}
           />
        </div>

        <div className="space-y-12 relative z-10">
          {track.modules.map((module, index) => {
            const { completed, total } = track.getProgress(module.id, completedLessons)
            const unlocked = track.isUnlocked(index, completedLessons)
            const isComplete = completed === total && total > 0
            const isStarted = completed > 0 && !isComplete
            const isCurrent = unlocked && !isComplete
            const nextLesson = module.lessons.find(l => !completedLessons[l.id])
            const pos = POSITIONS[index % POSITIONS.length]
            
            const offsetClass =
              pos === 'left' ? 'mr-auto ml-0' :
              pos === 'right' ? 'ml-auto mr-0' : 'mx-auto'

            return (
              <div key={module.id} className={`relative flex flex-col items-center animate-slide-up animate-delay-${(index % 5) * 100}`}>
                
                {/* Visual Connector Line */}
                {pos !== 'center' && (
                  <div className={`absolute top-1/2 -translate-y-1/2 h-0.5 w-[calc(50%-144px)] hidden md:block opacity-30 ${
                    isComplete ? 'bg-green-400' : isCurrent ? 'bg-primary' : 'bg-slate-700'
                  } ${pos === 'left' ? 'right-1/2 mr-10' : 'left-1/2 ml-10'}`} />
                )}

                {/* Spine Node Hub */}
                <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group/node cursor-pointer hidden md:flex items-center justify-center`}>
                  <div className={`size-10 rounded-full border-4 transition-all duration-500 ${
                    isComplete ? 'border-green-500/50 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]' :
                    isCurrent ? 'border-primary/50 bg-primary animate-glow-pulse shadow-[0_0_20px_rgba(59,130,246,0.8)]' :
                    unlocked ? 'border-slate-800 bg-slate-700' : 'border-[#1a1a2e] bg-[#0c0c14]'
                  }`} />
                  {isComplete && <span className="absolute text-white material-symbols-outlined text-xs">check</span>}
                  {isCurrent && <span className="absolute size-14 rounded-full border border-primary/20 animate-ping" />}
                </div>

                {/* Module Card */}
                <div className={`w-full max-w-[340px] md:w-80 ${offsetClass}`}>
                  <div className={`group/card glass-card-premium p-1 transition-all duration-500 ${
                    !unlocked ? 'opacity-40 grayscale pointer-events-none' : 'hover:scale-[1.05]'
                  }`}>
                    <div className="p-6 space-y-4">
                       <div className="flex items-start justify-between">
                         <div className={`size-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 bg-gradient-to-br ${module.color} shadow-2xl relative overflow-hidden group-hover/card:animate-float`}>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                            {unlocked ? module.icon : '🔒'}
                         </div>
                         {isComplete && (
                           <div className="liquid-glass px-2 py-1 rounded-lg border border-green-500/20 text-green-400 text-[9px] font-black uppercase flex items-center gap-1">
                             <span className="material-symbols-outlined text-[10px]">done_all</span> Complete
                           </div>
                         )}
                         {isCurrent && (
                           <div className="liquid-glass px-2 py-1 rounded-lg border border-primary/20 text-primary text-[9px] font-black uppercase flex items-center gap-1 animate-pulse">
                             <span className="material-symbols-outlined text-[10px]">bolt</span> Active Now
                           </div>
                         )}
                       </div>

                       <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Module {index + 1}</p>
                         <h3 className="text-lg font-black text-white tracking-tight">{module.title}</h3>
                         <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-2">
                           {module.description}
                         </p>
                       </div>

                       {/* Lesson Status Dots */}
                       <div className="flex gap-1.5 h-1.5">
                         {module.lessons.map(l => (
                           <div key={l.id} className={`flex-1 rounded-full transition-all duration-500 ${
                             completedLessons[l.id] ? `bg-gradient-to-r ${module.color}` : 'bg-white/5 border border-white/5'
                           }`} />
                         ))}
                       </div>

                       {unlocked && (
                         <Link to={`/app/learn/${trackId}/${module.id}/${nextLesson ? nextLesson.id : module.lessons[0].id}`}>
                           <button className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 mt-4 ${
                             isComplete 
                               ? 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10' 
                               : `bg-gradient-to-r ${module.color} text-white hover:brightness-110 active:scale-95`
                           }`}>
                             <span className="material-symbols-outlined text-sm">
                               {isComplete ? 'refresh' : 'play_arrow'}
                             </span>
                             {isComplete ? 'Review Content' : isStarted ? 'Continue Journey' : 'Begin Module'}
                           </button>
                         </Link>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Grand Finale Finish Line */}
        <div className="relative z-10 flex flex-col items-center gap-6 pt-20">
          <div className="relative group">
            <div className={`absolute inset-0 blur-3xl opacity-30 ${
              completedCount === totalLessons ? 'bg-yellow-400' : 'bg-slate-700'
            }`} />
            <div className={`size-24 rounded-3xl rotate-12 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center text-5xl liquid-glass-strong border-2 animate-float ${
              completedCount === totalLessons 
              ? 'border-yellow-400/50 shadow-[0_0_50px_rgba(250,204,21,0.4)]' 
              : 'border-white/5 opacity-30 grayscale'
            }`}>
              🏆
            </div>
          </div>
          <div className="text-center space-y-2">
            <h4 className={`text-xl font-black uppercase tracking-tighter ${
              completedCount === totalLessons ? 'text-yellow-400' : 'text-slate-600'
            }`}>
              Mastery Peak
            </h4>
            <p className="text-slate-500 text-xs font-medium max-w-[200px] mx-auto">
              Finish all modules to unlock the grand certification and special profile badge.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default LearnHub

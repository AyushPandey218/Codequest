import { Link } from 'react-router-dom'
import { pythonModules, getModuleProgress } from '../../data/pythonLessons'
import { jsModules, getJSModuleProgress } from '../../data/jsLessons'
import { cppModules, getCPPModuleProgress } from '../../data/cppLessons'
import { javaModules, getJavaModuleProgress } from '../../data/javaLessons'
import { tsModules, getTSModuleProgress } from '../../data/tsLessons'
import { sqlModules, getSQLModuleProgress } from '../../data/sqlLessons'
import { useLessonProgress } from '../../hooks/useLessonProgress'
import { useState, useEffect } from 'react'

const TRACKS = [
  {
    id: 'python',
    label: 'Python',
    icon: '🐍',
    gradient: 'from-[#3776ab] to-[#ffd43b]',
    glowColor: 'rgba(55, 118, 171, 0.4)',
    tagline: 'The perfect first language',
    description: 'Clean, readable syntax designed for beginners. Used in AI, data science, and automation.',
    uses: ['🤖 AI', '📊 Data', '🔧 Scripting'],
    difficulty: 'Easiest',
    difficultyColor: 'text-green-400',
    modules: pythonModules,
  },
  {
    id: 'js',
    label: 'JavaScript',
    icon: '⚡',
    gradient: 'from-[#f7df1e] to-[#ff9800]',
    glowColor: 'rgba(247, 223, 30, 0.3)',
    tagline: 'The language of the web',
    description: 'Power every website, from buttons to 3D animations and mobile apps.',
    uses: ['🌐 Web', '📱 Mobile', '🎮 Games'],
    difficulty: 'Easy',
    difficultyColor: 'text-yellow-400',
    modules: jsModules,
  },
  {
    id: 'cpp',
    label: 'C++',
    icon: '🏗️',
    gradient: 'from-[#00599c] to-[#659ad2]',
    glowColor: 'rgba(0, 89, 156, 0.4)',
    tagline: 'The choice for performance',
    description: 'Master low-level memory and blazing-fast execution for game engines.',
    uses: ['🎮 Games', '🖥️ Systems', '🛰️ Embedded'],
    difficulty: 'Hard',
    difficultyColor: 'text-red-400',
    modules: cppModules,
  },
  {
    id: 'java',
    label: 'Java',
    icon: '☕',
    gradient: 'from-[#5382a1] to-[#f89820]',
    glowColor: 'rgba(83, 130, 161, 0.4)',
    tagline: 'Enterprise scale power',
    description: 'Learn OOP principles used in Android apps and big corporate systems.',
    uses: ['📱 Android', '🏢 Enterprise', '⚙️ Backend'],
    difficulty: 'Medium',
    difficultyColor: 'text-orange-400',
    modules: javaModules,
  },
  {
    id: 'ts',
    label: 'TypeScript',
    icon: '📘',
    gradient: 'from-[#3178c6] to-[#2b5a97]',
    glowColor: 'rgba(49, 120, 198, 0.4)',
    tagline: 'Type-safe JavaScript',
    description: 'The industry standard for large-scale web apps. Catch bugs before they happen.',
    uses: ['🏗️ Architecture', '🌐 Web', '🛡️ Safety'],
    difficulty: 'Medium',
    difficultyColor: 'text-blue-400',
    modules: tsModules,
  },
  {
    id: 'sql',
    label: 'SQL',
    icon: '🗄️',
    gradient: 'from-[#00758f] to-[#3178c6]',
    glowColor: 'rgba(0, 117, 143, 0.4)',
    tagline: 'Master the data',
    description: 'Learn to query, filter, and join data in relational databases. Essential for any developer.',
    uses: ['📊 Data', '⚙️ Backend', '🏛️ Architecture'],
    difficulty: 'Easy',
    difficultyColor: 'text-green-400',
    modules: sqlModules,
  },
]

const LearnLanding = () => {
  const { completedLessons: pyCompleted, getTotalXP: pyXP } = useLessonProgress('python')
  const { completedLessons: jsCompleted, getTotalXP: jsXP } = useLessonProgress('js')
  const { completedLessons: cppCompleted, getTotalXP: cppXP } = useLessonProgress('cpp')
  const { completedLessons: javaCompleted, getTotalXP: javaXP } = useLessonProgress('java')
  const { completedLessons: tsCompleted, getTotalXP: tsXP } = useLessonProgress('ts')
  const { completedLessons: sqlCompleted, getTotalXP: sqlXP } = useLessonProgress('sql')

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    setMousePos({ x: clientX, y: clientY })
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const getTrackStats = (track) => {
    let completed = {}
    let xp = 0

    if (track.id === 'python') { completed = pyCompleted; xp = pyXP() }
    else if (track.id === 'js') { completed = jsCompleted; xp = jsXP() }
    else if (track.id === 'cpp') { completed = cppCompleted; xp = cppXP() }
    else if (track.id === 'java') { completed = javaCompleted; xp = javaXP() }
    else if (track.id === 'ts') { completed = tsCompleted; xp = tsXP() }
    else if (track.id === 'sql') { completed = sqlCompleted; xp = sqlXP() }

    const totalLessons = track.modules.flatMap(m => m.lessons).length
    const doneCount = Object.keys(completed).length
    return { doneCount, totalLessons, xp }
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-16 pb-20">
      
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div 
          className="absolute size-[500px] rounded-full bg-primary/20 blur-[120px] transition-transform duration-1000 ease-out"
          style={{ transform: `translate(${mousePos.x / 5}px, ${mousePos.y / 5}px)` }}
        />
        <div 
          className="absolute right-0 bottom-0 size-[400px] rounded-full bg-purple-600/10 blur-[100px] transition-transform duration-1000 ease-out"
          style={{ transform: `translate(-${mousePos.x / 10}px, -${mousePos.y / 10}px)` }}
        />
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-6 pt-10 relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-2 animate-fade-in uppercase tracking-wider">
          <span className="material-symbols-outlined text-base">school</span>
          Learn to Code — From Scratch
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight animate-slide-up">
          Pick your first <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-300 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            programming language
          </span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed animate-fade-in animate-delay-200">
          Not sure which to pick? Start with <strong className="text-blue-400">Python</strong> — it's the easiest for beginners. Master one, then conquer the rest!
        </p>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative px-4">
        {TRACKS.map((track, idx) => {
          const { doneCount, totalLessons, xp } = getTrackStats(track)
          const started = doneCount > 0
          const progress = totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0

          return (
            <Link key={track.id} to={`/app/learn/${track.id}`} className={`group animate-slide-up animate-delay-${(idx + 1) * 100}`}>
              <div className="glass-card-premium p-1 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2">
                
                {/* Visual Header */}
                <div className={`relative h-48 rounded-2xl overflow-hidden bg-gradient-to-br ${track.gradient}`}>
                  {/* Mesh Pattern */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]" />
                  <div className="absolute inset-0 opacity-10 bg-grid-pattern" />
                  
                  {/* Floating Icon */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center animate-float">
                    <span className="text-8xl drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">{track.icon}</span>
                    <div className="mt-4 px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
                      <p className="text-white text-xs font-black italic tracking-wide uppercase">{track.tagline}</p>
                    </div>
                  </div>

                  {/* Glass "In Progress" Badge */}
                  {started && (
                    <div className="absolute top-4 right-4 liquid-glass px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/20">
                      <span className="size-2 rounded-full bg-green-400 animate-glow-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                      <span className="text-[10px] font-black text-white uppercase tracking-tighter">In Progress</span>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-black text-white tracking-tighter group-hover:text-primary transition-colors">{track.label}</h2>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md bg-white/5 border border-white/10 ${track.difficultyColor} uppercase tracking-widest`}>
                          {track.difficulty}
                        </span>
                      </div>
                      
                      {/* Milestone Medals */}
                      <div className="flex gap-2 mt-3">
                        {doneCount >= 5 && (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-400/10 border border-slate-400/20 text-[10px] font-black text-slate-300 uppercase animate-float">
                            <span className="material-symbols-outlined text-sm text-slate-400">workspace_premium</span> Silver Elite
                          </div>
                        )}
                        {doneCount >= 10 && (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-[10px] font-black text-yellow-500 uppercase animate-glow-pulse">
                            <span className="material-symbols-outlined text-sm">military_tech</span> Grandmaster
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {track.uses.map(u => (
                          <span key={u} className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-md border border-white/5 uppercase">{u}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-2xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">{xp} <span className="text-xs text-slate-500">XP</span></span>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    {track.description}
                  </p>

                  {/* Enhanced Progress */}
                  {started ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>{doneCount}/{totalLessons} LESSONS REACHED</span>
                        <span className="text-white">{progress}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${track.gradient} shadow-[0_0_15px_${track.glowColor}] transition-all duration-1000`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                       <span className="material-symbols-outlined text-sm">schedule</span>
                       ~12 HOURS OF CONTENT
                    </div>
                  )}

                  {/* Premium Action Button */}
                  <div className={`relative overflow-hidden group/btn w-full py-4 rounded-2xl bg-gradient-to-r ${track.gradient} shadow-2xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3`}>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                    <span className="text-white font-black uppercase tracking-widest text-sm">
                      {started ? 'Resume Journey' : 'Begin Path'}
                    </span>
                    <span className="material-symbols-outlined text-lg">trending_flat</span>
                  </div>
                </div>

                {/* Bottom Glow */}
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 blur-[40px]" 
                  style={{ backgroundColor: track.glowColor.replace('0.4', '1') }}
                />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Footer Card */}
      <div className="px-4">
        <div className="glass-card-premium p-8 flex flex-col md:flex-row items-center gap-8 border-primary/20 bg-primary/5">
          <div className="size-20 rounded-3xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-float">
            <span className="material-symbols-outlined text-4xl text-white">verified</span>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black text-white">The Academy Standard</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
              Each module handles state persistence and XP rewards atomically. Our curriculum is designed by industry pros to get you from <strong className="text-primary">"Hello World"</strong> to building complex systems in just a few weeks.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default LearnLanding

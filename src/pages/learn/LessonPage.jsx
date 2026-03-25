import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { pythonModules } from '../../data/pythonLessons'
import { jsModules } from '../../data/jsLessons'
import { cppModules } from '../../data/cppLessons'
import { javaModules } from '../../data/javaLessons'
import { tsModules } from '../../data/tsLessons'
import { sqlModules } from '../../data/sqlLessons'
import { useLessonProgress } from '../../hooks/useLessonProgress'
import { useUser } from '../../context/UserContext'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../config/firebase'
import { doc, updateDoc, increment } from 'firebase/firestore'
import CodeEditor from '../../components/code/CodeEditor'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import { executeCodePlayground } from '../../utils/codeExecutor'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Markdown / Theory renderer ───────────────────────────────────────────
const TheoryContent = ({ text }) => {
  const parts = []
  const lines = text.split('\n')
  let inCode = false
  let codeLines = []
  let currentText = []

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) {
        parts.push({ type: 'code', content: codeLines.join('\n') })
        codeLines = []
      } else {
        if (currentText.length > 0) {
          parts.push({ type: 'text', content: currentText.join('\n') })
          currentText = []
        }
      }
      inCode = !inCode
    } else if (inCode) {
      codeLines.push(line)
    } else {
      currentText.push(line)
    }
  }
  if (currentText.length > 0) parts.push({ type: 'text', content: currentText.join('\n') })

  const renderTextBlock = (text) =>
    text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black text-white mt-6 mb-3">{line.slice(3)}</h2>
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-slate-200 mt-5 mb-2">{line.slice(4)}</h3>
      if (line.startsWith('> ')) {
        const content = line.slice(2).replace(/`([^`]+)`/g, '<code class="bg-white/10 text-blue-300 px-1 rounded text-sm font-mono">$1</code>')
        return <div key={i} className="border-l-2 border-yellow-500/50 pl-3 my-2 text-xs text-yellow-300 italic" dangerouslySetInnerHTML={{ __html: content }} />
      }
      if (line.startsWith('| ')) {
        const cells = line.split('|').filter(c => c.trim() !== '' && !c.includes('---'))
        if (!cells.length) return null
        return (
          <div key={i} className="flex gap-4 border-b border-white/5 py-1.5">
            {cells.map((c, j) => (
              <span key={j} className={`text-sm flex-1 ${j === 0 ? 'text-slate-300 font-mono' : 'text-slate-400'}`}>{c.trim()}</span>
            ))}
          </div>
        )
      }
      if (line.startsWith('- ')) {
        const content = line.slice(2).replace(/`([^`]+)`/g, '<code class="bg-white/10 text-blue-300 px-1 rounded text-sm font-mono">$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
        return <li key={i} className="ml-6 text-slate-300 text-sm leading-relaxed mb-1 list-disc" dangerouslySetInnerHTML={{ __html: content }} />
      }
      if (line.trim() === '') return <br key={i} />
      const formatted = line
        .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
        .replace(/`([^`]+)`/g, '<code class="bg-white/10 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      return <p key={i} className="text-sm text-slate-300 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: formatted }} />
    })

  return (
    <div className="space-y-1">
      {parts.map((part, i) =>
        part.type === 'code' ? (
          <pre key={i} className="bg-black/50 border border-white/10 rounded-xl p-4 overflow-x-auto my-4">
            <code className="text-sm font-mono text-green-300 whitespace-pre">{part.content}</code>
          </pre>
        ) : (
          <div key={i}>{renderTextBlock(part.content)}</div>
        )
      )}
    </div>
  )
}

// ─── Pyodide Python runner ────────────────────────────────────────────────
let pyodideInstance = null
const getPyodide = async () => {
  if (pyodideInstance) return pyodideInstance
  if (!window.loadPyodide) {
    await new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="pyodide"]')) { resolve(); return }
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
    while (!window.loadPyodide) await new Promise(r => setTimeout(r, 100))
  }
  pyodideInstance = await window.loadPyodide()
  return pyodideInstance
}

const runPython = async (code) => {
  const pyodide = await getPyodide()
  let stdout = ''
  pyodide.setStdout({ batched: (s) => { stdout += s + '\n' } })
  try {
    await pyodide.runPythonAsync(code)
    return { output: stdout.trim(), error: null }
  } catch (err) {
    return { output: null, error: String(err).split('\n').at(-1) || String(err) }
  }
}

// ─── Sandboxed JavaScript runner ─────────────────────────────────────────
const runJavaScript = (code) => {
  const logs = []
  const fakeConsole = {
    log: (...args) => logs.push(args.map(a => {
      if (typeof a === 'object') return JSON.stringify(a)
      return String(a)
    }).join(' ')),
    error: (...args) => logs.push(args.map(String).join(' ')),
    warn: (...args) => logs.push(args.map(String).join(' ')),
  }
  try {
    // eslint-disable-next-line no-new-func
    new Function('console', code)(fakeConsole)
    return { output: logs.join('\n').trim(), error: null }
  } catch (err) {
    return { output: null, error: err.message }
  }
}

// ─── SQL runner (sql.js) ─────────────────────────────────────────────────
let sqlInstance = null
const getSQL = async () => {
  if (sqlInstance) return sqlInstance
  if (!window.initSqlJs) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/sql-wasm.js'
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
  const config = {
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
  }
  sqlInstance = await window.initSqlJs(config)
  return sqlInstance
}

const runSQL = async (code, setupSQL = '') => {
  try {
    const SQL = await getSQL()
    const db = new SQL.Database()
    
    // 1. Run setup SQL (create tables, insert data)
    if (setupSQL) db.run(setupSQL)
    
    // 2. Run user code
    const res = db.exec(code)
    
    if (res.length === 0) return { output: '(Query executed successfully, no data returned)', error: null }
    
    // 3. Format result as a simple text table
    const table = res[0]
    const header = table.columns.join(' | ')
    const rows = table.values.map(v => v.join(' | ')).join('\n')
    return { output: `${header}\n${'-'.repeat(header.length)}\n${rows}`, error: null }
  } catch (err) {
    return { output: null, error: err.message }
  }
}

const runCode = async (code, trackId, lesson = null) => {
  if (trackId === 'js') return runJavaScript(code)
  if (trackId === 'python') return runPython(code)
  if (trackId === 'sql') return runSQL(code, lesson?.setupSQL)
  
  // For C++, Java, etc. use Wandbox via executeCodePlayground
  const langMap = { cpp: 'C++', java: 'Java', ts: 'TypeScript' }
  const result = await executeCodePlayground(code, langMap[trackId] || trackId)
  return { output: result.output, error: result.error }
}

// ─── Get track data ───────────────────────────────────────────────────────
const getTrackData = (trackId, moduleId, lessonId) => {
  let modules = pythonModules
  if (trackId === 'js') modules = jsModules
  else if (trackId === 'cpp') modules = cppModules
  else if (trackId === 'java') modules = javaModules
  else if (trackId === 'ts') modules = tsModules
  else if (trackId === 'sql') modules = sqlModules

  const moduleData = modules.find(m => m.id === moduleId)
  const lesson = moduleData?.lessons.find(l => l.id === lessonId) || null
  return { modules, moduleData, lesson }
}

// ─── Main LessonPage ──────────────────────────────────────────────────────
const LessonPage = () => {
  const { trackId = 'python', moduleId, lessonId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { userData } = useUser()

  const { modules, moduleData, lesson } = getTrackData(trackId, moduleId, lessonId)
  const moduleIndex = modules.findIndex(m => m.id === moduleId)
  const lessonIndex = moduleData?.lessons.findIndex(l => l.id === lessonId) ?? -1

  const { completeLesson, isCompleted } = useLessonProgress(trackId)
  const alreadyDone = lesson ? isCompleted(lesson.id) : false

  const [step, setStep] = useState(0)
  const [tryCode, setTryCode] = useState(lesson?.starterCode || '')
  const [tryOutput, setTryOutput] = useState(null)
  const [tryError, setTryError] = useState(null)
  const [tryRunning, setTryRunning] = useState(false)
  const [challengeCode, setChallengeCode] = useState('// Write your code here\n')
  const [challengeOutput, setChallengeOutput] = useState(null)
  const [challengeError, setChallengeError] = useState(null)
  const [challengeRunning, setChallengeRunning] = useState(false)
  const [challengePassed, setChallengePassed] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [xpAwarded, setXpAwarded] = useState(false)


  useEffect(() => {
    if (lesson) {
      setTryCode(lesson.starterCode || '')
      const starterComment = {
        js: '// Write your code here\n',
        python: '# Write your code here\n',
        cpp: '// Write your code here\n',
        java: '// Write your code here\n',
        ts: '// Write your code here\n'
      }[trackId] || '// Write your code here\n'
      setChallengeCode(starterComment)
      setStep(0)
      setTryOutput(null); setTryError(null)
      setChallengeOutput(null); setChallengeError(null)
      setChallengePassed(false); setShowHint(false); setXpAwarded(false)
    }
  }, [lessonId, moduleId, trackId])

  if (!moduleData || !lesson) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-slate-500 mb-2 block">search_off</span>
          <p className="text-slate-400">Lesson not found.</p>
          <Link to="/app/learn"><Button variant="primary" className="mt-4">Back to Learn</Button></Link>
        </div>
      </div>
    )
  }

  const handleRunTry = async () => {
    setTryRunning(true); setTryOutput(null); setTryError(null)
    const { output, error } = await runCode(tryCode, trackId, lesson)
    setTryOutput(output); setTryError(error); setTryRunning(false)
  }

  const handleRunChallenge = async () => {
    setChallengeRunning(true); setChallengeOutput(null); setChallengeError(null); setChallengePassed(false)
    const { output, error } = await runCode(challengeCode, trackId, lesson)
    setChallengeOutput(output); setChallengeError(error); setChallengeRunning(false)
    
    if (!error && lesson.challenge.testFn(output || '')) {
      setChallengePassed(true)
      
      // TRIGGER REWARDS
      if (!alreadyDone && !xpAwarded) {
        completeLesson(lesson.id)
        setXpAwarded(true)

        // 🎊 Celebration logic
        const isModuleComplete = moduleData.lessons.every(l => 
          l.id === lesson.id || isCompleted(l.id)
        )

        if (isModuleComplete) {
          // Grand Celebration
          const duration = 3 * 1000
          const animationEnd = Date.now() + duration
          const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

          const randomInRange = (min, max) => Math.random() * (max - min) + min

          const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now()
            if (timeLeft <= 0) return clearInterval(interval)

            const particleCount = 50 * (timeLeft / duration)
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
          }, 250)
        } else {
          // Success burst
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#10b981', '#f59e0b']
          })
        }

        if (user?.uid) {
          try { 
            const now = new Date()
            const todayStr = now.toISOString().split('T')[0]
            const currentWeek = `${now.getFullYear()}-W${Math.ceil((now.getDate() + new Date(now.getFullYear(), now.getMonth(), 1).getDay()) / 7)}`
            const currentMonth = `${now.getFullYear()}-${now.getMonth() + 1}`

            const userRef = doc(db, 'users', user.uid)
            const updates = { 
              xp: increment(lesson.xp),
              last_xp_update: todayStr,
              last_week_update: currentWeek,
              last_month_update: currentMonth
            }

            // Time-based XP increments with lazy reset
            if (userData?.last_xp_update !== todayStr) updates.xp_today = lesson.xp
            else updates.xp_today = increment(lesson.xp)

            if (userData?.last_week_update !== currentWeek) updates.xp_weekly = lesson.xp
            else updates.xp_weekly = increment(lesson.xp)

            if (userData?.last_month_update !== currentMonth) updates.xp_monthly = lesson.xp
            else updates.xp_monthly = increment(lesson.xp)

            await updateDoc(userRef, updates) 
          }
          catch (e) { console.error('XP award failed:', e) }
        }
      }
    }
  }

  const getAdjacentLesson = (direction) => {
    const lessons = moduleData.lessons
    const nextInModule = lessons[lessonIndex + direction]
    if (nextInModule) return { moduleId, lessonId: nextInModule.id }
    const nextModule = modules[moduleIndex + direction]
    if (nextModule) {
      const target = direction > 0 ? nextModule.lessons[0] : nextModule.lessons.at(-1)
      return { moduleId: nextModule.id, lessonId: target.id }
    }
    return null
  }

  const prevLesson = getAdjacentLesson(-1)
  const nextLesson = getAdjacentLesson(1)
  
  const trackMap = {
    python: { icon: '🐍', label: 'Python', lang: 'python' },
    js: { icon: '⚡', label: 'JavaScript', lang: 'javascript' },
    cpp: { icon: '🏗️', label: 'C++', lang: 'cpp' },
    java: { icon: '☕', label: 'Java', lang: 'java' },
    ts: { icon: '📘', label: 'TypeScript', lang: 'typescript' },
    sql: { icon: '🗄️', label: 'SQL', lang: 'sql' },
  }
  const { icon: trackIcon, label: trackLabel, lang: editorLanguage } = trackMap[trackId] || trackMap.python

  return (
    <div className="max-w-[900px] mx-auto space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
          <Link to="/app/learn" className="hover:text-white transition-colors">Learn</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span>{trackIcon} {trackLabel}</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-slate-400">{moduleData.title}</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-white font-medium">{lesson.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">+{lesson.xp} XP</Badge>
          {alreadyDone && <Badge variant="success" size="sm"><span className="material-symbols-outlined text-sm mr-1">check_circle</span>Completed</Badge>}
        </div>
      </div>

      {/* Step tabs */}
      <div className="flex gap-2 bg-[#1c1c27] p-1.5 rounded-2xl border border-white/5 w-fit">
        {['📖 Theory', '▶️ Try It', '✅ Challenge'].map((label, i) => (
          <button
            key={i}
            onClick={() => (i <= step || alreadyDone) ? setStep(i) : null}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              step === i ? 'bg-primary text-white shadow-lg shadow-primary/20' :
              i < step || alreadyDone ? 'text-slate-300 hover:text-white hover:bg-white/5' :
              'text-slate-600 cursor-not-allowed'
            }`}
          >{label}</button>
        ))}
      </div>

      {/* ── Theory ─────────────────────────────────────────────── */}
      {step === 0 && (
        <Card variant="elevated" className="p-6 md:p-8">
          <div className="mb-6 pb-5 border-b border-white/5">
            <h1 className="text-2xl font-black text-white">{lesson.title}</h1>
          </div>
          <TheoryContent text={lesson.theory} />
          <div className="mt-8 pt-6 border-t border-white/5">
            <Button variant="primary" icon="arrow_forward" onClick={() => setStep(1)}>
              I understand — Try it!
            </Button>
          </div>
        </Card>
      )}

      {/* ── Try It ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-4">
          <Card variant="elevated" className="overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">code</span>
                <span className="font-bold text-white text-sm">Live {trackLabel} Editor</span>
              </div>
              <Button variant="primary" size="sm" icon={tryRunning ? 'sync' : 'play_arrow'} isLoading={tryRunning} onClick={handleRunTry}>
                {tryRunning ? 'Running…' : 'Run Code'}
              </Button>
            </div>
            <div className="h-56">
              <CodeEditor value={tryCode} onChange={setTryCode} language={editorLanguage} theme="vs-dark" height="100%" />
            </div>
          </Card>
          {(tryOutput !== null || tryError) && (
            <Card variant="elevated" className={`p-4 ${tryError ? 'border-red-500/20 bg-red-500/5' : 'border-green-500/20 bg-green-500/5'}`}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Output</p>
              {tryError
                ? <p className="font-mono text-sm text-red-400">{tryError}</p>
                : <pre className="font-mono text-sm text-green-300 whitespace-pre-wrap">{tryOutput || '(no output)'}</pre>}
            </Card>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(0)}>← Back</Button>
            <Button variant="primary" icon="arrow_forward" onClick={() => setStep(2)}>Ready for the Challenge!</Button>
          </div>
        </div>
      )}

      {/* ── Challenge ──────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-4">
          <Card variant="elevated" className="p-5 bg-indigo-500/5 border-indigo-500/20">
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
                <span className="material-symbols-outlined text-indigo-400 text-lg">quiz</span>
              </div>
              <div>
                <p className="font-bold text-white text-sm mb-1">Your Challenge</p>
                <p className="text-slate-300 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: lesson.challenge.prompt
                      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>')
                      .replace(/`([^`]+)`/g, '<code class="bg-white/10 text-blue-300 px-1 rounded font-mono text-xs">$1</code>')
                  }}
                />
              </div>
            </div>
          </Card>

          {challengePassed && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 p-6 flex items-center justify-between group overflow-hidden relative"
            >
              <div className="flex items-center gap-5 relative z-10">
                <div className="size-14 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/30 shadow-lg shadow-green-500/10">
                  <span className="text-3xl animate-bounce">🎉</span>
                </div>
                <div>
                  <p className="font-black text-white text-xl tracking-tight">Challenge Mastered!</p>
                  <p className="text-green-400 text-sm font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">stars</span>
                    Success Protocol Complete
                  </p>
                </div>
              </div>

              <AnimatePresence>
                {xpAwarded && (
                  <motion.div 
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -40 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-3xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                  >
                    +{lesson.xp} XP
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative background circle */}
              <div className="absolute -right-4 -bottom-4 size-24 bg-green-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </motion.div>
          )}

          <Card variant="elevated" className="overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">code</span>
                <span className="font-bold text-white text-sm">Your Solution</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowHint(!showHint)}
                  className="text-xs font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-yellow-500/10 transition-colors">
                  <span className="material-symbols-outlined text-sm">lightbulb</span>
                  {showHint ? 'Hide' : 'Hint'}
                </button>
                <Button variant="primary" size="sm" icon={challengeRunning ? 'sync' : 'send'} isLoading={challengeRunning} onClick={handleRunChallenge}>
                  {challengeRunning ? 'Checking…' : 'Submit'}
                </Button>
              </div>
            </div>
            {showHint && (
              <div className="px-4 py-3 bg-yellow-500/5 border-b border-yellow-500/20 text-xs text-yellow-300">
                💡 {lesson.challenge.hint}
              </div>
            )}
            <div className="h-56">
              <CodeEditor value={challengeCode} onChange={setChallengeCode} language={editorLanguage} theme="vs-dark" height="100%" />
            </div>
          </Card>

          {(challengeOutput !== null || challengeError) && !challengePassed && (
            <Card variant="elevated" className={`p-4 ${challengeError ? 'border-red-500/20 bg-red-500/5' : 'border-orange-500/20 bg-orange-500/5'}`}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Output</p>
              {challengeError
                ? <p className="font-mono text-sm text-red-400">{challengeError}</p>
                : <>
                    <pre className="font-mono text-sm text-orange-300 whitespace-pre-wrap mb-2">{challengeOutput || '(no output)'}</pre>
                    <p className="text-xs text-orange-400">❌ Not quite — check your output and try again!</p>
                  </>}
            </Card>
          )}

          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
            {challengePassed && nextLesson && (
              <Button variant="primary" icon="arrow_forward"
                onClick={() => navigate(`/app/learn/${trackId}/${nextLesson.moduleId}/${nextLesson.lessonId}`)}>
                Next Lesson →
              </Button>
            )}
            {challengePassed && !nextLesson && (
              <Button variant="primary" icon="school" onClick={() => navigate('/app/learn')}>
                🎓 Track Complete!
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Sidebar lesson list */}
      <Card variant="elevated" className="p-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
          {trackIcon} {moduleData.title}
        </p>
        <div className="space-y-1">
          {moduleData.lessons.map((l) => {
            const done = isCompleted(l.id)
            const isCurrent = l.id === lessonId
            return (
              <Link key={l.id} to={`/app/learn/${trackId}/${moduleId}/${l.id}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                  isCurrent ? 'bg-primary/20 text-primary border border-primary/30' :
                  done ? 'text-green-400 hover:bg-white/5' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}>
                <span className={`material-symbols-outlined text-sm ${done ? 'text-green-400' : isCurrent ? 'text-primary' : 'text-slate-600'}`}>
                  {done ? 'check_circle' : isCurrent ? 'play_circle' : 'radio_button_unchecked'}
                </span>
                <span className="flex-1">{l.title}</span>
                <span className="text-xs font-bold text-slate-600">+{l.xp}xp</span>
              </Link>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

export default LessonPage

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTestCases } from '../../hooks/useTestCases'
import { useClash } from '../../hooks/useClash'
import { useQuest } from '../../hooks/useQuest'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Button from '../../components/common/Button'
import CodeEditor from '../../components/code/CodeEditor'
import { executeCode } from '../../utils/codeExecutor'
import { db } from '../../config/firebase'
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext'
import { getLevelFromXP } from '../../utils/progressStorage'

const LiveCodeClash = () => {
  const { clashId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { clash, players, loading: clashLoading, error: clashError } = useClash(clashId)
  const questId = clash?.questId
  const { quest, loading: questLoading } = useQuest(questId)
  const { testCases, loading: testCasesLoading } = useTestCases(questId)

  const [timeLeft, setTimeLeft] = useState(300)
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript')
  const [monacoLanguage, setMonacoLanguage] = useState('javascript')
  const [activeTab, setActiveTab] = useState('Description')
  const [code, setCode] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [testsPassed, setTestsPassed] = useState(0)
  const [consoleVisible, setConsoleVisible] = useState(true)
  const [showNotification, setShowNotification] = useState(false)
  const [mobileActiveTab, setMobileActiveTab] = useState('editor') // 'problem' or 'editor'

  // Initialize code from quest data
  useEffect(() => {
    if (quest?.starterCode?.[selectedLanguage]) {
      setCode(quest.starterCode[selectedLanguage])
    } else if (quest && !code) {
      setCode('// Your code here')
    }
  }, [quest, selectedLanguage])

  // Map display name to Monaco language string
  useEffect(() => {
    const langMap = {
      'JavaScript': 'javascript',
      'Python3': 'python',
      'C++': 'cpp',
      'Java': 'java'
    }
    setMonacoLanguage(langMap[selectedLanguage] || 'javascript')
  }, [selectedLanguage])

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const { updateScore } = useClash(clashId)

  const handleRunCode = async () => {
    setIsRunning(true)
    setConsoleVisible(true)
    try {
      const result = await executeCode({ code, selectedLanguage, testCases })
      if (result.success) {
        const passed = result.results.passed
        const total = result.results.total
        setTestsPassed(passed)
        // Sync to Firestore for opponent to see
        await updateScore(passed, total)
      } else if (result.error) {
        setTestsPassed(0)
        // Show error in console logic
      }
    } catch (error) {
      console.error('Execution error:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const handleForfeit = () => {
    if (window.confirm('Are you sure you want to forfeit this clash?')) {
      navigate('/app/clash')
    }
  }

  // Final submission logic
  const handleSubmitClash = async () => {
    if (!clashId || !user) return
    try {
      // Mark clash as completed for this user
      // We'll update the clash status to 'completed' if all players are finished
      // For now, just navigate to results where final calculation happens
      navigate(`/app/clash/${clashId}/results`)
    } catch (err) {
      console.error('Error submitting clash:', err)
    }
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (clashLoading || questLoading || testCasesLoading) {
    return (
      <div className="h-screen w-full bg-[#0a0a1a] flex flex-col items-center justify-center gap-6">
        <div className="size-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] animate-pulse">Initializing Arena...</p>
      </div>
    )
  }

  if (clashError || !clash || !quest) {
    return (
      <div className="h-screen w-screen bg-[#0a0a1a] flex flex-col items-center justify-center gap-8 p-6 text-center fixed inset-0">
        <div className="size-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-red-500 text-5xl">warning</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white">Arena Discovery Failed</h2>
          <p className="text-white/40 max-w-md mx-auto leading-relaxed">
            {clashError || "We couldn't locate the clash or quest data needed to start this match."}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/app/clash')}
          className="bg-white/5 border-white/10 text-white hover:bg-white/10 px-10"
        >
          Return to Command Center
        </Button>
      </div>
    )
  }

  const hostPlayer = Object.values(players || {}).find(p => p.isHost)
  const opponentPlayer = Object.values(players || {}).find(p => !p.isHost && p.uid !== user?.uid) ||
    (user?.uid === hostPlayer?.uid ? Object.values(players || {}).find(p => !p.isHost) : hostPlayer)

  return (
    <div className="h-screen w-screen bg-[#0a0a1a] text-white flex flex-col font-sans overflow-hidden fixed inset-0">
      {/* Top Header */}
      <header className="h-16 bg-[#1a1a2e] border-b border-white/5 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="size-7 sm:size-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg sm:text-xl font-bold">code</span>
            </div>
            <div className="hidden xs:block">
              <span className="text-sm font-bold tracking-tight text-white/90">CodeQuest</span>
            </div>
          </div>
          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
          <div className="bg-white/5 px-3 sm:px-4 py-1.5 rounded-full border border-white/10 hidden sm:block">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Round</span>
            <span className="ml-2 text-sm font-bold text-white">1/1</span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-12">
          {/* User Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-white">You</p>
              <p className="text-[10px] font-bold text-primary uppercase">Lvl {user?.level || 1}</p>
            </div>
            <div className="relative">
              <Avatar src={user?.avatar} size="sm" className="sm:size-md ring-2 ring-primary/50" />
            </div>
          </div>

          {/* Timer */}
          <div className="relative group scale-90 sm:scale-100">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl transition-all group-hover:bg-primary/30" />
            <div className="relative bg-[#0f0f1d] border border-white/10 px-4 sm:px-8 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-3xl font-black font-mono tracking-tighter text-white">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Opponent Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <Avatar src={opponentPlayer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${opponentPlayer?.username || 'opponent'}`} size="sm" className="sm:size-md ring-2 ring-orange-500/50" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-black text-white">{opponentPlayer?.username || 'Opponent'}</p>
              <p className="text-[10px] font-bold text-orange-400 uppercase">Lvl {opponentPlayer?.level || '1'}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <span className="material-symbols-outlined text-green-400 text-sm">wifi</span>
            <span className="text-xs font-bold text-green-400 font-mono">24ms</span>
          </div>
          <button onClick={handleForfeit} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
            Forfeit
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex bg-[#1a1a2e] border-b border-white/5 p-1 shrink-0">
        <button
          onClick={() => setMobileActiveTab('problem')}
          className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${mobileActiveTab === 'problem' ? 'bg-primary text-white' : 'text-white/40'}`}
        >
          Problem
        </button>
        <button
          onClick={() => setMobileActiveTab('editor')}
          className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${mobileActiveTab === 'editor' ? 'bg-primary text-white' : 'text-white/40'}`}
        >
          Editor
        </button>
      </div>

      {/* Main split view */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-2 sm:p-4 gap-2 sm:gap-4 w-full">
        {/* Left Panel: Problem info */}
        <section className={`lg:w-[450px] flex flex-col shrink-0 min-h-0 ${mobileActiveTab === 'problem' ? 'flex-1' : 'hidden lg:flex'}`}>
          <Card className="flex-1 flex flex-col overflow-hidden bg-[#14142b]/60 border-white/5 backdrop-blur-md p-0">
            <div className="flex bg-[#0f0f1d]/50 p-1 rounded-t-2xl shrink-0">
              {['Description', 'Solutions', 'Discussion'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-[#1a1a2e] text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-white">{quest.title}</h2>
                <Badge variant="danger" className="bg-orange-500/10 text-orange-500 border-orange-500/20 px-3 py-1 font-black uppercase tracking-widest text-[10px]">{quest.difficulty}</Badge>
              </div>

              <div className="prose prose-invert prose-sm max-w-none space-y-6">
                <div className="text-white/70 leading-relaxed font-medium">
                  {quest.instructions ? (
                    quest.instructions.split('\n').map((line, i) => {
                      if (line.startsWith('## ')) return null;
                      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-white mb-2 mt-4">{line.slice(4)}</h3>
                      if (line.startsWith('- ')) return <li key={i} className="ml-4 text-white/60">{line.slice(2)}</li>
                      if (line.trim() === '') return <div key={i} className="h-2" />
                      return <p key={i} className="mb-2">{line}</p>
                    })
                  ) : (
                    <p>{quest.description}</p>
                  )}
                </div>

                {quest.examples && quest.examples.map((ex, idx) => (
                  <div key={idx} className="space-y-4">
                    <p className="font-bold text-sm uppercase tracking-widest text-white/40">Example {idx + 1}:</p>
                    <div className="bg-[#0f0f1d] rounded-2xl p-6 border border-white/5 space-y-2 font-mono text-xs">
                      <p><span className="text-white/30">Input:</span> <span className="text-white/80">{ex.input}</span></p>
                      <p><span className="text-white/30">Output:</span> <span className="text-green-400">{ex.output}</span></p>
                      {ex.explanation && <p className="text-white/40 mt-2 italic">{ex.explanation}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Right Panel: Editor and console */}
        <section className={`flex-1 flex flex-col gap-2 sm:gap-4 min-w-0 h-full ${mobileActiveTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
          <Card className="flex-1 flex flex-col overflow-hidden bg-[#14142b]/60 border-white/5 backdrop-blur-md p-0">
            <div className="h-10 sm:h-12 border-b border-white/5 flex items-center justify-between px-3 sm:px-4 bg-[#0f0f1d]/50 shrink-0">
              <div className="flex items-center gap-3 sm:gap-4">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-transparent text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary focus:outline-none cursor-pointer"
                >
                  <option value="JavaScript">JS</option>
                  <option value="Python3">PY</option>
                  <option value="C++">C++</option>
                  <option value="Java">JAVA</option>
                </select>
                <button className="hidden sm:flex items-center gap-2 text-white/40 hover:text-white transition-all">
                  <span className="material-symbols-outlined text-sm">settings</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Settings</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/5 px-2 sm:px-3 py-1 rounded-lg border border-white/5">
                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-tighter text-white/40">Opponent</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-2 sm:h-3 w-1 sm:w-1.5 rounded-sm ${i <= (opponentPlayer?.testsPassed || 0) ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-white/5'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative min-h-0 overflow-hidden">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={monacoLanguage}
                theme="vs-dark"
                height="100%"
                options={{
                  fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 14,
                  lineNumbers: 'on',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 20 }
                }}
              />
            </div>

            {/* Console functionality */}
            {consoleVisible && (
              <div className="h-40 sm:h-48 border-t border-white/5 bg-[#0a0a1a]/80 backdrop-blur-xl flex flex-col shrink-0">
                <div className="h-8 sm:h-10 border-b border-white/5 flex items-center justify-between px-3 sm:px-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-white/40 text-[10px] sm:text-sm">terminal</span>
                      <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/80">Console</span>
                    </div>
                    <div className="h-3 sm:h-4 w-[1px] bg-white/10" />
                    <span className="text-[8px] sm:text-[10px] font-bold text-green-400 uppercase tracking-widest">
                      {testsPassed > 0 ? `${testsPassed}/${testCases?.length || 0} Passed` : 'Ready'}
                    </span>
                  </div>
                  <button onClick={() => setConsoleVisible(false)} className="text-white/20 hover:text-white transition-all">
                    <span className="material-symbols-outlined text-xs sm:text-sm">keyboard_arrow_down</span>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[10px]">
                  {isRunning ? (
                    <div className="flex items-center gap-3 animate-pulse text-white/40">
                      <span className="material-symbols-outlined text-sm">sync</span>
                      <span>Executing tests...</span>
                    </div>
                  ) : testsPassed === 0 ? (
                    <p className="text-white/20 italic">No tests executed yet.</p>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-green-400 mb-2 font-black uppercase tracking-widest">[EXECUTION SUCCESSFUL]</p>
                      {testCases?.slice(0, 5).map((test, i) => (
                        <div key={i} className="flex items-center gap-3 text-white/60">
                          <span className={`material-symbols-outlined text-xs ${i < testsPassed ? 'text-green-500' : 'text-red-500'}`}>
                            {i < testsPassed ? 'check_circle' : 'cancel'}
                          </span>
                          <span>Test Case {i + 1}</span>
                          <span className="text-white/20 ml-auto">{i < testsPassed ? 'Passed' : 'Failed'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Controls Bar */}
          <div className="h-14 sm:h-16 flex items-center justify-between px-2 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button onClick={() => setConsoleVisible(!consoleVisible)} variant="outline" size="sm" className="bg-white/5 border-white/10 text-white/60 hover:text-white px-2 sm:px-4 text-[10px] sm:text-xs">
                Console
              </Button>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="secondary"
                onClick={handleRunCode}
                isLoading={isRunning}
                icon="play_arrow"
                size="sm"
                className="bg-white/5 border-white/10 text-white font-black uppercase tracking-widest px-4 sm:px-8 hover:bg-white/10 text-[10px] sm:text-xs"
              >
                Run
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitClash}
                icon="rocket_launch"
                size="sm"
                className="bg-primary shadow-2xl shadow-primary/30 font-black uppercase tracking-widest px-6 sm:px-10 hover:scale-105 transition-transform text-[10px] sm:text-xs"
              >
                Submit
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Notification Overlay */}
      {showNotification && (
        <div className="fixed bottom-24 right-8 max-w-sm animate-slide-in-right z-50">
          <div className="bg-[#1a1a2e]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 group">
            <button
              onClick={() => setShowNotification(false)}
              className="absolute top-2 right-2 size-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
            <div className="relative">
              <Avatar src={opponentPlayer?.avatar} size="md" className="ring-2 ring-orange-500/30" />
              <div className="absolute -top-1 -right-1 size-5 bg-orange-500 rounded-full flex items-center justify-center border-2 border-[#1a1a2e]">
                <span className="material-symbols-outlined text-[10px] text-white font-bold">bolt</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{opponentPlayer?.username}</p>
              <p className="text-xs text-white/60 leading-tight">Just solved Test Case #4! Keep up!</p>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}} />
    </div>
  )
}

export default LiveCodeClash

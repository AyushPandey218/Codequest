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

  const { clash, players, activityFeed, updateScore, addActivity, loading: clashLoading } = useClash(clashId)
  const questId = clash?.questId
  const { quest, loading: questLoading } = useQuest(questId)
  const { testCases } = useTestCases(questId)

  const [timeLeft, setTimeLeft] = useState(300) // 5:00 based on screenshot
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript')
  const [monacoLanguage, setMonacoLanguage] = useState('javascript')
  const [activeTab, setActiveTab] = useState('Description')
  const [code, setCode] = useState(`/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function(root) {
    // Your code goes here
    if (!root) return null;

    let temp = root.left;
    root.left = root.right;
    root.right = temp;

    invertTree(root.left);
    invertTree(root.right);

    return root;
};`)
  const [isRunning, setIsRunning] = useState(false)
  const [testsPassed, setTestsPassed] = useState(0)
  const [consoleVisible, setConsoleVisible] = useState(true)
  const [showNotification, setShowNotification] = useState(true)

  const problem = {
    title: quest?.title || clash?.questTitle || 'Invert Binary Tree',
    difficulty: quest?.difficulty || clash?.difficulty || 'Hard',
    totalTests: testCases?.length || 5,
  }

  // Timer logic
  useEffect(() => {
    if (clash?.status !== 'ongoing' && !clashLoading) {
      // For development/demo, we'll keep the timer running if no clash data
    }
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
  }, [clash?.status, clashLoading])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    try {
      const result = await executeCode({ code, selectedLanguage, testCases })
      if (result.success) {
        setTestsPassed(result.results.passed)
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

  return (
    <div className="h-screen bg-[#0a0a1a] text-white flex flex-col font-sans overflow-hidden">
      {/* Top Header */}
      <header className="h-16 bg-[#1a1a2e] border-b border-white/5 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl font-bold">code</span>
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white/90">CodeQuest</span>
              <span className="text-sm text-white/40 mx-1">/</span>
              <span className="text-sm text-white/60">Clash</span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-white/10 mx-2" />
          <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Round</span>
            <span className="ml-2 text-sm font-bold text-white">1/3</span>
          </div>
        </div>

        <div className="flex items-center gap-12">
          {/* User Status */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-black text-white">You</p>
              <p className="text-[10px] font-bold text-primary uppercase">Lvl 42</p>
            </div>
            <div className="relative">
              <Avatar src={user?.avatar} size="md" className="ring-2 ring-primary/50" />
              <div className="absolute -bottom-1 -right-1 size-3 bg-green-500 rounded-full border-2 border-[#1a1a2e]" />
            </div>
          </div>

          {/* Timer */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl transition-all group-hover:bg-primary/30" />
            <div className="relative bg-[#0f0f1d] border border-white/10 px-8 py-2 rounded-2xl flex items-center gap-3">
              <span className="text-3xl font-black font-mono tracking-tighter text-white">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Opponent Status */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=opponent" size="md" className="ring-2 ring-orange-500/50" />
              <div className="absolute -bottom-1 -right-1 size-3 bg-yellow-500 rounded-full border-2 border-[#1a1a2e]" />
            </div>
            <div>
              <p className="text-sm font-black text-white">DevSlayer99</p>
              <p className="text-[10px] font-bold text-orange-400 uppercase">Lvl 38</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <span className="material-symbols-outlined text-green-400 text-sm">wifi</span>
            <span className="text-xs font-bold text-green-400 font-mono">24ms</span>
          </div>
          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button onClick={handleForfeit} className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
            Forfeit
          </button>
        </div>
      </header>

      {/* Main split view */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Panel: Problem info */}
        <section className="w-[400px] flex flex-col shrink-0">
          <Card className="flex-1 flex flex-col overflow-hidden bg-[#14142b]/60 border-white/5 backdrop-blur-md">
            <div className="flex bg-[#0f0f1d]/50 p-1 rounded-t-2xl">
              {['Description', 'Submissions', 'Discussion'].map(tab => (
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
                <h2 className="text-2xl font-black text-white">{problem.title}</h2>
                <Badge variant="danger" className="bg-orange-500/10 text-orange-500 border-orange-500/20 px-3 py-1 font-black uppercase tracking-widest text-[10px]">Hard</Badge>
              </div>

              <div className="prose prose-invert prose-sm max-w-none space-y-6">
                <p className="text-white/70 leading-relaxed font-medium">
                  Given the <code className="bg-white/5 px-1.5 py-0.5 rounded text-primary">root</code> of a binary tree, invert the tree, and return its root.
                </p>

                <div className="space-y-4">
                  <p className="font-bold text-sm uppercase tracking-widest text-white/40">Example 1:</p>
                  <div className="bg-[#0f0f1d] rounded-2xl p-6 border border-white/5 space-y-6">
                    <div className="flex justify-center py-4">
                      <div className="relative">
                        <div className="size-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">4</div>
                        <div className="absolute top-10 left-[-40px] size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 text-xs">2</div>
                        <div className="absolute top-10 right-[-40px] size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 text-xs">7</div>
                        <div className="absolute top-4 left-[-15px] w-8 h-[2px] bg-white/10 rotate-[-45deg]" />
                        <div className="absolute top-4 right-[-15px] w-8 h-[2px] bg-white/10 rotate-[45deg]" />
                      </div>
                    </div>
                    <div className="space-y-2 font-mono text-xs">
                      <p><span className="text-white/30">Input:</span> <span className="text-white/80">root = [4,2,7,1,3,6,9]</span></p>
                      <p><span className="text-white/30">Output:</span> <span className="text-green-400">[4,7,2,9,6,3,1]</span></p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <p className="font-bold text-sm uppercase tracking-widest text-white/40">Constraints:</p>
                  <ul className="list-disc list-inside text-white/60 space-y-2 text-xs font-medium">
                    <li>The number of nodes in the tree is in the range [0, 100].</li>
                    <li>-100 ≤ Node.val ≤ 100</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Right Panel: Editor and console */}
        <section className="flex-1 flex flex-col gap-4 min-w-0">
          <Card className="flex-1 flex flex-col overflow-hidden bg-[#14142b]/60 border-white/5 backdrop-blur-md p-0">
            <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-[#0f0f1d]/50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 group cursor-pointer hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all">
                  <span className="text-xs font-black uppercase tracking-widest text-white/80">JavaScript</span>
                  <span className="material-symbols-outlined text-white/20 text-sm group-hover:text-white transition-all">expand_more</span>
                </div>
                <button className="flex items-center gap-2 text-white/40 hover:text-white transition-all">
                  <span className="material-symbols-outlined text-sm">settings</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Editor Settings</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-white/40">Opponent</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4].map(i => <div key={i} className={`h-3 w-1.5 rounded-sm ${i <= 4 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-white/5'}`} />)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={monacoLanguage}
                theme="vs-dark"
                height="100%"
                options={{
                  fontSize: 14,
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
              <div className="h-40 border-t border-white/5 bg-[#0a0a1a]/80 backdrop-blur-xl flex flex-col shrink-0">
                <div className="h-10 border-b border-white/5 flex items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-white/40 text-sm">terminal</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Console</span>
                    </div>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">All tests passed (3/3)</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
                  {[
                    { id: 1, time: '4ms' },
                    { id: 2, time: '2ms' },
                    { id: 3, time: '3ms' }
                  ].map(test => (
                    <div key={test.id} className="flex items-center gap-3 animate-fade-in">
                      <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                      <span className="text-white/80">Test Case {test.id}: Passed</span>
                      <span className="text-white/20">({test.time})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Controls Bar */}
          <div className="h-16 flex items-center justify-between px-2 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <kbd className="text-[10px] font-black text-white/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 tracking-widest">⌘</kbd>
                <span className="text-[10px] text-white/20 mx-0.5">+</span>
                <kbd className="text-[10px] font-black text-white/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 tracking-widest">Enter</kbd>
                <span className="text-[10px] font-bold text-white/40 ml-2 uppercase tracking-tighter">to Run</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                onClick={handleRunCode}
                isLoading={isRunning}
                icon="play_arrow"
                className="bg-white/5 border-white/10 text-white font-black uppercase tracking-widest px-8 hover:bg-white/10"
              >
                Run Code
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate(`/app/clash/${clashId}/results`)}
                icon="rocket_launch"
                className="bg-primary shadow-2xl shadow-primary/30 font-black uppercase tracking-widest px-10 hover:scale-105 transition-transform"
              >
                Submit Clash
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
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=opponent" size="md" className="ring-2 ring-orange-500/30" />
              <div className="absolute -top-1 -right-1 size-5 bg-orange-500 rounded-full flex items-center justify-center border-2 border-[#1a1a2e]">
                <span className="material-symbols-outlined text-[10px] text-white font-bold">bolt</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">DevSlayer99</p>
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

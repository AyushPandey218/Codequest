import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTestCases } from '../../hooks/useTestCases'
import { useClash } from '../../hooks/useClash'
import { useQuest } from '../../hooks/useQuest'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'
import CodeEditor from '../../components/code/CodeEditor'
import { getLanguageFilename } from '../../utils/languageExtensions'
import LanguageSelector from '../../components/code/LanguageSelector'
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

  const [timeLeft, setTimeLeft] = useState(600)
  const [selectedLanguage, setSelectedLanguage] = useState('Python3')
  const [monacoLanguage, setMonacoLanguage] = useState('python')
  const [code, setCode] = useState(`def solution(arr):
    # Your code here
    return 0`)
  const [hasUserCode, setHasUserCode] = useState(false)
  const [testsPassed, setTestsPassed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const problem = {
    title: quest?.title || clash?.questTitle || 'Loading...',
    description: quest?.description || 'Please wait while we fetch the problem details.',
    difficulty: quest?.difficulty || clash?.difficulty || 'Medium',
    testCases: quest?.testCases?.length || clash?.players?.[user?.uid]?.totalTests || 5,
  }

  // Timer logic
  useEffect(() => {
    if (clash?.status !== 'ongoing') return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer)
          navigate(`/app/clash/${clashId}/results`)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [clash?.status, clashId, navigate])

  // Sync user stats to Firestore when tests pass
  useEffect(() => {
    if (testsPassed > 0) {
      updateScore(testsPassed, problem.testCases)

      // Notify other players if you pass all tests
      if (testsPassed === problem.testCases) {
        addActivity('passed all tests!', 'emoji_events', 'text-yellow-500')
      }
    }
  }, [testsPassed, problem.testCases])

  // Track if user has modified code
  const handleCodeChange = (newCode) => {
    setCode(newCode)
    if (newCode.trim() !== '') {
      setHasUserCode(true)
    }
  }

  // Handle language change
  const handleLanguageChange = ({ displayName, monacoLanguage, starterTemplate, shouldLoadTemplate }) => {
    setSelectedLanguage(displayName)
    setMonacoLanguage(monacoLanguage)

    // Only load template if user hasn't written code yet
    if (shouldLoadTemplate) {
      setCode(starterTemplate)
      setHasUserCode(false)
    }
  }

  // Listen for Ctrl+Enter keyboard shortcut from Monaco
  useEffect(() => {
    const handleMonacoRunCode = () => {
      handleRunCode()
    }

    window.addEventListener('monaco-run-code', handleMonacoRunCode)
    return () => window.removeEventListener('monaco-run-code', handleMonacoRunCode)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleRunCode = async () => {
    if (!testCases || testCases.length === 0) {
      console.error('No test cases available')
      return
    }

    setIsRunning(true)

    try {
      // Execute code with test cases - pass selectedLanguage
      const result = await executeCode({
        code,
        selectedLanguage,
        testCases
      })

      if (result.success) {
        setTestsPassed(result.results.passed)
      }
    } catch (error) {
      console.error('Execution error:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    if (!user) return
    const finalScore = testsPassed * 25
    const xpReward = Math.min(finalScore, 500) // Cap XP from clash

    // Record submission
    await addDoc(collection(db, 'submissions'), {
      uid: user.uid,
      questId: `clash_${clashId}`,
      questTitle: `Clash: ${problem.title}`,
      score: finalScore,
      timestamp: serverTimestamp(),
      xpEarned: xpReward
    })

    // Update user XP
    const levelBefore = getLevelFromXP(user.xp || 0)
    await updateDoc(doc(db, 'users', user.uid), {
      xp: increment(xpReward)
    })

    addActivity('submitted their solution', 'publish', 'text-blue-400')
    navigate(`/app/clash/${clashId}/results`)
  }

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500 animate-pulse">
              swords
            </span>
            Live Code Clash
          </h1>
          <p className="text-sm text-slate-600 dark:text-text-secondary mt-1">
            {problem.title} • {problem.difficulty}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Timer */}
          <Card variant="elevated" className={`px-6 py-3 ${timeLeft < 60 ? 'animate-pulse' : ''}`}>
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-2xl ${timeLeft < 60 ? 'text-red-500' : 'text-orange-500'}`}>
                timer
              </span>
              <span className={`font-mono text-2xl font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </Card>
          <Button variant="primary" onClick={handleSubmit} icon="flag">
            Submit Solution
          </Button>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
        {/* Left Sidebar - Leaderboard */}
        <Card variant="elevated" className="lg:col-span-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-border-dark">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-yellow-500">leaderboard</span>
              Live Rankings
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 pr-2 space-y-3">
            {sortedPlayers.map((player, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl transition-all ${player.isYou
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-slate-50 dark:bg-[#282839]'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`size-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-slate-400 text-white' :
                      index === 2 ? 'bg-orange-600 text-white' :
                        'bg-slate-200 dark:bg-[#323267] text-slate-600 dark:text-slate-300'
                    }`}>
                    {index + 1}
                  </div>
                  <Avatar src={player.avatar} name={player.username} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {player.username}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-text-secondary">
                      {player.testsPassed}/{problem.testCases} tests
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {player.score}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-text-secondary">
                      pts
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Center - Problem Description & Code Editor */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          {/* Problem Description */}
          <Card variant="elevated" className="p-4 max-h-48 overflow-y-auto pr-2">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  {problem.title}
                </h3>
                <Badge variant="warning" size="sm">{problem.difficulty}</Badge>
              </div>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
              {problem.description}
            </p>
            <div className="space-y-2">
              <div className="p-2 rounded bg-slate-100 dark:bg-[#1c1c27] text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-400">Input:</span>{' '}
                <span className="text-slate-900 dark:text-white">[1, 2, 3, 4, 5]</span><br />
                <span className="text-slate-600 dark:text-slate-400">Output:</span>{' '}
                <span className="text-green-600 dark:text-green-400">15</span>
              </div>
            </div>
          </Card>

          {/* Code Editor */}
          <Card variant="elevated" className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-border-dark">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
                  code
                </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {getLanguageFilename(selectedLanguage)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                  hasUserCode={hasUserCode}
                  currentCode={code}
                />
                <Button variant="outline" size="sm" icon="content_copy">
                  Copy
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
                language={monacoLanguage}
                theme="vs-dark"
                height="100%"
              />
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-border-dark flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm">
                {testsPassed > 0 && (
                  <Badge variant={testsPassed === problem.testCases ? 'success' : 'warning'}>
                    {testsPassed}/{problem.testCases} Tests Passed
                  </Badge>
                )}
              </div>
              <Button
                variant="primary"
                onClick={handleRunCode}
                icon="play_arrow"
                isLoading={isRunning}
                disabled={isRunning}
              >
                {isRunning ? 'Running...' : 'Run Tests'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Sidebar - Activity Feed */}
        <Card variant="elevated" className="lg:col-span-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-border-dark">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-500">notifications</span>
              Activity Feed
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 pr-2 space-y-3">
            {activityFeed.map((activity, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-slate-50 dark:bg-[#282839] text-sm animate-slide-in-right"
              >
                <div className="flex items-start gap-2">
                  <span className={`material-symbols-outlined text-lg ${activity.color}`}>
                    {activity.icon}
                  </span>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-white">
                      <span className="font-bold">{activity.user}</span>
                      {' '}{activity.action}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-text-secondary mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Stats Bar */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <Card variant="elevated" className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-text-secondary">
              Your Score
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              75 pts
            </span>
          </div>
        </Card>
        <Card variant="elevated" className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-text-secondary">
              Tests Passed
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {testsPassed}/{problem.testCases}
            </span>
          </div>
        </Card>
        <Card variant="elevated" className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-text-secondary">
              Your Rank
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              #1
            </span>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LiveCodeClash

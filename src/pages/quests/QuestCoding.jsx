import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuest } from '../../hooks/useQuest'
import { useTestCases } from '../../hooks/useTestCases'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'
import CodeEditor from '../../components/code/CodeEditor'
import { getLanguageFilename } from '../../utils/languageExtensions'
import LanguageSelector from '../../components/code/LanguageSelector'
import { executeCode } from '../../utils/codeExecutor'
import { getLevelFromXP } from '../../utils/progressStorage'
import LevelUpToast from '../../components/common/LevelUpToast'
import { db } from '../../config/firebase'
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'

const QuestCoding = () => {
  const { questId } = useParams()
  const navigate = useNavigate()
  const { user, checkAndAwardAchievements: _deprecated_auth_check } = useAuth()
  const { userStats, submissions, checkAndAwardAchievements } = useUser()

  const [activeTab, setActiveTab] = useState('instructions')
  const [selectedLanguage, setSelectedLanguage] = useState('Python3')
  const [monacoLanguage, setMonacoLanguage] = useState('python')
  const [code, setCode] = useState(`def solution(arr):\n    # Your code here\n    pass`)
  const [hasUserCode, setHasUserCode] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [executionError, setExecutionError] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [completionData, setCompletionData] = useState(null)
  const [levelUpData, setLevelUpData] = useState(null) // { newLevel, xpEarned }

  const alreadyCompleted = userProgress[questId]?.completed

  const { quest, loading: questLoading, error: questError } = useQuest(questId)
  const { testCases, loading: testCasesLoading, error: testCasesError } = useTestCases(questId)

  // Load starter code when quest loads
  useEffect(() => {
    if (quest && quest.starterCode && quest.starterCode[selectedLanguage]) {
      setCode(quest.starterCode[selectedLanguage])
    }
  }, [quest, selectedLanguage])

  const handleRunCode = async () => {
    if (!testCases || testCases.length === 0) {
      setExecutionError('No test cases available for this quest')
      return
    }

    setIsRunning(true)
    setExecutionError(null)
    setTestResults(null)

    try {
      // Execute code with test cases - pass selectedLanguage
      const result = await executeCode({
        code,
        selectedLanguage,
        testCases
      })

      if (result.success) {
        setTestResults(result.results)
      } else {
        setExecutionError(result.error)
      }
    } catch (error) {
      setExecutionError(error.message || 'Failed to execute code')
    } finally {
      setIsRunning(false)
    }
  }

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

  const handleSubmit = async () => {
    if (!testCases || testCases.length === 0) {
      setExecutionError('No test cases available for this quest')
      return
    }
    setIsSubmitting(true)
    setExecutionError(null)
    setTestResults(null)
    try {
      const result = await executeCode({ code, selectedLanguage, testCases })
      if (result.success) {
        setTestResults(result.results)

        // Save submission to Firestore
        if (user?.uid) {
          const submissionData = {
            uid: user.uid,
            questId: questId,
            questTitle: quest?.title || 'Unknown Quest',
            code: code,
            language: selectedLanguage,
            passedTests: result.results.passed,
            totalTests: result.results.total,
            timestamp: serverTimestamp(),
            xpEarned: (result.results.passed === result.results.total && !alreadyCompleted) ? (quest?.xp || 0) : 0
          }
          await addDoc(collection(db, 'submissions'), submissionData)

          if (result.results.passed === result.results.total) {
            // All passed — update user profile in Firestore
            const xpEarned = alreadyCompleted ? 0 : (quest?.xp || 0)
            const levelBefore = getLevelFromXP(userStats?.totalXP || 0)

            // Atomically increment XP in Firestore
            if (xpEarned > 0) {
              await updateDoc(doc(db, 'users', user.uid), {
                xp: increment(xpEarned),
              })

              const newXP = (userStats?.totalXP || 0) + xpEarned
              const levelAfter = getLevelFromXP(newXP)

              // Check for achievements with granular stats
              const isNewCompletion = !alreadyCompleted;

              // Check if this language was already used successfully for this quest
              const previouslySuccessfulInThisLang = submissions.some(s =>
                s.questId === questId &&
                s.language === selectedLanguage &&
                s.passedTests === s.totalTests &&
                s.totalTests > 0
              );

              // Check if this language was ever used successfully anywhere else
              const languageEverUsedSuccessfully = submissions.some(s =>
                s.language === selectedLanguage &&
                s.passedTests === s.totalTests &&
                s.totalTests > 0
              );

              const newLanguagesCount = userStats.languagesUsed + (languageEverUsedSuccessfully ? 0 : 1);

              await checkAndAwardAchievements({
                ...userStats,
                totalXP: newXP,
                level: levelAfter,
                completedQuests: userStats.completedQuests + (isNewCompletion ? 1 : 0),
                expertQuests: userStats.expertQuests + (isNewCompletion && quest.difficulty === 'Expert' ? 1 : 0),
                webQuests: userStats.webQuests + (isNewCompletion && (quest.category === 'Web' || quest.category === 'Web Dev') ? 1 : 0),
                dataQuests: userStats.dataQuests + (isNewCompletion && (quest.category === 'Data' || quest.category === 'Data Analysis') ? 1 : 0),
                algoQuests: userStats.algoQuests + (isNewCompletion && (quest.category === 'Algorithms' || quest.category === 'DSA') ? 1 : 0),
                languagesUsed: newLanguagesCount
              })

              setCompletionData({
                xpEarned,
                xpAfter: newXP,
                alreadyCompleted: alreadyCompleted
              })
              setShowSuccessModal(true)

              if (levelAfter > levelBefore) {
                setTimeout(() => {
                  setLevelUpData({ newLevel: levelAfter, xpEarned })
                }, 1200)
              }
            } else {
              setCompletionData({
                xpEarned: 0,
                xpAfter: userStats?.totalXP || 0,
                alreadyCompleted: true
              })
              setShowSuccessModal(true)
            }
          }
        }
      } else {
        setExecutionError(result.error)
      }
    } catch (error) {
      console.error('Submission error:', error)
      setExecutionError(error.message || 'Failed to execute code')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = questLoading || testCasesLoading
  const error = questError || testCasesError

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="h-10 bg-slate-200 dark:bg-[#282839] rounded animate-pulse w-1/3"></div>
          <div className="h-10 bg-slate-200 dark:bg-[#282839] rounded animate-pulse w-48"></div>
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card variant="elevated" className="p-6">
            <div className="h-96 bg-slate-200 dark:bg-[#282839] rounded animate-pulse"></div>
          </Card>
          <Card variant="elevated" className="p-6">
            <div className="h-96 bg-slate-200 dark:bg-[#282839] rounded animate-pulse"></div>
          </Card>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center max-w-[1600px] mx-auto">
        <Card variant="elevated" className="p-8 text-center max-w-md">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Failed to Load Quest
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <Link to="/app/quests">
            <Button variant="primary">Back to Quests</Button>
          </Link>
        </Card>
      </div>
    )
  }

  if (!quest) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center max-w-[1600px] mx-auto">
        <Card variant="elevated" className="p-8 text-center max-w-md">
          <span className="material-symbols-outlined text-6xl text-slate-400 mb-4">search_off</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Quest Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            The quest you're looking for doesn't exist.
          </p>
          <Link to="/app/quests">
            <Button variant="primary">Browse Quests</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link to="/app/quests">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-[#282839] rounded-lg transition-colors">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
                arrow_back
              </span>
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {quest.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="warning" size="sm">{quest.difficulty}</Badge>
              <span className="text-sm text-slate-600 dark:text-text-secondary">
                +{quest.xp} XP
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {quest.duration && (
            <div className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-[#282839]">
              <span className="material-symbols-outlined text-orange-500 inline-block mr-2">schedule</span>
              <span className="font-mono text-slate-900 dark:text-white font-bold">
                {quest.duration}
              </span>
            </div>
          )}
          <Button
            variant="primary"
            onClick={handleSubmit}
            icon={alreadyCompleted ? 'check_circle' : 'send'}
            isLoading={isSubmitting}
            disabled={isSubmitting || isRunning}
          >
            {isSubmitting ? 'Submitting...' : alreadyCompleted ? 'Resubmit' : 'Submit Quest'}
          </Button>
        </div>
      </div>

      {/* Main Content - Split Pane */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Left Panel - Instructions */}
        <Card variant="elevated" className="flex flex-col overflow-hidden animate-slide-in-left animate-delay-100">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-border-dark">
            {['instructions', 'hints', 'solution'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm capitalize transition-colors ${activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 pr-4">
            {activeTab === 'instructions' && (
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {quest.instructions
                  ? quest.instructions.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-4">{line.slice(3)}</h2>
                    if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-slate-900 dark:text-white mb-2 mt-4">{line.slice(4)}</h3>
                    if (line.startsWith('- ')) return <li key={i} className="ml-4 text-slate-700 dark:text-slate-300">{line.slice(2)}</li>
                    if (line.startsWith('```')) return null
                    if (line.trim() === '') return <br key={i} />
                    return <p key={i} className="text-slate-700 dark:text-slate-300 mb-1">{line}</p>
                  })
                  : <p className="text-slate-600 dark:text-slate-400">No instructions available.</p>
                }
              </div>
            )}

            {activeTab === 'hints' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Hints 💡
                </h2>
                {[
                  'Start with an initial sum of 0',
                  'Iterate through each element in the array',
                  'Add each element to your running sum',
                  'Consider using a for loop or reduce method',
                ].map((hint, index) => (
                  <Card key={index} variant="bordered" className="p-4 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                        lightbulb
                      </span>
                      <div>
                        <p className="font-bold text-sm text-blue-900 dark:text-blue-200 mb-1">
                          Hint {index + 1}
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {hint}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'solution' && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Solution 🎯
                </h2>
                <Card variant="bordered" className="p-4 bg-slate-50 dark:bg-[#1c1c27] mb-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Complete the quest first to unlock the solution!
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    <span className="material-symbols-outlined mr-2">lock</span>
                    Locked
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </Card>

        {/* Right Panel - Code Editor */}
        <div className="flex flex-col gap-4 min-h-0">
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
                <Button variant="outline" size="sm" icon="refresh">
                  Reset
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
                {testResults && (
                  <>
                    <Badge variant={testResults.passed === testResults.total ? 'success' : 'warning'}>
                      {testResults.passed}/{testResults.total} Tests Passed
                    </Badge>
                    <span className="text-slate-600 dark:text-text-secondary">
                      {testResults.executionTime}ms
                    </span>
                  </>
                )}
                {!testResults && !isRunning && (
                  <>
                    <span className="material-symbols-outlined text-lg text-slate-600 dark:text-text-secondary">info</span>
                    <span className="text-slate-600 dark:text-text-secondary">Press Ctrl+Enter to run code</span>
                  </>
                )}
              </div>
              <Button
                variant="primary"
                onClick={handleRunCode}
                icon="play_arrow"
                isLoading={isRunning}
                disabled={isRunning || isSubmitting}
              >
                {isRunning ? 'Running...' : 'Run Tests'}
              </Button>
            </div>
          </Card>

          {/* Error Message */}
          {executionError && (
            <Card variant="elevated" className="p-4 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-2xl">
                  error
                </span>
                <div>
                  <h3 className="font-bold text-red-900 dark:text-red-200 mb-1">
                    Execution Error
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 font-mono">
                    {executionError}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Test Results */}
          {testResults && (
            <Card variant="elevated" className="p-4 max-h-64 overflow-y-auto pr-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Test Results
                </h3>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={testResults.passed === testResults.total ? 'success' : 'danger'}
                  >
                    {testResults.passed}/{testResults.total} Passed
                  </Badge>
                  <span className="text-xs text-slate-600 dark:text-text-secondary">
                    {testResults.executionTime}ms
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {testResults.tests.map((test, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${test.passed
                      ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-slate-900 dark:text-white">
                        {test.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {test.executionTime}ms
                        </span>
                        <span className={`material-symbols-outlined text-lg ${test.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                          {test.passed ? 'check_circle' : 'cancel'}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <p>Input: <code className="bg-slate-200 dark:bg-[#282839] px-1 py-0.5 rounded">{test.input}</code></p>
                      <p>Expected: <code className="bg-slate-200 dark:bg-[#282839] px-1 py-0.5 rounded">{test.expectedOutput}</code></p>
                      <p>Actual: <code className="bg-slate-200 dark:bg-[#282839] px-1 py-0.5 rounded">{test.actualOutput}</code></p>
                      {test.error && (
                        <p className="text-red-600 dark:text-red-400">Error: {test.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* ── Success Modal ─────────────────────────── */}
      {showSuccessModal && completionData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1c1c27] border border-green-500/30 rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl animate-scale-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">Quest Complete!</h2>
            <p className="text-slate-400 mb-6">
              {completionData.alreadyCompleted
                ? 'You already completed this quest — great revision!'
                : `You earned +${completionData.xpEarned} XP!`}
            </p>
            {!completionData.alreadyCompleted && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                <p className="text-green-400 font-bold text-2xl">+{completionData.xpEarned} XP</p>
                <p className="text-slate-400 text-sm mt-1">Total: {completionData.xpAfter} XP</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowSuccessModal(false); navigate('/app/quests') }} className="flex-1">
                Back to Quests
              </Button>
              <Button variant="primary" onClick={() => setShowSuccessModal(false)} className="flex-1">
                Keep Coding
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Level Up Celebration Toast */}
      {levelUpData && (
        <LevelUpToast
          newLevel={levelUpData.newLevel}
          xpEarned={levelUpData.xpEarned}
          onDismiss={() => setLevelUpData(null)}
        />
      )}
    </div>
  )
}

export default QuestCoding

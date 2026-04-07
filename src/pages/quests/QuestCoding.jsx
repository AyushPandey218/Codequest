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
  const { userStats, submissions, userProgress, checkAndAwardAchievements } = useUser()

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
      let result;
      // Run as standard quest
      result = await executeCode({
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
      let result;
      result = await executeCode({ code, selectedLanguage, testCases })
      
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
  }  if (!quest) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center max-w-[1600px] mx-auto px-4">
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
    <div className="h-full lg:h-[calc(100vh-120px)] flex flex-col min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-3">
          <Link to="/app/quests" className="shrink-0">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-[#282839] rounded-lg transition-colors">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
                arrow_back
              </span>
            </button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
              {quest.title}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="warning" size="sm">{quest.difficulty}</Badge>
              <span className="text-xs sm:text-sm text-slate-600 dark:text-text-secondary font-medium">
                +{quest.xp} XP
              </span>
            </div>
          </div>
        </div>
        
        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden bg-[#1c1c27] p-1 rounded-xl border border-white/5">
          {['Instructions', 'Editor', 'Results'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg transition-all ${
                activeTab === tab.toLowerCase() 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-xl mb-0.5">
                {tab === 'Instructions' ? 'description' : tab === 'Editor' ? 'code' : 'terminal'}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab}</span>
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-3">
          {quest.duration && (
            <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#282839] hidden md:flex items-center">
              <span className="material-symbols-outlined text-orange-500 text-lg mr-2">schedule</span>
              <span className="font-mono text-slate-900 dark:text-white font-bold text-sm">
                {quest.duration}
              </span>
            </div>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            icon={alreadyCompleted ? 'check_circle' : 'send'}
            isLoading={isSubmitting}
            disabled={isSubmitting || isRunning}
          >
            {isSubmitting ? 'Submitting...' : alreadyCompleted ? 'Resubmit' : 'Submit'}
          </Button>
        </div>
      </div>

      {/* Main Content - Split Pane (Desktop) or Tabs (Mobile) */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Left Panel - Instructions (Always visible on desktop, tab-dependent on mobile) */}
          <div className={`${activeTab === 'instructions' ? 'flex' : 'hidden lg:flex'} flex-col h-full min-h-0 overflow-hidden`}>
            <Card variant="elevated" className="flex-1 flex flex-col overflow-hidden animate-slide-in-left animate-delay-100">
              {/* Internal Tabs */}
              <div className="flex border-b border-slate-200 dark:border-border-dark shrink-0 overflow-x-auto scrollbar-hide">
                {['instructions', 'hints', 'solution'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm capitalize transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                {activeTab === 'instructions' && (
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    {quest.instructions
                      ? quest.instructions.split('\n').map((line, i) => {
                        if (line.startsWith('## ')) return <h2 key={i} className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-4">{line.slice(3)}</h2>
                        if (line.startsWith('### ')) return <h3 key={i} className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 mt-4">{line.slice(4)}</h3>
                        if (line.startsWith('- ')) return <li key={i} className="ml-4 text-sm sm:text-base text-slate-700 dark:text-slate-300">{line.slice(2)}</li>
                        if (line.startsWith('```')) return null
                        if (line.trim() === '') return <br key={i} />
                        return <p key={i} className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">{line}</p>
                      })
                      : (
                        <div className="py-8 text-center bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                           <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">description_off</span>
                           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Mission Details Missing</h3>
                           <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                             The briefing for this mission hasn't been uploaded yet. Check your dashboard for mission-specific objectives.
                           </p>
                        </div>
                      )
                    }
                  </div>
                )}

                {activeTab === 'hints' && (
                  <div className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                       Hints <span className="text-xl">💡</span>
                    </h2>
                    {(quest.hints || [
                      'Break the problem down into smaller steps',
                      'Think about the edge cases for the input',
                      'Consider the time complexity of your approach'
                    ]).map((hint, index) => (
                      <Card key={index} variant="bordered" className="p-4 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 shrink-0">
                            lightbulb
                          </span>
                          <div>
                            <p className="font-bold text-xs sm:text-sm text-blue-900 dark:text-blue-200 mb-1">
                              Hint {index + 1}
                            </p>
                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {hint}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === 'solution' && (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="size-16 rounded-full bg-slate-100 dark:bg-[#282839] flex items-center justify-center mb-4">
                       <span className="material-symbols-outlined text-4xl text-slate-400">lock</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Solution Locked
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs mb-6">
                      Complete the quest first to unlock the master solution and expert explanation!
                    </p>
                    <Button variant="outline" size="sm" disabled>
                      Solve to Unlock
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Panel - Editor & Results */}
          <div className={`${activeTab === 'editor' || activeTab === 'results' ? 'flex' : 'hidden lg:flex'} flex-col h-full min-h-0 gap-4 overflow-hidden`}>
            
            {/* Editor Container */}
            <div className={`${activeTab === 'editor' ? 'flex' : 'hidden lg:flex'} flex-col flex-1 h-full min-h-0`}>
              <Card variant="elevated" className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-200 dark:border-border-dark shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
                      code
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white text-xs sm:text-sm">
                      {getLanguageFilename(selectedLanguage)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <LanguageSelector
                      selectedLanguage={selectedLanguage}
                      onLanguageChange={handleLanguageChange}
                      hasUserCode={hasUserCode}
                      currentCode={code}
                    />
                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                       <span className="material-symbols-outlined text-lg sm:text-xl">refresh</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                  <CodeEditor
                    value={code}
                    onChange={handleCodeChange}
                    language={monacoLanguage}
                    theme="vs-dark"
                    height="100%"
                  />
                  
                  {/* Floating Action Button (Mobile Only) */}
                  <div className="lg:hidden absolute bottom-4 right-4 flex flex-col gap-2 z-20">
                    <button 
                      onClick={handleRunCode}
                      disabled={isRunning || isSubmitting}
                      className="size-14 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/40 active:scale-95 transition-transform disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-3xl">
                        {isRunning ? 'sync' : 'play_arrow'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-border-dark flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs">
                    {!testResults && !isRunning && (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <span className="material-symbols-outlined text-base">keyboard</span>
                        <span className="hidden sm:inline">Ctrl+Enter to run</span>
                        <span className="sm:hidden">Ready</span>
                      </div>
                    )}
                    {isRunning && (
                       <span className="text-primary animate-pulse font-bold uppercase tracking-widest">Running tests...</span>
                    )}
                    {testResults && (
                       <Badge variant={testResults.passed === testResults.total ? 'success' : 'warning'} size="sm">
                          {testResults.passed}/{testResults.total} Tests Passed
                       </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleRunCode}
                      icon="play_arrow"
                      isLoading={isRunning}
                      disabled={isRunning || isSubmitting}
                      className="hidden lg:flex"
                    >
                      Run Tests
                    </Button>
                    <div className="lg:hidden flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => { handleRunCode(); setActiveTab('results'); }}
                        isLoading={isRunning}
                        disabled={isRunning || isSubmitting}
                      >
                         Run & View
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Test Cases Panel — always visible */}
            <div className={`${activeTab === 'results' ? 'flex' : 'hidden lg:flex'} flex-col lg:max-h-64 min-h-0`}>
              {/* Execution Error Banner */}
              {executionError && (
                <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/30 mb-2 flex items-start gap-2">
                  <span className="material-symbols-outlined text-red-500 text-base shrink-0 mt-0.5">error</span>
                  <p className="text-xs text-red-400 font-mono break-all">{executionError}</p>
                </div>
              )}

              <Card variant="elevated" className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-3 py-2.5 border-b border-border-dark flex items-center justify-between shrink-0">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-slate-400">science</span>
                    Test Cases
                  </h3>
                  {testResults && (
                    <Badge variant={testResults.passed === testResults.total ? 'success' : 'danger'} size="sm">
                      {testResults.passed}/{testResults.total} PASSED
                    </Badge>
                  )}
                  {isRunning && (
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">Running…</span>
                  )}
                </div>

                {/* Cases List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                  {testCases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 opacity-40">
                      <span className="material-symbols-outlined text-3xl mb-1">science</span>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">No test cases</p>
                    </div>
                  ) : (
                    testCases.map((tc, i) => {
                      const result = testResults?.tests?.[i]
                      const hasResult = !!result
                      const passed = result?.passed

                      return (
                        <div
                          key={tc.id || i}
                          className={`p-3 rounded-lg border transition-colors ${
                            hasResult
                              ? passed
                                ? 'bg-green-500/5 border-green-500/30'
                                : 'bg-red-500/5 border-red-500/30'
                              : 'bg-white/[0.02] border-white/10'
                          }`}
                        >
                          {/* Case header */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-white/80">
                              Test Case {i + 1}
                              {tc.description ? ` — ${tc.description}` : ''}
                            </span>
                            {hasResult && (
                              <span className={`material-symbols-outlined text-base ${passed ? 'text-green-400' : 'text-red-400'}`}>
                                {passed ? 'check_circle' : 'cancel'}
                              </span>
                            )}
                            {isRunning && (
                              <span className="material-symbols-outlined text-base text-slate-500 animate-spin">sync</span>
                            )}
                          </div>

                          {/* Input / Expected / Got */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-500 uppercase font-black w-[52px] shrink-0">Input:</span>
                              <code className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-slate-300 truncate flex-1">{tc.input}</code>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-500 uppercase font-black w-[52px] shrink-0">Expect:</span>
                              <code className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-emerald-400 truncate flex-1">{tc.expectedOutput}</code>
                            </div>
                            {hasResult && !passed && (
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 uppercase font-black w-[52px] shrink-0">Got:</span>
                                <code className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-red-400 truncate flex-1">
                                  {result.actualOutput ?? '—'}
                                </code>
                              </div>
                            )}
                            {hasResult && passed && (
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 uppercase font-black w-[52px] shrink-0">Got:</span>
                                <code className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-emerald-400 truncate flex-1">
                                  {result.actualOutput ?? '—'}
                                </code>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </Card>
            </div>

          </div>
        </div>
      </div>

      {/* ── Success Modal ─────────────────────────── */}
      {showSuccessModal && completionData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="bg-[#1c1c27] border border-green-500/30 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl animate-scale-in">
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">Quest Complete!</h2>
            <p className="text-sm text-slate-400 mb-8 max-w-[240px] mx-auto">
              {completionData.alreadyCompleted
                ? 'Great persistence! You refined your solution perfectly.'
                : `Epic coding! You've earned recognition and XP.`}
            </p>
            
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 mb-8 relative overflow-hidden group">
               <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors" />
               <p className="relative text-green-400 font-black text-4xl tracking-tighter">+{completionData.xpEarned} XP</p>
               <p className="relative text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 font-mono">Total Balance: {completionData.xpAfter} XP</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="md" onClick={() => { setShowSuccessModal(false); navigate('/app/quests') }} className="font-bold">
                Browse
              </Button>
              <Button variant="primary" size="md" onClick={() => setShowSuccessModal(false)} className="font-bold shadow-xl shadow-primary/20">
                Continue
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

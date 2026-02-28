import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import LevelUpToast from '../../components/common/LevelUpToast'
import { getLevelFromXP } from '../../utils/progressStorage'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'
import { useQuest } from '../../hooks/useQuest'
import { db } from '../../config/firebase'
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore'

const DebuggingChallenge = () => {
  const { questId } = useParams()
  const { user } = useAuth()
  const { userProgress } = useUser()
  const { quest, loading, error: questError } = useQuest(questId)

  const [foundBugs, setFoundBugs] = useState([])
  const [attempts, setAttempts] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [levelUpData, setLevelUpData] = useState(null)

  const debugQuestId = `debug_${questId}`
  const alreadyCompleted = userProgress[debugQuestId]?.completed
  const xpReward = quest?.xp || 50

  useEffect(() => {
    if (alreadyCompleted && quest?.debugData?.bugs) {
      setIsCompleted(true)
      setFoundBugs(quest.debugData.bugs.map(b => b.id))
    }
  }, [alreadyCompleted, quest])

  const bugs = quest?.debugData?.bugs || []
  const code = quest?.debugData?.code || ''

  const handleBugClick = (lineNumber) => {
    if (isCompleted) return

    const bug = bugs.find(b => b.line === lineNumber)
    if (bug && !foundBugs.includes(bug.id)) {
      const newFound = [...foundBugs, bug.id]
      setFoundBugs(newFound)
      setAttempts(attempts + 1)

      // Check for completion
      if (newFound.length === bugs.length) {
        handleCompletion()
      }
    } else if (!bug) {
      setAttempts(attempts + 1)
    }
  }

  const handleCompletion = async () => {
    setIsCompleted(true)
    const debugQuestId = `debug_${questId}`

    if (user?.uid) {
      // Save submission
      await addDoc(collection(db, 'submissions'), {
        uid: user.uid,
        questId: debugQuestId,
        questTitle: `Debug: ${quest?.title || 'Unknown'}`,
        attempts,
        timestamp: serverTimestamp(),
        xpEarned: alreadyCompleted ? 0 : xpReward
      })

      if (!alreadyCompleted) {
        const levelBefore = getLevelFromXP(user.xp || 0)
        await updateDoc(doc(db, 'users', user.uid), {
          xp: increment(xpReward)
        })
        const levelAfter = getLevelFromXP((user.xp || 0) + xpReward)

        if (levelAfter > levelBefore) {
          setLevelUpData({ newLevel: levelAfter, xpEarned: xpReward })
        }
      }
    }
  }

  const progress = (foundBugs.length / bugs.length) * 100

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/app/quests/${questId}`}>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-[#282839] rounded-lg transition-colors">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
                arrow_back
              </span>
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Debugging Challenge 🐛
            </h1>
            <p className="text-sm text-slate-600 dark:text-text-secondary mt-1">
              Find and fix all bugs in the code
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={foundBugs.length === bugs.length ? 'success' : 'warning'}>
            {foundBugs.length}/{bugs.length} Bugs Found
          </Badge>
          <Badge variant="info">
            {attempts} Attempts
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <Card variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-slate-900 dark:text-white">
            Challenge Progress
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-slate-200 dark:bg-[#3b3b54] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Code Editor - 2 columns */}
        <div className="lg:col-span-2">
          <Card variant="elevated" className="overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#1c1c27]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
                    bug_report
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    buggy_code.py
                  </span>
                </div>
                <Badge variant="danger" size="sm">
                  Contains {bugs.length} bugs
                </Badge>
              </div>
            </div>

            <div className="bg-[#1e1e2e] p-6">
              <div className="font-mono text-sm">
                {code.split('\n').map((line, index) => {
                  const lineNumber = index + 1
                  const bug = bugs.find(b => b.line === lineNumber)
                  const isBugFound = bug && foundBugs.includes(bug.id)
                  const hasBug = !!bug

                  return (
                    <div
                      key={index}
                      className={`flex gap-4 py-2 px-2 rounded cursor-pointer transition-all ${isBugFound
                        ? 'bg-green-500/20 border-l-4 border-green-500'
                        : hasBug
                          ? 'hover:bg-red-500/10'
                          : 'hover:bg-slate-700/20'
                        }`}
                      onClick={() => handleBugClick(lineNumber)}
                    >
                      <span className="text-slate-600 dark:text-slate-500 select-none w-8 text-right flex-shrink-0">
                        {lineNumber}
                      </span>
                      <pre className="text-[#c5d4dd] whitespace-pre overflow-x-auto flex-1 pb-2">
                        {line}
                      </pre>
                      {isBugFound && (
                        <span className="material-symbols-outlined text-green-500 text-lg">
                          check_circle
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-border-dark">
              <div className="flex items-start gap-3 text-sm">
                <span className="material-symbols-outlined text-orange-500">info</span>
                <div className="text-slate-600 dark:text-text-secondary">
                  <p className="font-medium text-slate-900 dark:text-white mb-1">
                    How to play:
                  </p>
                  <ul className="space-y-1 text-xs">
                    <li>• Click on lines you think contain bugs</li>
                    <li>• Found bugs will be highlighted in green</li>
                    <li>• Read the bug descriptions on the right for hints</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bug List - 1 column */}
        <div className="space-y-6">
          {/* Bug Checklist */}
          <Card variant="elevated" className="p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">bug_report</span>
              Bug Checklist
            </h3>
            <div className="space-y-3">
              {bugs.map((bug) => {
                const isFound = foundBugs.includes(bug.id)
                return (
                  <Card
                    key={bug.id}
                    variant="bordered"
                    className={`p-4 transition-all ${isFound
                      ? 'bg-green-50 dark:bg-green-900/10 border-green-500'
                      : 'bg-slate-50 dark:bg-[#282839]'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`size-6 rounded-full flex items-center justify-center flex-shrink-0 ${isFound
                        ? 'bg-green-500'
                        : 'bg-slate-300 dark:bg-slate-600'
                        }`}>
                        {isFound ? (
                          <span className="material-symbols-outlined text-white text-sm">
                            check
                          </span>
                        ) : (
                          <span className="text-white text-xs font-bold">
                            {bug.id}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={bug.type === 'Syntax Error' ? 'danger' : 'warning'}
                            size="sm"
                          >
                            {bug.type}
                          </Badge>
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            Line {bug.line}
                          </span>
                        </div>
                        {isFound ? (
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                              Bug Found! ✓
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {bug.description}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                              Hint:
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {bug.hint}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </Card>

          {/* Stats */}
          <Card variant="elevated" className="p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-text-secondary">
                  Bugs Found
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {foundBugs.length} / {bugs.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-text-secondary">
                  Attempts Made
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {attempts}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-text-secondary">
                  Accuracy
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {attempts > 0 ? Math.round((foundBugs.length / attempts) * 100) : 0}%
                </span>
              </div>
            </div>
          </Card>

          {/* Complete Button */}
          {foundBugs.length === bugs.length && (
            <Card variant="elevated" className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-500">
              <div className="text-center">
                <span className="material-symbols-outlined text-5xl text-green-500 mb-3 block">
                  check_circle
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  Challenge Complete!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  You found all {bugs.length} bugs! Great job! 🎉
                </p>
                <Link to={`/app/quests/${questId}`}>
                  <Button variant="primary" className="w-full" icon="arrow_forward">
                    Continue Quest
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Level Up Toast */}
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

export default DebuggingChallenge

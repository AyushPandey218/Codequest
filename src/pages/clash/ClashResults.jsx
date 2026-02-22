import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'

const ClashResults = () => {
  const { clashId } = useParams()
  const [activeTab, setActiveTab] = useState('summary')

  const results = {
    yourRank: 1,
    yourScore: 95,
    xpEarned: 150,
    bonusXP: 50,
    matchDuration: '8:23',
    difficulty: 'Medium',
  }

  const players = [
    {
      rank: 1,
      username: 'You',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
      score: 95,
      testsPassed: 5,
      totalTests: 5,
      timeCompleted: '8:23',
      accuracy: 100,
      isYou: true,
    },
    {
      rank: 2,
      username: 'CodeNinja_42',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ninja',
      score: 87,
      testsPassed: 4,
      totalTests: 5,
      timeCompleted: '9:15',
      accuracy: 80,
      isYou: false,
    },
    {
      rank: 3,
      username: 'PyMaster_99',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pymaster',
      score: 78,
      testsPassed: 4,
      totalTests: 5,
      timeCompleted: '9:45',
      accuracy: 80,
      isYou: false,
    },
    {
      rank: 4,
      username: 'AlgoWizard',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wizard',
      score: 65,
      testsPassed: 3,
      totalTests: 5,
      timeCompleted: '10:00',
      accuracy: 60,
      isYou: false,
    },
  ]

  const achievements = [
    { title: 'First Place', icon: 'emoji_events', color: 'text-yellow-500', earned: true },
    { title: 'Perfect Score', icon: 'stars', color: 'text-purple-500', earned: true },
    { title: 'Speed Demon', icon: 'bolt', color: 'text-orange-500', earned: true },
    { title: 'Code Master', icon: 'verified', color: 'text-blue-500', earned: false },
  ]

  const solution = `def solve(nums):
    """
    Calculate the sum of all elements in an array.
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    total = 0
    for num in nums:
        total += num
    return total

# Alternative solution using built-in function
def solve_v2(nums):
    return sum(nums)

# Test cases
print(solve([1, 2, 3, 4, 5]))  # Output: 15
print(solve([]))                # Output: 0
print(solve([-1, -2, 3]))       # Output: 0`

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Victory Banner */}
      <Card variant="elevated" className="overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20" />
        <div className="relative p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center size-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 mb-6 animate-bounce">
            <span className="material-symbols-outlined text-white text-5xl">emoji_events</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3">
            Victory! 🎉
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            You ranked #{results.yourRank} in this Code Clash
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {results.yourScore}
              </p>
              <p className="text-sm text-slate-600 dark:text-text-secondary">
                Score
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-yellow-600 dark:text-yellow-400">
                +{results.xpEarned + results.bonusXP}
              </p>
              <p className="text-sm text-slate-600 dark:text-text-secondary">
                XP Earned
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {results.matchDuration}
              </p>
              <p className="text-sm text-slate-600 dark:text-text-secondary">
                Time
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Achievements Unlocked */}
      <Card variant="elevated" className="p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Achievements Unlocked
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                achievement.earned
                  ? 'bg-slate-50 dark:bg-[#282839] border-slate-200 dark:border-border-dark'
                  : 'bg-slate-100/50 dark:bg-[#1c1c27]/50 border-slate-200/50 dark:border-border-dark/50 opacity-50 grayscale'
              }`}
            >
              <div className={`size-16 rounded-full ${achievement.earned ? 'bg-slate-200 dark:bg-[#323267]' : 'bg-slate-300 dark:bg-[#2a2a3a]'} flex items-center justify-center mx-auto mb-3`}>
                <span className={`material-symbols-outlined text-3xl ${achievement.color}`}>
                  {achievement.icon}
                </span>
              </div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                {achievement.title}
              </p>
              {achievement.earned && (
                <Badge variant="success" size="sm" className="mt-2">
                  Unlocked
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Tabs */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="flex border-b border-slate-200 dark:border-border-dark">
          {['summary', 'rankings', 'solution'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card variant="bordered" className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-green-500">check_circle</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-text-secondary">
                        Tests Passed
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        5/5
                      </p>
                    </div>
                  </div>
                  <ProgressBar value={100} variant="success" />
                </Card>

                <Card variant="bordered" className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-500">speed</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-text-secondary">
                        Accuracy
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        100%
                      </p>
                    </div>
                  </div>
                  <ProgressBar value={100} variant="primary" />
                </Card>

                <Card variant="bordered" className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-yellow-500">stars</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-text-secondary">
                        Total XP
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        +200
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600 dark:text-text-secondary">
                    <p>Base: +{results.xpEarned} XP</p>
                    <p>Bonus: +{results.bonusXP} XP</p>
                  </div>
                </Card>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">
                  Performance Breakdown
                </h3>
                <div className="space-y-3">
                  {['Code Quality', 'Efficiency', 'Speed', 'Problem Solving'].map((metric, index) => {
                    const value = [95, 88, 92, 100][index]
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {metric}
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {value}%
                          </span>
                        </div>
                        <ProgressBar value={value} />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Rankings Tab */}
          {activeTab === 'rankings' && (
            <div className="space-y-4">
              {players.map((player) => (
                <Card
                  key={player.rank}
                  variant="bordered"
                  className={`p-4 ${
                    player.isYou ? 'bg-primary/5 border-primary' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className={`size-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                      player.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-600 text-white' :
                      player.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white' :
                      player.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                      'bg-slate-200 dark:bg-[#323267] text-slate-600 dark:text-slate-300'
                    }`}>
                      {player.rank}
                    </div>

                    {/* Avatar & Info */}
                    <Avatar src={player.avatar} name={player.username} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {player.username}
                        {player.isYou && (
                          <Badge variant="primary" size="sm" className="ml-2">You</Badge>
                        )}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-600 dark:text-text-secondary">
                        <span>{player.testsPassed}/{player.totalTests} tests</span>
                        <span>•</span>
                        <span>{player.accuracy}% accuracy</span>
                        <span>•</span>
                        <span>{player.timeCompleted}</span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <p className="text-3xl font-black text-slate-900 dark:text-white">
                        {player.score}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-text-secondary">
                        points
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Solution Tab */}
          {activeTab === 'solution' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Optimal Solution
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-text-secondary mt-1">
                    Your solution matched the optimal approach!
                  </p>
                </div>
                <Button variant="outline" size="sm" icon="content_copy">
                  Copy Solution
                </Button>
              </div>

              <Card variant="bordered" className="overflow-hidden">
                <div className="bg-[#1e1e2e] p-6 pb-4 overflow-x-auto">
                  <pre className="text-[#c5d4dd] text-sm font-mono">
                    {solution}
                  </pre>
                </div>
              </Card>

              <Card variant="bordered" className="p-4 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">
                    lightbulb
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                      Key Insights
                    </h4>
                    <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      <li>• Using a simple loop is the most efficient approach with O(n) time complexity</li>
                      <li>• The built-in sum() function is also acceptable and more Pythonic</li>
                      <li>• Space complexity is O(1) as we only use a single variable</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <Link to="/app/clash">
          <Button variant="primary" size="lg" icon="replay">
            Play Again
          </Button>
        </Link>
        <Link to="/app/dashboard">
          <Button variant="outline" size="lg" icon="home">
            Back to Dashboard
          </Button>
        </Link>
        <Button variant="outline" size="lg" icon="share">
          Share Results
        </Button>
      </div>
    </div>
  )
}

export default ClashResults

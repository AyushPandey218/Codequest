import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Button from '../../components/common/Button'
import { db } from '../../config/firebase'
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext'
import { useQuestList } from '../../hooks/useQuestList'

const CodeClashLobby = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { quests } = useQuestList()
  const [selectedMode, setSelectedMode] = useState('ranked')
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium')
  const [isLobbySearching, setIsLobbySearching] = useState(false)

  const modes = [
    {
      id: 'ranked',
      title: 'Ranked Match',
      description: 'Compete for leaderboard points',
      icon: 'emoji_events',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      id: 'casual',
      title: 'Casual Match',
      description: 'Practice without stakes',
      icon: 'sports_esports',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      id: 'custom',
      title: 'Custom Room',
      description: 'Create private match',
      icon: 'lock',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ]

  const difficulties = ['easy', 'medium', 'hard']

  const activeMatches = [
    {
      id: 1,
      host: 'CodeMaster_99',
      players: 3,
      maxPlayers: 4,
      difficulty: 'medium',
      mode: 'ranked',
      region: 'US-East',
    },
    {
      id: 2,
      host: 'PyDev_Pro',
      players: 2,
      maxPlayers: 4,
      difficulty: 'hard',
      mode: 'ranked',
      region: 'EU-West',
    },
    {
      id: 3,
      host: 'JSNinja_42',
      players: 1,
      maxPlayers: 2,
      difficulty: 'easy',
      mode: 'casual',
      region: 'Asia',
    },
  ]

  const onlinePlayers = [
    { username: 'CodeWizard', level: 15, status: 'In Queue', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wizard' },
    { username: 'AlgoKing', level: 18, status: 'Available', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=king' },
    { username: 'DevQueen', level: 12, status: 'In Match', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=queen' },
    { username: 'BugHunter', level: 14, status: 'Available', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hunter' },
  ]

  const stats = [
    { label: 'Win Rate', value: '68%', icon: 'trophy', color: 'text-yellow-500' },
    { label: 'Total Matches', value: '142', icon: 'swords', color: 'text-blue-500' },
    { label: 'Current Rank', value: '#42', icon: 'leaderboard', color: 'text-green-500' },
    { label: 'Win Streak', value: '5', icon: 'local_fire_department', color: 'text-orange-500' },
  ]

  const handleQuickMatch = async () => {
    if (!user) return
    setIsLobbySearching(true)

    try {
      // 1. Find a quest for this difficulty
      const easyQuests = quests.filter(q => q.difficulty.toLowerCase() === selectedDifficulty)
      if (easyQuests.length === 0) {
        alert('No quests found for this difficulty!')
        setIsLobbySearching(false)
        return
      }
      const randomQuest = easyQuests[Math.floor(Math.random() * easyQuests.length)]

      // 2. Look for open matches (status: waiting, difficulty: selectedDifficulty)
      const q = query(
        collection(db, 'clashes'),
        where('status', '==', 'waiting'),
        where('difficulty', '==', selectedDifficulty),
        where('questId', '==', randomQuest.id)
      )

      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        // Join the first available match
        const matchDoc = querySnapshot.docs[0]
        const clashId = matchDoc.id

        await updateDoc(doc(db, 'clashes', clashId), {
          [`players.${user.uid}`]: {
            username: user.username || 'User',
            avatar: user.avatar || null,
            score: 0,
            testsPassed: 0,
            totalTests: randomQuest.testCases?.length || 5,
            isYou: false // In the hook we derive this correctly
          },
          status: 'ongoing' // Match starts when 2 people join (for now)
        })

        navigate(`/app/clash/${clashId}/live`)
      } else {
        // Create a new match
        const newClash = {
          questId: randomQuest.id,
          questTitle: randomQuest.title,
          difficulty: selectedDifficulty,
          mode: selectedMode,
          status: 'waiting',
          createdAt: serverTimestamp(),
          players: {
            [user.uid]: {
              username: user.username || 'User',
              avatar: user.avatar || null,
              score: 0,
              testsPassed: 0,
              totalTests: randomQuest.testCases?.length || 5,
              isHost: true
            }
          },
          activityFeed: [
            {
              user: 'System',
              action: `Match created by ${user.username || 'User'}`,
              icon: 'info',
              color: 'text-blue-500',
              timestamp: new Date().toISOString()
            }
          ]
        }

        const docRef = await addDoc(collection(db, 'clashes'), newClash)
        navigate(`/app/clash/${docRef.id}/live`)
      }
    } catch (err) {
      console.error('Matchmaking error:', err)
      alert('Failed to find match: ' + err.message)
    } finally {
      setIsLobbySearching(false)
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Code Clash ⚔️
          </h1>
          <p className="text-slate-600 dark:text-text-secondary mt-1">
            Compete with developers worldwide
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#282839]">
            <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              1,234 Online
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} variant="elevated" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-text-secondary">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <span className={`material-symbols-outlined text-3xl ${stat.color}`}>
                {stat.icon}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Match Setup */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mode Selection */}
          <Card variant="elevated" className="p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Select Game Mode
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {modes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${selectedMode === mode.id
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 dark:border-border-dark hover:border-primary/50'
                    }`}
                >
                  <div className={`size-12 rounded-xl ${mode.bgColor} flex items-center justify-center mb-4`}>
                    <span className={`material-symbols-outlined text-2xl ${mode.color}`}>
                      {mode.icon}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                    {mode.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-text-secondary">
                    {mode.description}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          {/* Difficulty Selection */}
          <Card variant="elevated" className="p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Select Difficulty
            </h2>
            <div className="flex gap-3">
              {difficulties.map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`flex-1 px-6 py-4 rounded-xl font-bold capitalize transition-all ${selectedDifficulty === difficulty
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-slate-100 dark:bg-[#282839] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#323267]'
                    }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </Card>

          {/* Quick Match Button */}
          <Card variant="elevated" className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  Ready to Battle?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Find a match and compete for glory
                </p>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleQuickMatch}
                icon="bolt"
                className="group"
                isLoading={isLobbySearching}
                disabled={isLobbySearching}
              >
                {isLobbySearching ? 'Searching...' : 'Quick Match'}
              </Button>
            </div>
          </Card>

          {/* Active Matches */}
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Active Matches
              </h2>
              <Button variant="outline" size="sm" icon="refresh">
                Refresh
              </Button>
            </div>
            <div className="space-y-3">
              {activeMatches.map(match => (
                <div
                  key={match.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#282839] hover:bg-slate-100 dark:hover:bg-[#323267] transition-all cursor-pointer border border-transparent hover:border-primary/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {match.host.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {match.host}'s Room
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={match.mode === 'ranked' ? 'warning' : 'info'} size="sm">
                            {match.mode}
                          </Badge>
                          <Badge variant="default" size="sm">
                            {match.difficulty}
                          </Badge>
                          <span className="text-xs text-slate-600 dark:text-text-secondary">
                            {match.region}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {match.players}/{match.maxPlayers}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-text-secondary">
                          Players
                        </p>
                      </div>
                      <Button variant="primary" size="sm">
                        Join
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Online Players */}
        <div className="space-y-6">
          {/* Online Players */}
          <Card variant="elevated" className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-500">group</span>
              Online Players
            </h3>
            <div className="space-y-3">
              {onlinePlayers.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#282839] transition-all"
                >
                  <Avatar
                    src={player.avatar}
                    name={player.username}
                    size="md"
                    online={player.status === 'Available'}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {player.username}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default" size="sm">
                        Lvl {player.level}
                      </Badge>
                      <span className={`text-xs ${player.status === 'Available' ? 'text-green-600 dark:text-green-400' :
                        player.status === 'In Queue' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-slate-500'
                        }`}>
                        {player.status}
                      </span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-slate-200 dark:hover:bg-[#323267] rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 text-xl">
                      person_add
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Matches */}
          <Card variant="elevated" className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Recent Matches
            </h3>
            <div className="space-y-3">
              {[
                { result: 'win', opponent: 'CodeNinja', score: '95 - 87', time: '2h ago' },
                { result: 'win', opponent: 'DevMaster', score: '92 - 88', time: '5h ago' },
                { result: 'loss', opponent: 'PyExpert', score: '78 - 96', time: '1d ago' },
              ].map((match, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${match.result === 'win'
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        vs {match.opponent}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {match.score} • {match.time}
                      </p>
                    </div>
                    <Badge
                      variant={match.result === 'win' ? 'success' : 'danger'}
                      size="sm"
                    >
                      {match.result.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/app/clash/1/results">
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Matches
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CodeClashLobby

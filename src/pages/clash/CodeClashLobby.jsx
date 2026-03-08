import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Button from '../../components/common/Button'
import { db } from '../../config/firebase'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  limit,
  getDocs
} from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext'
import { useQuestList } from '../../hooks/useQuestList'

const LobbyChat = ({ user }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    const q = query(
      collection(db, 'lobby_messages'),
      orderBy('timestamp', 'desc'),
      limit(50)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse()
      setMessages(msgs)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    try {
      await addDoc(collection(db, 'lobby_messages'), {
        text: newMessage,
        uid: user.uid,
        username: user.username || user.displayName || 'Anonymous',
        avatar: user.avatar || '',
        timestamp: serverTimestamp()
      })
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className="flex flex-col h-[400px] bg-[#0f0f1d]/50 rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Global Chat</span>
        <div className="flex items-center gap-1.5">
          <div className="size-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-green-500/80">LIVE</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3 animate-fade-in text-[12px]">
            <Avatar src={msg.avatar} size="xs" className="shrink-0" />
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="font-bold text-white/90">{msg.username}</span>
                <span className="text-[9px] text-white/20 uppercase">
                  {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '...'}
                </span>
              </div>
              <p className="text-white/60 leading-relaxed font-medium">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-3 bg-white/5 border-t border-white/5">
        <div className="relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Say something to the lobby..."
            className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl py-2 px-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
          />
          <button type="submit" className="absolute right-2 top-1.5 size-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      </form>
    </div>
  )
}

const CodeClashLobby = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { quests } = useQuestList()

  const [selectedMode, setSelectedMode] = useState('ranked')
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium')
  const [isLobbySearching, setIsLobbySearching] = useState(false)
  const [matchmakingTime, setMatchmakingTime] = useState(0)
  const [activeMatches, setActiveMatches] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentMatchId, setCurrentMatchId] = useState(null)
  const [currentMatchData, setCurrentMatchData] = useState(null)
  const [matchFound, setMatchFound] = useState(false)

  const stats = [
    { label: 'Pilot Rating', value: '1,240', icon: 'trending_up', color: 'text-primary' },
    { label: 'Battles Won', value: user?.clashesWon || '142', icon: 'emoji_events', color: 'text-yellow-500' },
    { label: 'Global Rank', value: '#482', icon: 'military_tech', color: 'text-orange-500' },
    { label: 'Total XP Earned', value: user?.xp?.toLocaleString() || '12.4k', icon: 'bolt', color: 'text-blue-500' },
  ]

  const modes = [
    { id: 'ranked', title: 'Ranked Match', description: 'Compete for points', icon: 'emoji_events', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    { id: 'casual', title: 'Casual Match', description: 'Practice without stakes', icon: 'sports_esports', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { id: 'custom', title: 'Custom Room', description: 'Create private match', icon: 'lock', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  ]

  const difficulties = ['easy', 'medium', 'hard']

  useEffect(() => {
    const q = query(
      collection(db, 'clashes'),
      where('status', '==', 'waiting')
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setActiveMatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    let interval
    if (isLobbySearching && !matchFound) {
      interval = setInterval(() => {
        setMatchmakingTime((prev) => prev + 1)
      }, 1000)
    } else {
      setMatchmakingTime(0)
    }
    return () => clearInterval(interval)
  }, [isLobbySearching, matchFound])

  // Listener for the specific match the user is hosting/joining
  useEffect(() => {
    if (!currentMatchId || !isLobbySearching) return

    const unsubscribe = onSnapshot(doc(db, 'clashes', currentMatchId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        const players = data.players || {}
        const playerIds = Object.keys(players)

        if (playerIds.length >= 2) {
          const opponentId = playerIds.find(id => id !== user.uid)
          const opponentData = players[opponentId]
          setCurrentMatchData({ ...data, opponent: opponentData })
          setMatchFound(true)

          // Auto-navigate after a short delay
          setTimeout(() => {
            navigate(`/app/clash/${currentMatchId}/live`)
          }, 3000)
        }
      }
    })

    return () => unsubscribe()
  }, [currentMatchId, isLobbySearching, user?.uid, navigate])

  const handleQuickMatch = async () => {
    if (!user) return
    setIsLobbySearching(true)

    try {
      const filteredQuests = (quests || []).filter(q => q.difficulty.toLowerCase() === selectedDifficulty)
      if (filteredQuests.length === 0) {
        alert('No quests found for this difficulty!')
        setIsLobbySearching(false)
        return
      }
      const randomQuest = filteredQuests[Math.floor(Math.random() * filteredQuests.length)]

      const q = query(
        collection(db, 'clashes'),
        where('status', '==', 'waiting'),
        where('difficulty', '==', selectedDifficulty),
        where('questId', '==', randomQuest.id)
      )

      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const matchDoc = querySnapshot.docs[0]
        const clashId = matchDoc.id
        await updateDoc(doc(db, 'clashes', clashId), {
          [`players.${user.uid}`]: {
            username: user.username || 'User',
            avatar: user.avatar || null,
            level: user.level || 1,
            score: 0,
            testsPassed: 0,
            totalTests: randomQuest.testCases?.length || 5,
            isYou: false
          },
          status: 'ongoing'
        })
        navigate(`/app/clash/${clashId}/live`)
      } else {
        const newClash = {
          questId: randomQuest.id,
          questTitle: randomQuest.title,
          difficulty: selectedDifficulty,
          mode: selectedMode,
          status: 'waiting',
          createdAt: serverTimestamp(),
          hostUid: user.uid,
          hostUsername: user.username || 'User',
          hostAvatar: user.avatar || null,
          hostLevel: user.level || 1,
          players: {
            [user.uid]: {
              username: user.username || 'User',
              avatar: user.avatar || null,
              level: user.level || 1,
              score: 0,
              testsPassed: 0,
              totalTests: randomQuest.testCases?.length || 5,
              isHost: true
            }
          }
        }
        const docRef = await addDoc(collection(db, 'clashes'), newClash)
        setCurrentMatchId(docRef.id)
      }
    } catch (err) {
      console.error('Matchmaking error:', err)
      setIsLobbySearching(false)
    }
  }

  const handleJoinMatch = async (clashId) => {
    if (!user) return
    try {
      await updateDoc(doc(db, 'clashes', clashId), {
        [`players.${user.uid}`]: {
          username: user.username || 'User',
          avatar: user.avatar || null,
          level: user.level || 1,
          score: 0,
          testsPassed: 0,
          totalTests: 5,
          isYou: false
        },
        status: 'ongoing'
      })
      navigate(`/app/clash/${clashId}/live`)
    } catch (error) {
      console.error('Error joining:', error)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isLobbySearching) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a1a] flex flex-col items-center justify-center p-6 animate-fade-in overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] size-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] size-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>

        <div className="w-full max-w-6xl space-y-16 mt-12 z-10">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="size-3 rounded-full bg-primary animate-ping"></div>
                <h1 className="text-5xl font-black text-white tracking-tight">Searching for Pilots...</h1>
              </div>
              <p className="text-slate-400 text-lg font-medium ml-7">Joining the arena for a {selectedDifficulty} duel.</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-40 text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Time Elapsed</p>
                <p className="text-2xl font-black text-white font-mono">{formatTime(matchmakingTime)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-8">
            <div className="md:col-span-5">
              <Card className="bg-[#12122a]/80 backdrop-blur-xl border-white/10 p-10 flex flex-col items-center gap-4">
                <Avatar src={user?.avatar} size="xl" className="size-32 ring-4 ring-primary/50" />
                <h3 className="text-3xl font-black text-white">{user?.username || 'You'}</h3>
                <Badge variant="primary">READY</Badge>
              </Card>
            </div>
            <div className="md:col-span-1 flex justify-center text-4xl font-black text-white/20 italic">VS</div>
            <div className="md:col-span-5">
              {matchFound && currentMatchData?.opponent ? (
                <Card className="bg-[#12122a]/80 backdrop-blur-xl border-primary/50 p-10 flex flex-col items-center gap-4 relative overflow-hidden animate-slide-in-right">
                  <div className="absolute top-4 right-4 bg-green-500/20 text-green-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Match Found</div>
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl"></div>
                    <Avatar src={currentMatchData.opponent.avatar} size="xl" className="size-32 ring-4 ring-green-500/50 relative z-10" />
                    <div className="absolute bottom-0 right-0 size-8 bg-[#1e1e2e] rounded-full border-2 border-green-500 flex items-center justify-center z-20">
                      <span className="text-[10px] font-bold text-white">{currentMatchData.opponent.level || 1}</span>
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-3xl font-black text-white">{currentMatchData.opponent.username}</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Challenger Approached</p>
                  </div>
                  <div className="w-full mt-6 flex flex-col items-center gap-2">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">BATTLE STARTS IN</p>
                    <p className="text-4xl font-black text-white">3s</p>
                  </div>
                </Card>
              ) : (
                <Card className="bg-[#12122a]/40 backdrop-blur-xl border-dashed border-2 border-white/10 p-10 flex flex-col items-center justify-center gap-6 h-[420px]">
                  <div className="size-32 rounded-full border-2 border-slate-700/50 flex items-center justify-center relative">
                    <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
                    <span className="material-symbols-outlined text-4xl text-slate-700 animate-pulse">search</span>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-slate-500">Searching...</h3>
                    <div className="flex gap-1.5 justify-center">
                      <div className="size-2 rounded-full bg-slate-700 animate-bounce"></div>
                      <div className="size-2 rounded-full bg-slate-700 animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="size-2 rounded-full bg-slate-700 animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={() => setIsLobbySearching(false)} variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10">
              Cancel Matchmaking
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-fade-in p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Code Clash <span className="text-primary italic px-1">⚔️</span></h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium mt-2">Elite algorithmic duels for masters</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 bg-white dark:bg-[#12122a] border-slate-200 dark:border-white/5 hover:border-primary/30 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1 group-hover:scale-105 transition-transform">{stat.value}</p>
              </div>
              <div className={`size-14 rounded-2xl bg-white/5 flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-3xl ${stat.color}`}>{stat.icon}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-[2rem] blur-2xl opacity-50" />
            <Card className="relative p-10 bg-[#14142b]/60 border-white/10 backdrop-blur-xl rounded-[2rem]">
              <Badge variant="warning" className="mb-4">WEEKEND SPECIAL</Badge>
              <h2 className="text-4xl font-black text-white mb-4 leading-tight tracking-tighter">
                Algorithm <span className="text-primary tracking-tighter italic">Titan</span> Tournament
              </h2>
              <p className="text-white/60 mb-8 max-w-md font-medium">Earn exclusive legendary badges and double XP this weekend.</p>
              <Button variant="primary" size="lg" className="px-10 py-5 font-black uppercase tracking-widest hover:scale-105 transition-all">Join Event</Button>
            </Card>
          </section>

          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {modes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`p-6 rounded-3xl border-2 transition-all text-left group ${selectedMode === mode.id ? 'border-primary bg-primary/5' : 'border-white/5 bg-[#12122a]'}`}
                >
                  <div className={`size-12 rounded-xl ${mode.bgColor} flex items-center justify-center mb-4`}>
                    <span className={`material-symbols-outlined text-2xl ${mode.color}`}>{mode.icon}</span>
                  </div>
                  <h3 className="font-bold text-white mb-1">{mode.title}</h3>
                  <p className="text-xs text-white/40">{mode.description}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              {difficulties.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${selectedDifficulty === d ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                >
                  {d}
                </button>
              ))}
            </div>

            <Button onClick={handleQuickMatch} fullWidth variant="primary" size="lg" className="h-16 font-black uppercase tracking-widest">
              Launch Quick Battle
            </Button>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-white/90 uppercase tracking-tight">Joinable Rooms</h3>
              <div className="relative">
                <span className="absolute left-3 top-2 material-symbols-outlined text-sm text-white/20">search</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search rooms..."
                  className="bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 w-48 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(activeMatches || [])
                .filter(m => !searchTerm || m.questTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || m.hostUsername?.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((match) => (
                  <Card key={match.id} className="p-4 bg-[#14142b]/60 border-white/5 hover:border-primary/30 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={match.hostAvatar} size="sm" />
                        <div>
                          <p className="text-xs font-black text-white/90">{match.hostUsername}</p>
                          <p className="text-[10px] font-bold text-white/20 uppercase">Level {match.hostLevel || '??'}</p>
                        </div>
                      </div>
                      <Badge variant={match.difficulty === 'hard' ? 'danger' : 'warning'} className="text-[9px]">{match.difficulty}</Badge>
                    </div>
                    <h4 className="font-bold text-sm text-white mb-4 line-clamp-1">{match.questTitle}</h4>
                    <Button onClick={() => handleJoinMatch(match.id)} fullWidth size="sm" variant="outline" className="border-primary/20 text-primary hover:bg-primary hover:text-white">Join Battle</Button>
                  </Card>
                ))}
              {activeMatches.length === 0 && (
                <div className="col-span-2 py-10 text-center border-2 border-dashed border-white/5 rounded-3xl text-white/20 text-xs font-bold uppercase">No pilots waiting. Host your own!</div>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <LobbyChat user={user} />
          <Card className="p-6 bg-[#14142b]/60 border-white/10 backdrop-blur-xl rounded-[1.5rem]">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Active Pilots</h3>
            <div className="space-y-4">
              {[
                { name: 'SkyNet_X', level: 99, status: 'In Duel', color: 'text-primary' },
                { name: 'NullPointer', level: 45, status: 'Matching', color: 'text-yellow-500' },
                { name: 'CryptoDev', level: 22, status: 'Idle', color: 'text-green-500' },
              ].map((player, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`} size="sm" />
                    <div className="absolute -bottom-0.5 -right-0.5 size-2 bg-green-500 rounded-full border border-[#14142b]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white mb-0.5">{player.name}</p>
                    <p className="text-[9px] font-bold text-white/20 uppercase">Level {player.level}</p>
                  </div>
                  <span className={`text-[8px] font-black uppercase ${player.color}`}>{player.status}</span>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}

export default CodeClashLobby

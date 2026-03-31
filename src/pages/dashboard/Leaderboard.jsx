import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLeaderboard } from '../../hooks/useLeaderboard'
import { useUser } from '../../context/UserContext'
import Card from '../../components/common/Card'
import Avatar from '../../components/common/Avatar'
import ProfileQuickView from '../../components/profile/ProfileQuickView'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import { motion, AnimatePresence } from 'framer-motion'

const Leaderboard = () => {
  const { user } = useAuth()
  const [period, setPeriod] = useState('all') // today, weekly, monthly, all
  const { leaderboard, loading, error } = useLeaderboard(period, 50, user?.uid)
  const { userStats } = useUser()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [quickViewUser, setQuickViewUser] = useState(null)

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Normalize data
  const safeNum = (val) => {
    const n = parseFloat(val)
    return isNaN(n) ? 0 : Math.floor(n)
  }

  const normalizedLeaderboard = leaderboard.map(p => ({
    ...p,
    xp: safeNum(p.xp),
    displayXP: safeNum(p.displayXP),
    questsCompleted: safeNum(p.questsCompleted) || safeNum(p.totalCompletedQuests) || 0,
  }))

  const topThree = normalizedLeaderboard.slice(0, 3)
  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean)
  const leaderboardList = normalizedLeaderboard.slice(3)

  const currentUserRank = normalizedLeaderboard.find(p => p.isCurrentUser) || {
    rank: '?',
    username: user?.username || user?.displayName || 'You',
    avatar: user?.avatar || user?.photoURL,
    xp: userStats?.totalXP || 0,
    displayXP: 0,
    questsCompleted: userStats?.completedQuests || 0,
    id: user?.uid,
  }

  const periods = [
    { id: 'today', label: 'Today', icon: 'today' },
    { id: 'weekly', label: 'Weekly', icon: 'date_range' },
    { id: 'monthly', label: 'Monthly', icon: 'calendar_month' },
    { id: 'all', label: 'All Time', icon: 'stars' },
  ]

  if (loading && leaderboard.length === 0) {
    return (
      <div className="max-w-[1000px] mx-auto space-y-8 pt-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="size-16 rounded-3xl bg-white/5 animate-pulse" />
          <div className="h-10 w-64 bg-white/5 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-64">
           {[1, 2, 3].map(i => <div key={i} className="glass-card-premium animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-10 pb-24 relative px-4 pt-10">
      
      {/* Dynamic background for depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div 
          className="absolute size-[600px] rounded-full blur-[140px] opacity-10 transition-transform duration-1000 bg-primary"
          style={{ transform: `translate(${mousePos.x / 15}px, ${mousePos.y / 15}px)` }}
        />
        <div className="absolute top-1/4 right-0 size-[400px] rounded-full blur-[120px] opacity-5 bg-purple-500 animate-pulse" />
      </div>

      {/* Header Section */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="material-symbols-outlined text-sm animate-glow-pulse">leaderboard</span>
          Global Rankings Live
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter">
          Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-primary to-purple-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">Legendary</span> Coders
        </h1>
        <p className="text-slate-500 text-sm font-medium tracking-wide">COMPETE WITH MINDS WORLDWIDE. RISE TO THE PINNACLE.</p>
      </div>

      {/* Period Selection Tabs */}
      <div className="flex justify-center">
        <div className="p-1 liquid-glass rounded-2xl border border-white/10 flex gap-1">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                period === p.id 
                ? 'bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-primary/30' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Podium Stage */}
      <div className="relative pt-6">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-8 md:gap-4 lg:gap-8">
          {podiumOrder.map((leader, i) => {
             const isFirst = leader.rank === 1
             const isSecond = leader.rank === 2
             const height = isFirst ? 'h-56' : isSecond ? 'h-44' : 'h-36'
             const colors = isFirst ? 'from-yellow-400/40 to-orange-500/10 border-yellow-400/50 shadow-[0_0_40px_rgba(250,204,21,0.2)]' : 
                            isSecond ? 'from-blue-400/30 to-slate-500/10 border-blue-400/40 shadow-[0_0_30px_rgba(96,165,250,0.15)]' : 
                            'from-orange-600/30 to-red-600/10 border-orange-600/40 shadow-[0_0_30px_rgba(234,88,12,0.15)]'
             
             return (
               <motion.div 
                 key={leader.id}
                 initial={{ opacity: 0, y: 50 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className={`relative flex flex-col items-center group w-full md:w-64`}
               >
                 {/* Floating Avatar Hub */}
                 <div className="relative z-20 mb-6 flex flex-col items-center">
                    {isFirst && <motion.span animate={{ rotate: [0, 10, -10, 0], y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 4 }} className="text-4xl mb-2 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">👑</motion.span>}
                    <div 
                      className="relative cursor-pointer group/avatar"
                      onClick={() => setQuickViewUser(leader)}
                    >
                      <Avatar 
                        src={leader.avatar} 
                        name={leader.username} 
                        size="xl" 
                        ring 
                        ringColor={isFirst ? 'ring-yellow-400' : isSecond ? 'ring-blue-400' : 'ring-orange-600'}
                        className="shadow-2xl group-hover/avatar:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute -bottom-2 right-0 size-8 rounded-full flex items-center justify-center text-white font-black text-sm border-2 shadow-lg ${
                        isFirst ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300' : 
                        isSecond ? 'bg-gradient-to-br from-blue-400 to-indigo-600 border-blue-300' : 
                        'bg-gradient-to-br from-orange-600 to-red-700 border-orange-400'
                      }`}>
                        #{leader.rank}
                      </div>
                    </div>
                    <div onClick={() => setQuickViewUser(leader)} className="mt-4 text-center cursor-pointer group/name">
                      <h3 className="font-black text-white text-lg group-hover/name:text-primary transition-colors">{leader.username}</h3>
                      <p className={`text-[10px] font-black uppercase tracking-[0.2em] drop-shadow-[0_0_10px_currentColor] ${isFirst ? 'text-yellow-400' : isSecond ? 'text-blue-400' : 'text-orange-500'}`}>
                        {leader.displayXP.toLocaleString()} XP
                      </p>
                    </div>
                 </div>

                 {/* The 3D Podium Block */}
                 <div className={`w-full ${height} liquid-glass-strong rounded-[2.5rem] border-2 flex flex-col items-center justify-center relative overflow-hidden hidden md:flex ${colors}`}>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Interior glow */}
                    <div className={`absolute inset-0 opacity-20 blur-3xl ${isFirst ? 'bg-yellow-400' : isSecond ? 'bg-blue-400' : 'bg-orange-600'}`} />
                    
                    <span className={`text-7xl font-black italic relative z-10 drop-shadow-2xl ${isFirst ? 'text-yellow-400' : isSecond ? 'text-blue-400' : 'text-orange-600'}`}>
                      {leader.rank}
                    </span>
                    <div className="mt-2 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] relative z-10">Ascended</div>
                 </div>
               </motion.div>
             )
          })}
        </div>
      </div>

      {/* User Status Bar */}
      <Card variant="elevated" className="p-1 glass-card-premium group relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
        <div className="rounded-[22px] bg-white/[0.02] p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
           <div className="flex items-center gap-6">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-2xl font-black text-white border border-white/20 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                #{currentUserRank.rank}
              </div>
              <Avatar 
                src={currentUserRank.avatar} 
                name={currentUserRank.username} 
                size="lg" 
                ring 
                ringColor="ring-primary/40" 
                className="cursor-pointer hover:ring-primary transition-all active:scale-95"
                onClick={() => setQuickViewUser(currentUserRank)}
              />
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Your Standing</p>
                <h3 className="text-xl font-black text-white">{currentUserRank.username} <span className="text-slate-500 text-xs">(YOU)</span></h3>
              </div>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{currentUserRank.displayXP.toLocaleString()}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Period XP</p>
              </div>
              <div className="text-center border-l border-white/10 pl-8">
                <p className="text-xl font-black text-white">{currentUserRank.questsCompleted}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total Quests</p>
              </div>
              <div className="liquid-glass px-4 py-2 rounded-xl border border-white/10 group-hover:animate-glow-pulse">
                <span className="text-xs font-black text-primary uppercase tracking-tighter">Live Sync Active</span>
              </div>
           </div>
        </div>
      </Card>

      {/* The Rankings List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-3">
            <span className="size-2 rounded-full bg-primary animate-ping" /> Elite Contenders
          </h2>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Showing Top 50</span>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {leaderboardList.map((leader) => (
              <motion.div 
                key={leader.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card-premium p-1 hover:scale-[1.01] transition-transform duration-300 group"
              >
                <div className="p-4 flex items-center justify-between gap-4 relative overflow-hidden rounded-xl">
                  {/* Subtle rank-based background glow */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 opacity-40 ${
                    leader.rank <= 5 ? 'bg-yellow-400' : 
                    leader.rank <= 10 ? 'bg-blue-400' : 
                    'bg-slate-700'
                  }`} />

                  <div className="flex items-center gap-6 relative z-10">
                    <span className={`w-8 text-center text-sm font-black ${
                      leader.rank <= 10 ? 'text-white' : 'text-slate-500'
                    }`}>#{leader.rank}</span>
                    <Avatar 
                      src={leader.avatar} 
                      name={leader.username} 
                      size="sm" 
                      className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all active:scale-95"
                      onClick={() => setQuickViewUser(leader)}
                    />
                    <div>
                    <div 
                      onClick={() => setQuickViewUser(leader)}
                      className="font-black text-white hover:text-primary transition-colors cursor-pointer block leading-tight"
                    >
                      {leader.username}
                    </div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{leader.questsCompleted} Quests Mastered</p>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-8 relative z-10">
                    <div className="hidden md:block text-center mr-4">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic mb-1">Consistency</p>
                       <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (leader.displayXP / 500) * 100)}%` }}
                            className="h-full bg-gradient-to-r from-primary to-cyan-400" 
                          />
                       </div>
                    </div>
                    <div>
                      <span className="text-xl font-black text-white tracking-tighter group-hover:text-primary transition-colors">{leader.displayXP.toLocaleString()}</span>
                      <span className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">XP</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {leaderboardList.length === 0 && (
             <div className="text-center py-20 glass-card-premium rounded-3xl border-dashed border-white/10">
                <p className="text-slate-500 font-black uppercase tracking-widest">No legends found in this period... yet.</p>
             </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {quickViewUser && (
          <ProfileQuickView 
            username={quickViewUser.username}
            userId={quickViewUser.id}
            onClose={() => setQuickViewUser(null)}
          />
        )}
      </AnimatePresence>

    </div>
  )
}

export default Leaderboard

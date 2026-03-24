import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import { useUser } from '../../context/UserContext'

const ArenaHub = () => {
  const { userStats } = useUser()

  const arenas = [
    {
      id: 'clash',
      title: 'Code Clash',
      description: 'Face off against other developers in 1v1 real-time coding duels. Speed and accuracy are everything.',
      icon: 'swords',
      color: 'from-orange-500 to-red-600',
      path: '/app/clash',
      badge: 'Competitive',
      stats: '1,240 Players Live'
    },
    {
      id: 'leaderboard',
      title: 'Global Rankings',
      description: 'See where you stand in the world. Climb the ranks to earn exclusive badges and season rewards.',
      icon: 'leaderboard',
      color: 'from-blue-500 to-primary',
      path: '/app/leaderboard',
      badge: 'Ranked',
      stats: `Your Rank: #${userStats?.ranking || 'Unranked'}`
    }
  ]

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in px-4 sm:px-0">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1c1c27] to-[#0a0a0c] p-8 md:p-12 border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <span className="material-symbols-outlined text-[200px] -rotate-12">shield</span>
        </div>
        <div className="relative z-10 max-w-2xl">
          <Badge variant="danger" className="mb-4 animate-pulse">Live Arena Active</Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight uppercase">
            The <span className="text-gradient">Arena</span> Hub
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-8 font-medium italic">
            "Software engineering is a competitive sport. Prove your dominance."
          </p>
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white">{userStats?.clashesTotal || 0}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Matches</span>
            </div>
            <div className="flex flex-col border-x border-white/10 px-8">
              <span className="text-2xl font-black text-green-500">{userStats?.clashesWon || 0}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Wins</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-yellow-500">{userStats?.rating || 1000}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Arena Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {arenas.map((arena) => (
          <Link key={arena.id} to={arena.path} className="group h-full">
            <Card variant="elevated" hover className="h-full p-8 overflow-hidden relative border-2 border-transparent group-hover:border-primary/50 transition-all">
              <div className={`absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                 <span className="material-symbols-outlined text-9xl">{arena.icon}</span>
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className={`size-16 rounded-2xl bg-gradient-to-br ${arena.color} flex items-center justify-center text-white shadow-xl shadow-black/40`}>
                    <span className="material-symbols-outlined text-4xl">{arena.icon}</span>
                  </div>
                  <Badge variant="outline" className="border-white/20 text-white/60">{arena.badge}</Badge>
                </div>

                <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">{arena.title}</h2>
                <p className="text-slate-400 mb-8 flex-1 leading-relaxed">{arena.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-primary/80 uppercase tracking-widest">{arena.stats}</span>
                    <Button 
                      variant="primary" 
                      className="group-hover:px-8 transition-all" 
                      icon={arena.id === 'clash' ? 'bolt' : 'leaderboard'}
                    >
                      {arena.id === 'clash' ? 'Enter Arena' : 'View Rankings'}
                    </Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Season Banner */}
      <Card variant="elevated" className="p-6 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="size-20 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
               <span className="material-symbols-outlined text-4xl text-blue-400">workspace_premium</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Season 0: Alpha Launch</h3>
              <p className="text-sm text-slate-300 max-w-md">Top 100 players at the end of May will receive the <span className="text-yellow-400 font-bold">Alpha Pioneer</span> exclusive skin and badge.</p>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
             <span className="text-xs font-bold text-white/40 uppercase mb-2">Season Ends In</span>
             <div className="flex gap-4">
                <div className="text-xl font-mono font-black text-white">24d : 12h : 05m</div>
             </div>
          </div>
      </Card>
    </div>
  )
}

export default ArenaHub

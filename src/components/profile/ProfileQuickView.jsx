import { motion, AnimatePresence } from 'framer-motion'
import { useUserData } from '../../hooks/useUserData'
import { useSubmissions } from '../../hooks/useSubmissions'
import { useLeaderboard } from '../../hooks/useLeaderboard'
import Avatar from '../common/Avatar'
import Card from '../common/Card'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { getLevelProgress } from '../../utils/progressStorage'
import { useNavigate } from 'react-router-dom'

const ProfileQuickView = ({ userId, username, onClose }) => {
  const navigate = useNavigate()
  
  // 1. Get global leaderboard to find rank and UID (if we only have username)
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard('all', 100)
  
  // 2. Resolve the target UID
  const profileUserId = userId || leaderboard.find(l => l.username === username)?.id

  // 3. Fetch the target user's specific data
  const { userData: targetUserData, loading: userLoading } = useUserData(profileUserId)
  const { submissions: targetSubmissions, loading: subLoading } = useSubmissions(profileUserId)
  
  const loading = (leaderboardLoading && !userId) || userLoading || subLoading

  // Rank calculation
  const userInLeaderboard = leaderboard.find(l => l.id === profileUserId)
  const realRank = userInLeaderboard?.rank || '100+'
  
  const xp = Number(targetUserData?.xp) || 0
  const level = Math.max(1, Math.floor(xp / 200) + 1)
  const prog = (getLevelProgress(xp) * 100) || 0

  if (!userId && !username) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#050510]/80 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md z-10"
      >
        <Card className="bg-[#12122a] border-white/10 overflow-hidden shadow-2xl shadow-primary/20">
          {/* Cover / Header */}
          <div className="h-24 bg-gradient-to-r from-primary/20 to-purple-500/20 relative">
             <button 
               onClick={onClose}
               className="absolute top-4 right-4 size-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/50 hover:text-white transition-all"
             >
                <span className="material-symbols-outlined text-sm">close</span>
             </button>
          </div>

          <div className="px-8 pb-8 -mt-12 relative z-20">
            {loading ? (
              <div className="py-12 flex flex-col items-center gap-4">
                 <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Scanning Profile...</p>
              </div>
            ) : targetUserData ? (
              <div className="space-y-6">
                {/* Avatar & Basic Info */}
                <div className="flex items-end gap-4">
                   <div className="relative group">
                     <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg group-hover:bg-primary/40 transition-all" />
                     <Avatar 
                       src={targetUserData.avatar} 
                       name={targetUserData.username} 
                       size="xl" 
                       className="relative z-10 ring-4 ring-[#12122a]"
                     />
                   </div>
                   <div className="pb-1">
                      <h2 className="text-2xl font-black text-white tracking-tight">{targetUserData.username}</h2>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">stars</span> Rank #{realRank}
                      </p>
                   </div>
                </div>

                {/* Level Progress */}
                <div className="space-y-2">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Level {level}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{xp} XP</span>
                   </div>
                   <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${prog}%` }}
                        className="h-full bg-gradient-to-r from-primary to-purple-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                      />
                   </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                   <div className="bg-white/5 rounded-2xl p-3 border border-white/5 text-center">
                      <span className="material-symbols-outlined text-orange-500 text-lg block mb-1">local_fire_department</span>
                      <p className="text-sm font-black text-white">{targetUserData.streak || 0}</p>
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Day Streak</p>
                   </div>
                   <div className="bg-white/5 rounded-2xl p-3 border border-white/5 text-center">
                      <span className="material-symbols-outlined text-blue-500 text-lg block mb-1">check_circle</span>
                      <p className="text-sm font-black text-white">{targetUserData.completedQuests || 0}</p>
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Quests</p>
                   </div>
                   <div className="bg-white/5 rounded-2xl p-3 border border-white/5 text-center">
                      <span className="material-symbols-outlined text-purple-500 text-lg block mb-1">military_tech</span>
                      <p className="text-sm font-black text-white">{targetUserData.rating || 1200}</p>
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">ELO Rank</p>
                   </div>
                </div>

                {/* Language Pills */}
                <div className="flex flex-wrap gap-2">
                   {Object.keys(targetUserData.languageStats || {}).length > 0 ? Object.keys(targetUserData.languageStats).map(lang => (
                     <Badge key={lang} variant="outline" className="border-white/10 text-[9px] font-bold uppercase tracking-widest">
                       {lang}
                     </Badge>
                   )) : (
                     <p className="text-[10px] text-slate-500 italic">No language data yet...</p>
                   )}
                </div>

                {/* Action Footer */}
                <div className="flex gap-2 pt-2">
                   <Button 
                     variant="primary" 
                     className="flex-1 py-3" 
                     onClick={() => navigate(`/app/profile/${targetUserData.username}`)}
                   >
                     View Full Profile
                   </Button>
                   <Button 
                     variant="secondary" 
                     className="px-6 border-white/5 hover:border-white/10"
                     onClick={onClose}
                   >
                     Close
                   </Button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                 <span className="material-symbols-outlined text-4xl text-slate-700">person_off</span>
                 <p className="text-slate-500 font-bold uppercase text-xs">User not found</p>
                 <Button variant="secondary" onClick={onClose} size="sm">Go Back</Button>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default ProfileQuickView

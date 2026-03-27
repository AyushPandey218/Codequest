import { useState } from 'react'
import { useBroadcasts } from '../../hooks/useBroadcasts'

const GlobalBroadcast = () => {
    const { activeBroadcast, isLoading } = useBroadcasts()
    const [hidden, setHidden] = useState(false)

    if (isLoading || !activeBroadcast || hidden) return null

    const typeStyles = {
        info: 'from-blue-600/20 to-indigo-600/20 text-blue-100 border-blue-500/30 shadow-blue-500/10',
        warning: 'from-amber-600/20 to-orange-600/20 text-amber-100 border-amber-500/30 shadow-amber-500/10',
        success: 'from-emerald-600/20 to-green-600/20 text-emerald-100 border-emerald-500/30 shadow-emerald-500/10',
        error: 'from-red-600/20 to-rose-600/20 text-red-100 border-red-500/30 shadow-red-500/10'
    }

    const icons = {
        info: 'campaign',
        warning: 'warning',
        success: 'verified',
        error: 'report'
    }

    return (
        <div className={`w-full overflow-hidden relative z-[100] animate-slide-down`}>
            {/* Elegant glass bar */}
            <div className={`mx-4 mt-3 mb-1 rounded-2xl border backdrop-blur-xl bg-gradient-to-r ${typeStyles[activeBroadcast.type || 'info']} shadow-lg flex items-center justify-between gap-4 px-6 py-3 transition-all duration-500`}>
                <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20" />
                        <div className="size-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 relative">
                            <span className="material-symbols-outlined text-lg">{icons[activeBroadcast.type || 'info']}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 whitespace-nowrap">
                            Transmission
                        </span>
                        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
                        <p className="text-sm font-bold leading-tight">
                            <span className="text-white/90 mr-1">{activeBroadcast.title}:</span>
                            <span className="opacity-80 font-medium">{activeBroadcast.message}</span>
                        </p>
                    </div>
                </div>
                
                <button 
                    onClick={() => setHidden(true)}
                    className="size-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all transform hover:rotate-90"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>

                {/* Decorative background light */}
                <div className="absolute top-0 right-1/4 w-32 h-full bg-white/5 skew-x-[30deg] pointer-events-none" />
            </div>
            
            {/* Progress bar line */}
            <div className="mx-8 h-[1px] bg-white/5 relative overflow-hidden rounded-full">
                <div className="absolute h-full bg-white/20 animate-progress-slide w-full" />
            </div>
        </div>
    )
}

export default GlobalBroadcast

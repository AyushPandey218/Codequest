import { useState } from 'react'
import { useBroadcasts } from '../../hooks/useBroadcasts'

const GlobalBroadcast = () => {
    const { activeBroadcast, isLoading } = useBroadcasts()
    const [hidden, setHidden] = useState(false)

    if (isLoading || !activeBroadcast || hidden) return null

    const typeStyles = {
        info: 'bg-blue-600/20 text-blue-100 border-blue-500/30',
        warning: 'bg-orange-600/20 text-orange-100 border-orange-500/30',
        success: 'bg-green-600/20 text-green-100 border-green-500/30',
        error: 'bg-red-600/20 text-red-100 border-red-500/30'
    }

    const icons = {
        info: 'info',
        warning: 'warning',
        success: 'check_circle',
        error: 'error'
    }

    return (
        <div className={`w-full border-b backdrop-blur-md animate-slide-down relative z-[100] ${typeStyles[activeBroadcast.type || 'info']}`}>
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 size-8 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">{icons[activeBroadcast.type || 'info']}</span>
                    </div>
                    <div>
                        <span className="text-xs font-black uppercase tracking-widest opacity-60 block leading-none mb-1">Notice</span>
                        <p className="text-sm font-bold leading-tight">
                            <span className="mr-2 opacity-80">{activeBroadcast.title}:</span>
                            {activeBroadcast.message}
                        </p>
                    </div>
                </div>
                
                <button 
                    onClick={() => setHidden(true)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">close</span>
                </button>
            </div>
            
            <div className="absolute bottom-0 left-0 h-[2px] bg-white/20 w-full overflow-hidden">
                <div className="h-full bg-white/40 animate-progress-slide" />
            </div>
        </div>
    )
}

export default GlobalBroadcast

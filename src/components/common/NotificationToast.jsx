import { useEffect, useState } from 'react'

/**
 * NotificationToast - A premium, animated toast for general feedback (success, info, error)
 */
const NotificationToast = ({ message, type = 'info', onDismiss }) => {
    const [visible, setVisible] = useState(false)

    const colors = {
        success: {
            bg: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
            border: 'rgba(52, 211, 153, 0.3)',
            icon: 'check_circle',
            iconColor: 'text-emerald-400',
            glow: 'rgba(52, 211, 153, 0.1)'
        },
        error: {
            bg: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)',
            border: 'rgba(248, 113, 113, 0.3)',
            icon: 'error',
            iconColor: 'text-red-400',
            glow: 'rgba(248, 113, 113, 0.1)'
        },
        info: {
            bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            border: 'rgba(59, 130, 246, 0.3)',
            icon: 'info',
            iconColor: 'text-blue-400',
            glow: 'rgba(59, 130, 246, 0.1)'
        },
        warning: {
            bg: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)',
            border: 'rgba(251, 191, 36, 0.3)',
            icon: 'warning',
            iconColor: 'text-amber-400',
            glow: 'rgba(251, 191, 36, 0.1)'
        }
    }

    const style = colors[type] || colors.info

    useEffect(() => {
        // Entrance animation
        const enter = setTimeout(() => setVisible(true), 50)

        // Auto-dismiss after 4s
        const dismiss = setTimeout(() => {
            setVisible(false)
            setTimeout(onDismiss, 400)
        }, 4000)

        return () => { clearTimeout(enter); clearTimeout(dismiss) }
    }, [onDismiss])

    return (
        <div
            className={`fixed bottom-8 right-8 z-[9999] transition-all duration-500 ease-out transform ${
                visible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-12 opacity-0 scale-90'
            }`}
        >
            <div
                style={{
                    background: style.bg,
                    border: `1px solid ${style.border}`,
                    boxShadow: `0 10px 40px -10px rgba(0,0,0,0.5), 0 0 20px ${style.glow}`,
                }}
                className="flex items-center gap-4 px-6 py-4 rounded-2xl min-w-[300px] max-w-[450px] backdrop-blur-xl relative overflow-hidden group shadow-2xl"
            >
                {/* Background patterns */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/10 transition-colors" />
                
                {/* Icon Container */}
                <div className={`flex-shrink-0 size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner ${style.iconColor}`}>
                    <span className="material-symbols-outlined text-2xl">{style.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <p className="text-white text-sm font-bold leading-snug">
                        {message}
                    </p>
                </div>

                {/* Close btn */}
                <button
                    onClick={() => { setVisible(false); setTimeout(onDismiss, 400) }}
                    className="size-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>

                {/* Progress bar effect */}
                <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
                    <div 
                        className={`h-full bg-white/40 ${visible ? 'w-0' : 'w-full'}`}
                        style={{ transition: 'width 4s linear' }}
                    />
                </div>
            </div>
        </div>
    )
}

export default NotificationToast

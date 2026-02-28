import { useEffect, useState } from 'react'
import { achievements } from '../../data/achievements'

/**
 * AchievementToast — animated notification for unlocking a new achievement
 * Usage: <AchievementToast achievementId="first_quest" onDismiss={onDismiss} />
 */
const AchievementToast = ({ achievementId, onDismiss }) => {
    const [visible, setVisible] = useState(false)
    const achievement = achievements.find(a => a.id === achievementId)

    useEffect(() => {
        if (!achievement) {
            onDismiss()
            return
        }

        // Trigger entrance animation
        const enter = setTimeout(() => setVisible(true), 50)

        // Auto-dismiss after 5s
        const dismiss = setTimeout(() => {
            setVisible(false)
            setTimeout(onDismiss, 400)
        }, 5000)

        return () => { clearTimeout(enter); clearTimeout(dismiss) }
    }, [achievement, onDismiss])

    if (!achievement) return null

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                transform: visible ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.9)',
                opacity: visible ? 1 : 0,
                transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease',
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            <div
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '20px',
                    padding: '16px 20px',
                    minWidth: '320px',
                    maxWidth: '400px',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5), 0 0 20px rgba(255, 215, 0, 0.1)',
                    backdropFilter: 'blur(16px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Shine effect background */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                    animation: 'spin 10s linear infinite'
                }} />

                {/* Badge Icon Container */}
                <div
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: achievement.bgColor || 'rgba(255, 215, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        boxShadow: 'inset 0 0 12px rgba(255, 255, 255, 0.05)',
                        position: 'relative'
                    }}
                >
                    <span className={`material-symbols-outlined ${achievement.color || 'text-yellow-400'}`} style={{ fontSize: '32px' }}>
                        {achievement.icon}
                    </span>

                    {/* Sparkle animations */}
                    <div style={{ position: 'absolute', top: '-5px', right: '-5px', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}>✨</div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            color: '#fbbf24',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            background: 'rgba(251, 191, 36, 0.1)',
                            padding: '1px 6px',
                            borderRadius: '4px'
                        }}>
                            Achievement Unlocked
                        </span>
                    </div>
                    <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
                        {achievement.name}
                    </h4>
                    <p style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic', margin: '2px 0 0 0', lineHeight: '1.4' }}>
                        {achievement.description}
                    </p>
                </div>

                {/* Close button */}
                <button
                    onClick={() => { setVisible(false); setTimeout(onDismiss, 400) }}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        fontSize: '16px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        zIndex: 2
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                    onMouseOut={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                >
                    ×
                </button>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes ping {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    )
}

export default AchievementToast

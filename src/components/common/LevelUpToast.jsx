import { useEffect, useState } from 'react'

/**
 * LevelUpToast — animated level-up celebration notification
 * Usage: <LevelUpToast newLevel={5} onDismiss={() => setShow(false)} />
 */
const LevelUpToast = ({ newLevel, xpEarned, onDismiss }) => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // Trigger entrance animation after mount
        const enter = setTimeout(() => setVisible(true), 50)
        // Auto-dismiss after 4s
        const dismiss = setTimeout(() => {
            setVisible(false)
            setTimeout(onDismiss, 400) // wait for exit animation
        }, 4000)
        return () => { clearTimeout(enter); clearTimeout(dismiss) }
    }, [onDismiss])

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(80px) scale(0.9)',
                opacity: visible ? 1 : 0,
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            <div
                style={{
                    background: 'linear-gradient(135deg, #1e1e2e 0%, #2b2bee22 100%)',
                    border: '1px solid #2b2bee60',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    minWidth: '280px',
                    boxShadow: '0 8px 32px rgba(43, 43, 238, 0.3), 0 0 0 1px rgba(43,43,238,0.15)',
                    backdropFilter: 'blur(12px)',
                }}
            >
                {/* Animated stars */}
                <div style={{ position: 'absolute', top: '-10px', right: '20px', fontSize: '24px', animation: 'bounce 0.6s ease infinite alternate' }}>✨</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {/* Level badge */}
                    <div
                        style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2b2bee, #7c3aed)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 0 20px rgba(43,43,238,0.5)',
                            animation: 'pulse 1.5s ease infinite',
                        }}
                    >
                        <span style={{ color: 'white', fontSize: '11px', fontWeight: 700, lineHeight: 1 }}>LVL</span>
                        <span style={{ color: 'white', fontSize: '22px', fontWeight: 900, lineHeight: 1 }}>{newLevel}</span>
                    </div>

                    {/* Text */}
                    <div>
                        <p style={{ color: '#a5b4fc', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                            Level Up! 🎉
                        </p>
                        <p style={{ color: 'white', fontSize: '18px', fontWeight: 800, margin: '2px 0' }}>
                            You reached Level {newLevel}
                        </p>
                        {xpEarned > 0 && (
                            <p style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 600, margin: 0 }}>
                                +{xpEarned} XP earned
                            </p>
                        )}
                    </div>
                </div>

                {/* Progress hint */}
                <p style={{ color: '#64748b', fontSize: '12px', marginTop: '12px', marginBottom: 0, textAlign: 'center' }}>
                    Keep going! More XP = higher levels 🚀
                </p>

                {/* Dismiss button */}
                <button
                    onClick={() => { setVisible(false); setTimeout(onDismiss, 400) }}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '12px',
                        background: 'none',
                        border: 'none',
                        color: '#475569',
                        cursor: 'pointer',
                        fontSize: '18px',
                        lineHeight: 1,
                        padding: '2px 6px',
                    }}
                >
                    ×
                </button>
            </div>

            <style>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-6px); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(43,43,238,0.5); }
          50% { box-shadow: 0 0 30px rgba(124,58,237,0.7); }
        }
      `}</style>
        </div>
    )
}

export default LevelUpToast

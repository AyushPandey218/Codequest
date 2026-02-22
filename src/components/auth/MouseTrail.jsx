import { useEffect, useState, useRef } from 'react'

const MouseTrail = () => {
    const [dots, setDots] = useState([])
    const containerRef = useRef(null)

    const charPool = ['{', '}', '[', ']', '(', ')', ';', '<', '>', '/', '!', '&', '?', '_', '#']

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return

            const rect = containerRef.current.getBoundingClientRect()

            // Only create dots if the mouse is over the right panel
            if (e.clientX < rect.left || e.clientX > rect.right ||
                e.clientY < rect.top || e.clientY > rect.bottom) {
                return
            }

            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            // Add new code-themed dot
            const newDot = {
                id: Date.now() + Math.random(),
                char: charPool[Math.floor(Math.random() * charPool.length)],
                x,
                y,
                fontSize: `${0.8 + Math.random() * 0.7}rem`,
                color: Math.random() > 0.5 ? '#4f46e5' : '#7c3aed',
                rotation: Math.random() * 360,
            }

            setDots((prev) => [...prev.slice(-20), newDot])
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        >
            {dots.map((dot) => (
                <div
                    key={dot.id}
                    className="absolute font-mono font-black animate-fade-out pointer-events-none select-none blur-[0.5px]"
                    style={{
                        left: dot.x,
                        top: dot.y,
                        fontSize: dot.fontSize,
                        color: dot.color,
                        textShadow: `0 0 12px ${dot.color}`,
                        transform: `translate(-50%, -50%) rotate(${dot.rotation}deg)`,
                    }}
                >
                    {dot.char}
                </div>
            ))}
        </div>
    )
}

export default MouseTrail

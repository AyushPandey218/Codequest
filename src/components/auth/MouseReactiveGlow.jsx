import { useEffect, useState, useRef } from 'react'

const MouseReactiveGlow = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const containerRef = useRef(null)

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return

            const rect = containerRef.current.getBoundingClientRect()

            // We listen globally but only update if on the right side
            if (e.clientX < rect.left || e.clientX > rect.right ||
                e.clientY < rect.top || e.clientY > rect.bottom) {
                return
            }

            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        >
            <div
                className="absolute w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] transition-transform duration-300 ease-out opacity-40"
                style={{
                    left: mousePos.x,
                    top: mousePos.y,
                    transform: 'translate(-50%, -50%)',
                }}
            />
            <div
                className="absolute w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] transition-transform duration-500 ease-out opacity-30"
                style={{
                    left: mousePos.x,
                    top: mousePos.y,
                    transform: 'translate(-50%, -50%)',
                }}
            />
        </div>
    )
}

export default MouseReactiveGlow

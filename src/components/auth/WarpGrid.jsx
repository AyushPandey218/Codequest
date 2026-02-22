import { useEffect, useRef } from 'react'

const WarpGrid = () => {
    const canvasRef = useRef(null)
    const mouseRef = useRef({ x: -1000, y: -1000 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animationFrameId

        // Grid settings
        const spacing = 40
        let points = []
        let rows = 0
        let cols = 0

        const initGrid = () => {
            const rect = canvas.getBoundingClientRect()
            canvas.width = rect.width
            canvas.height = rect.height

            cols = Math.ceil(canvas.width / spacing) + 1
            rows = Math.ceil(canvas.height / spacing) + 1
            points = []

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    points.push({
                        baseX: x * spacing,
                        baseY: y * spacing,
                        curX: x * spacing,
                        curY: y * spacing,
                        vx: 0,
                        vy: 0
                    })
                }
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const mouseX = mouseRef.current.x
            const mouseY = mouseRef.current.y
            const forceRadius = 250
            const forceStrength = 120

            // Update points
            points.forEach(p => {
                const dx = mouseX - p.baseX
                const dy = mouseY - p.baseY
                const dist = Math.sqrt(dx * dx + dy * dy)

                if (dist < forceRadius) {
                    const force = (forceRadius - dist) / forceRadius
                    const targetX = p.baseX + dx * force * (forceStrength / dist)
                    const targetY = p.baseY + dy * force * (forceStrength / dist)

                    p.curX += (targetX - p.curX) * 0.1
                    p.curY += (targetY - p.curY) * 0.1
                } else {
                    p.curX += (p.baseX - p.curX) * 0.05
                    p.curY += (p.baseY - p.curY) * 0.05
                }
            })

            // Draw horizontal lines
            ctx.beginPath()
            ctx.strokeStyle = 'rgba(79, 70, 229, 0.12)' // Subtle Indigo
            ctx.lineWidth = 1

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols - 1; x++) {
                    const p1 = points[y * cols + x]
                    const p2 = points[y * cols + x + 1]
                    ctx.moveTo(p1.curX, p1.curY)
                    ctx.lineTo(p2.curX, p2.curY)
                }
            }
            ctx.stroke()

            // Draw vertical lines
            ctx.beginPath()
            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows - 1; y++) {
                    const p1 = points[y * cols + x]
                    const p2 = points[(y + 1) * cols + x]
                    ctx.moveTo(p1.curX, p1.curY)
                    ctx.lineTo(p2.curX, p2.curY)
                }
            }
            ctx.stroke()

            animationFrameId = requestAnimationFrame(animate)
        }

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect()
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            }
        }

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 }
        }

        initGrid()
        animate()

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('resize', initGrid)
        canvas.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', initGrid)
            canvas.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 w-full h-full opacity-40 pointer-events-none"
        />
    )
}

export default WarpGrid

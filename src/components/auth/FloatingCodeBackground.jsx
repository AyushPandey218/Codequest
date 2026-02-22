import { useEffect, useState } from 'react'

const FloatingCodeBackground = () => {
    const [snippets, setSnippets] = useState([])

    const codePool = [
        'def solver(quest):',
        'if result == success:',
        'import quest_engine',
        'while True:',
        'return { "xp": 100 }',
        'const clash = new Clash()',
        'await quest.complete()',
        'for i in range(10):',
        'quest.level += 1',
        'clash.start_timer()',
        'print("Success!")',
        'sys.exit(0)',
        'npm run build',
        'git commit -m "Level up"',
        'const [xp, setXp] = useState(0)'
    ]

    useEffect(() => {
        // Generate randomized snippet positions and timings
        const newSnippets = Array.from({ length: 24 }).map((_, i) => ({
            id: i,
            text: codePool[Math.floor(Math.random() * codePool.length)],
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 5}s`,
            duration: `${20 + Math.random() * 20}s`,
            opacity: 0.2 + Math.random() * 0.3, // Significantly increased opacity (20% to 50%)
            fontSize: `${0.7 + Math.random() * 0.7}rem`,
            color: i % 2 === 0 ? '#4f46e5' : '#7c3aed' // Alternate between brand blue and purple
        }))
        setSnippets(newSnippets)
    }, [])

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
            {snippets.map((s) => (
                <div
                    key={s.id}
                    className="absolute font-mono whitespace-nowrap animate-float-spin"
                    style={{
                        top: s.top,
                        left: s.left,
                        animationDelay: s.delay,
                        animationDuration: s.duration,
                        opacity: s.opacity,
                        fontSize: s.fontSize,
                        color: s.color
                    }}
                >
                    {s.text}
                </div>
            ))}
        </div>
    )
}

export default FloatingCodeBackground

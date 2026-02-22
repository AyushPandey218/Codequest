/**
 * Sandboxed JavaScript Web Worker
 * Captures console.log output and runs user code safely.
 */
self.onmessage = function (e) {
    const { source, stdin } = e.data

    let output = ''
    const lines = stdin ? stdin.split('\n').filter(Boolean) : []
    let lineIdx = 0

    // Capture console.log
    const origLog = console.log
    const origError = console.error
    console.log = (...args) => {
        output += args
            .map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
            .join(' ') + '\n'
    }
    console.error = (...args) => {
        output += args.join(' ') + '\n'
    }

    // Minimal stdin shim - reads from the test case input line by line
    const stdinLines = stdin ? stdin.trim().split('\n') : []
    let stdinIdx = 0

    try {
        // Parse args from stdin - same format as Python wrapper
        function parseArgs(raw) {
            raw = (raw || '').trim()
            const parts = []
            let i = 0
            while (i < raw.length) {
                if (raw[i] === '[') {
                    let depth = 0, j = i
                    for (; j < raw.length; j++) {
                        if (raw[j] === '[') depth++
                        else if (raw[j] === ']') { depth--; if (depth === 0) break }
                    }
                    parts.push(JSON.parse(raw.slice(i, j + 1)))
                    i = j + 1
                } else if (raw[i] === ' ') {
                    i++
                } else {
                    let j = i
                    while (j < raw.length && raw[j] !== ' ') j++
                    const tok = raw.slice(i, j)
                    const n = Number(tok)
                    if (tok === 'True') parts.push(true)
                    else if (tok === 'False') parts.push(false)
                    else parts.push(isNaN(n) ? tok : n)
                    i = j
                }
            }
            return parts
        }

        const fn = new Function(source + '\n; return solution;')
        const solutionFn = fn()

        const args = parseArgs(stdin)
        const result = solutionFn(...args)

        if (result !== undefined) {
            if (Array.isArray(result)) {
                output = JSON.stringify(result).replace(/,/g, ', ')
            } else if (typeof result === 'boolean') {
                output = result ? 'True' : 'False'
            } else {
                output = String(result)
            }
        }

        self.postMessage({ output: output.trim(), error: null })
    } catch (err) {
        self.postMessage({ output: null, error: err.message })
    } finally {
        console.log = origLog
        console.error = origError
    }
}

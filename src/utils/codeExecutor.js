/**
 * Code Execution Service
 *
 * Python3 / Python  → Pyodide (WebAssembly, client-side, CDN)
 * JavaScript        → Sandboxed Web Worker (client-side)
 * Java, C++, C, Go,
 * Rust, Ruby, PHP   → Wandbox API (free, no auth, proxied via Vite)
 *
 * Completely free, no API keys, no rate limits.
 */

import { validateLanguageMatch } from './languageDetector'

// ─── Pyodide singleton ─────────────────────────────────────────────────────

let pyodideInstance = null
let pyodideLoading = null

const getPyodide = async () => {
  if (pyodideInstance) return pyodideInstance
  if (pyodideLoading) return pyodideLoading

  pyodideLoading = (async () => {
    // Dynamically load Pyodide from CDN if not already on the page
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    }
    pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
    })
    return pyodideInstance
  })()

  return pyodideLoading
}

// ─── Python wrapper (runs solution() with parsed stdin) ────────────────────

const buildPythonRunner = (userCode, input) => `
import ast, sys, json

${userCode}

def parse_input(raw):
    raw = raw.strip()
    parts = []
    i = 0
    while i < len(raw):
        if raw[i] in '[({':
            depth = 0
            for k in range(i, len(raw)):
                if raw[k] in '[({': depth += 1
                elif raw[k] in '])}': depth -= 1
                if depth == 0:
                    parts.append(ast.literal_eval(raw[i:k+1]))
                    i = k + 1
                    break
            else:
                i += 1
        elif raw[i] == ' ':
            i += 1
        else:
            j = i
            while i < len(raw) and raw[i] != ' ':
                i += 1
            token = raw[j:i]
            try:
                parts.append(ast.literal_eval(token))
            except:
                parts.append(token)
    return parts

args = parse_input(${JSON.stringify(input)})
result = solution(*args)
if isinstance(result, list):
    print(result)
elif isinstance(result, bool):
    print(result)
else:
    print(result)
`

// ─── Execute Python via Pyodide ────────────────────────────────────────────

const runPython = async (code, input) => {
  const pyodide = await getPyodide()

  // Capture stdout
  let stdout = ''
  pyodide.setStdout({ batched: (s) => { stdout += s + '\n' } })

  try {
    await pyodide.runPythonAsync(buildPythonRunner(code, input))
    return { stdout: stdout.trim(), stderr: null, error: null }
  } catch (err) {
    // Clean up the traceback for display
    const msg = String(err)
    const lastLine = msg.split('\n').filter(Boolean).at(-1) || msg
    return { stdout: null, stderr: lastLine, error: lastLine }
  }
}

// ─── Execute JavaScript via Web Worker ────────────────────────────────────

const runJavaScript = (code, input) => {
  return new Promise((resolve) => {
    const worker = new Worker('/js-runner.worker.js')

    const timeout = setTimeout(() => {
      worker.terminate()
      resolve({ stdout: null, stderr: 'Time limit exceeded', error: 'Time limit exceeded' })
    }, 10000)

    worker.onmessage = (e) => {
      clearTimeout(timeout)
      worker.terminate()
      const { output, error } = e.data
      resolve({
        stdout: output ? output.trim() : null,
        stderr: error || null,
        error: error || null,
      })
    }

    worker.onerror = (e) => {
      clearTimeout(timeout)
      worker.terminate()
      resolve({ stdout: null, stderr: e.message, error: e.message })
    }

    worker.postMessage({ source: code, stdin: input })
  })
}

// ─── JDoodle — compiled language execution ───────────────────────────────
// Requires VITE_JDOODLE_CLIENT_ID + VITE_JDOODLE_CLIENT_SECRET in .env.local

const JDOODLE_LANGUAGES = {
  Java: { language: 'java', versionIndex: '4' },
  'C++': { language: 'cpp17', versionIndex: '0' },
  C: { language: 'c', versionIndex: '5' },
  Go: { language: 'go', versionIndex: '4' },
  Rust: { language: 'rust', versionIndex: '4' },
  Ruby: { language: 'ruby', versionIndex: '4' },
  PHP: { language: 'php', versionIndex: '4' },
  Kotlin: { language: 'kotlin', versionIndex: '3' },
  Swift: { language: 'swift', versionIndex: '4' },
  TypeScript: { language: 'nodejs', versionIndex: '4' },
  Scala: { language: 'scala', versionIndex: '4' },
}

// Build a complete runnable program that reads stdin → calls solution() → prints result
const buildJDoodleProgram = (userCode, language) => {
  switch (language) {
    case 'Java': return `
import java.util.*;
import java.util.stream.*;

${userCode}

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        String raw = sc.hasNextLine() ? sc.nextLine().trim() : "";
        // Parse a JSON-style array or plain number from raw
        Object result;
        if (raw.startsWith("[")) {
            // Parse as int array
            String inner = raw.substring(1, raw.length() - 1).trim();
            if (inner.isEmpty()) {
                result = Solution.solution(new int[0]);
            } else {
                int[] arr = Arrays.stream(inner.split(",")).map(String::trim).mapToInt(Integer::parseInt).toArray();
                result = Solution.solution(arr);
            }
        } else {
            int n = Integer.parseInt(raw);
            result = Solution.solution(n);
        }
        if (result instanceof int[]) System.out.println(Arrays.toString((int[]) result).replace(", ", ", "));
        else System.out.println(result);
    }
}
`
    case 'C++': return `
#include <bits/stdc++.h>
using namespace std;

${userCode}

int main() {
    string line;
    getline(cin, line);
    if (!line.empty() && line[0] == '[') {
        // Parse array
        vector<int> arr;
        string inner = line.substr(1, line.size()-2);
        stringstream ss(inner);
        string tok;
        while (getline(ss, tok, ',')) {
            if (!tok.empty()) arr.push_back(stoi(tok));
        }
        auto res = solution(arr);
        cout << res << endl;
    } else {
        cout << solution(stoi(line)) << endl;
    }
    return 0;
}
`
    case 'C': return `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

${userCode}

int main() {
    char line[4096];
    fgets(line, sizeof(line), stdin);
    printf("%d\\n", solution(atoi(line)));
    return 0;
}
`
    case 'Go': return `
package main

import (
    "bufio"
    "fmt"
    "os"
    "strconv"
    "strings"
)

${userCode}

func main() {
    reader := bufio.NewReader(os.Stdin)
    line, _ := reader.ReadString('\\n')
    line = strings.TrimSpace(line)
    n, _ := strconv.Atoi(line)
    fmt.Println(solution(n))
}
`
    case 'Rust': return `
use std::io::{self, BufRead};

${userCode}

fn main() {
    let stdin = io::stdin();
    let line = stdin.lock().lines().next().unwrap().unwrap();
    let n: i64 = line.trim().parse().unwrap_or(0);
    println!("{}", solution(n));
}
`
    case 'Ruby': return `
${userCode}

input = gets.chomp
if input.start_with?('[')
  arr = eval(input)
  p solution(arr)
else
  p solution(input.to_i)
end
`
    default: return userCode
  }
}

const runJDoodle = async (code, language, input) => {
  const spec = JDOODLE_LANGUAGES[language]
  if (!spec) {
    return { stdout: null, error: `Language "${language}" is not supported yet.` }
  }

  const clientId = import.meta.env.VITE_JDOODLE_CLIENT_ID
  const clientSecret = import.meta.env.VITE_JDOODLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return {
      stdout: null,
      error: 'JDoodle API keys not set. Add VITE_JDOODLE_CLIENT_ID and VITE_JDOODLE_CLIENT_SECRET to .env.local',
    }
  }

  const program = buildJDoodleProgram(code, language)

  try {
    const res = await fetch('/jdoodle/v1/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        clientSecret,
        script: program,
        stdin: input,
        language: spec.language,
        versionIndex: spec.versionIndex,
      }),
    })

    if (!res.ok) throw new Error(`JDoodle API error: ${res.status}`)

    const data = await res.json()
    // JDoodle response: { output, statusCode, memory, cpuTime }
    const out = (data.output || '').trim()
    if (data.statusCode !== 200) throw new Error(out || 'Execution failed')
    return { stdout: out, error: null }
  } catch (err) {
    return { stdout: null, error: err.message }
  }
}

// ─── Execute single test case ──────────────────────────────────────────────

const executeTestCase = async (code, selectedLanguage, testCase) => {
  const startTime = Date.now()
  const result = {
    name: testCase.name || `Test Case ${testCase.id}`,
    input: testCase.input,
    expectedOutput: String(testCase.expectedOutput).trim(),
    actualOutput: null,
    stdout: null,
    stderr: null,
    passed: false,
    error: null,
    executionTime: 0,
  }

  try {
    let execResult

    if (selectedLanguage === 'Python3' || selectedLanguage === 'Python') {
      execResult = await runPython(code, testCase.input)
    } else if (selectedLanguage === 'JavaScript') {
      execResult = await runJavaScript(code, testCase.input)
    } else {
      result.error = `${selectedLanguage} support coming soon! Use Python3 or JavaScript to run tests.`
      result.passed = false
      result.executionTime = 0
      return result
    }

    result.executionTime = Date.now() - startTime

    if (execResult.error && !execResult.stdout) {
      result.error = execResult.error
      result.actualOutput = execResult.error
      result.passed = false
      return result
    }

    result.stdout = execResult.stdout
    result.actualOutput = execResult.stdout
    result.passed = compareOutputs(execResult.stdout, result.expectedOutput)

  } catch (err) {
    result.error = err.message
    result.executionTime = Date.now() - startTime
    result.passed = false
  }

  return result
}

// ─── Run all test cases ────────────────────────────────────────────────────

const runTestCases = async (code, selectedLanguage, testCases) => {
  const results = {
    passed: 0,
    failed: 0,
    total: testCases.length,
    tests: [],
    executionTime: 0,
  }

  const startTime = Date.now()

  for (const testCase of testCases) {
    const testResult = await executeTestCase(code, selectedLanguage, testCase)
    results.tests.push(testResult)
    if (testResult.passed) results.passed++
    else results.failed++
  }

  results.executionTime = Date.now() - startTime
  return results
}

// ─── Public API ────────────────────────────────────────────────────────────

export const executeCode = async ({ code, selectedLanguage, testCases = [] }) => {
  if (!code || code.trim() === '') {
    return { success: false, error: 'No code provided', results: null }
  }

  // Validate language match
  const languageValidation = validateLanguageMatch(code, selectedLanguage)
  if (!languageValidation.isMatch && languageValidation.confidence === 'high') {
    return {
      success: false,
      error: languageValidation.message,
      results: null,
      languageMismatch: true,
      detectedLanguage: languageValidation.detectedLanguage,
    }
  }

  const results = await runTestCases(code, selectedLanguage, testCases)
  return { success: true, error: null, results }
}

// ─── Output comparison ─────────────────────────────────────────────────────

const compareOutputs = (actual, expected) => {
  const a = String(actual || '').trim()
  const e = String(expected || '').trim()

  if (a === e) return true

  // Numeric comparison
  const an = parseFloat(a), en = parseFloat(e)
  if (!isNaN(an) && !isNaN(en)) return Math.abs(an - en) < 0.0001

  // Normalise Python bool repr and list spacing
  const norm = s => s.replace(/\s+/g, '').replace(/True/g, 'true').replace(/False/g, 'false')
  if (norm(a) === norm(e)) return true

  // Multi-line comparison
  const al = a.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  const el = e.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  if (al.length === el.length && al.every((l, i) => l === el[i])) return true

  return false
}

export const executeCodePlayground = async (code, language = 'Python3') => {
  if (!code || code.trim() === '') return { success: false, error: 'No code provided', output: null }
  try {
    let result
    if (language === 'JavaScript') {
      result = await runJavaScript(code, '')
    } else {
      const pyodide = await getPyodide()
      let stdout = ''
      pyodide.setStdout({ batched: (s) => { stdout += s + '\n' } })
      await pyodide.runPythonAsync(code)
      result = { stdout: stdout.trim(), error: null }
    }
    return { success: true, output: result.stdout, executionTime: 0 }
  } catch (e) {
    return { success: false, error: e.message, output: null }
  }
}

export const validateSubmission = (code, language) => {
  const errors = []
  if (!code || code.trim() === '') errors.push('Code cannot be empty')
  if (code.length < 10) errors.push('Code seems too short')
  return { isValid: errors.length === 0, errors }
}

// Warm up Pyodide in background (sneaky preload)
if (typeof window !== 'undefined') {
  setTimeout(() => getPyodide(), 2000)
}

export default { executeCode, executeCodePlayground, validateSubmission }

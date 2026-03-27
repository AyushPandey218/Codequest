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

def _get_target():
    if 'solution' in locals():
        return locals()['solution']

    try:
        # Use AST to find the last defined function or class
        tree = ast.parse(${JSON.stringify(userCode)})
        for node in reversed(tree.body):
            if isinstance(node, ast.FunctionDef):
                if node.name in locals():
                    return locals()[node.name]
            elif isinstance(node, ast.ClassDef):
                if node.name in locals():
                    cls = locals()[node.name]
                    # For classes, look for the first public method
                    for item in node.body:
                        if isinstance(item, ast.FunctionDef) and not item.name.startswith('_'):
                            return getattr(cls(), item.name)
                    return cls
    except Exception:
        pass
    return None

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

target = _get_target()
if not target:
    raise NameError('No executable function or class found. Please define at least one function.')

args = parse_input(${JSON.stringify(input)})
result = target(*args)

if isinstance(result, (list, bool)) or result is not None:
    print(result)
else:
    # If result is None but function finished, we might still want to print something or nothing
    pass
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

// ─── Piston — Free, reliable compiled language execution ────────────────────
// No API keys required. Proxied via Vite /piston.
// Docs: https://github.com/engineer-man/piston

const PISTON_LANGUAGES = {
  'C++': { language: 'cpp', version: '10.2.0' },
  'Java': { language: 'java', version: '15.0.2' },
  'C': { language: 'c', version: '10.2.0' },
  'C#': { language: 'mono', version: '6.12.0' },
  'Go': { language: 'go', version: '1.16.2' },
  'Rust': { language: 'rust', version: '1.50.0' },
  'Ruby': { language: 'ruby', version: '3.0.0' },
  'PHP': { language: 'php', version: '8.0.2' },
  'TypeScript': { language: 'typescript', version: '4.2.3' },
  'Kotlin': { language: 'kotlin', version: '1.4.31' },
  'Swift': { language: 'swift', version: '5.3.3' },
  'Scala': { language: 'scala', version: '3.0.0' },
  'Python3': { language: 'python', version: '3.10.0' },
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
    case 'C++': {
      // DYNAMIC WRAPPER GENERATOR
      let mainFunc = '';
      if (quest.id === 'q25') {
        mainFunc = `
int main() {
    string line; if (!getline(cin, line)) return 0;
    size_t s = line.find("["); size_t e = line.find("]");
    if (s == string::npos || e == string::npos) return 0;
    vector<int> v; stringstream ss(line.substr(s+1, e-s-1)); string t;
    while (getline(ss, t, ',')) { if (!t.empty()) v.push_back(stoi(t)); }
    int p = -1; size_t pi = line.find("\\"pos\\"");
    if (pi != string::npos) { size_t c = line.find(":", pi); size_t cm = line.find_first_of(",}", c); if (c != string::npos && cm != string::npos) p = stoi(line.substr(c+1, cm-c-1)); }
    cout << (solution(buildCycleList(v, p)) ? "true" : "false") << endl; return 0;
}`;
      } else if (quest.id === 'q13') {
        mainFunc = `
int main() {
    string line; if (!getline(cin, line)) return 0;
    auto gs = [&](string k) {
        size_t pk = line.find("\\"" + k + "\\""); size_t c = line.find(":", pk);
        size_t s = line.find("\\"", c); size_t e = line.find("\\"", s + 1);
        return line.substr(s + 1, e - s - 1);
    };
    cout << (solution(gs("s"), gs("t")) ? "true" : "false") << endl; return 0;
}`;
      } else {
        mainFunc = `
int main() {
    string line; if (!getline(cin, line)) return 0;
    if (line[0] == '[') {
        vector<int> v; stringstream ss(line.substr(1, line.size()-2)); string t;
        while (getline(ss, t, ',')) { if (!t.empty()) v.push_back(stoi(t)); }
        cout << solution(v) << endl;
    } else { cout << solution(stoi(line)) << endl; }
    return 0;
}`;
      }

      return `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include <map>
#include <set>
#include <queue>
#include <stack>
using namespace std;

struct ListNode {
    int val; ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

struct TreeNode {
    int val; TreeNode *left; TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

ListNode* buildCycleList(vector<int> vals, int pos) {
    if (vals.empty()) return NULL;
    vector<ListNode*> nodes;
    ListNode* head = new ListNode(vals[0]); nodes.push_back(head);
    ListNode* curr = head;
    for (size_t i = 1; i < vals.size(); i++) {
        curr->next = new ListNode(vals[i]); curr = curr->next; nodes.push_back(curr);
    }
    if (pos >= 0 && pos < (int)nodes.size()) curr->next = nodes[pos];
    return head;
}

${userCode}

${mainFunc}
`;
    }
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
    case 'C#': return `
using System;
using System.Collections.Generic;
using System.Linq;

${userCode}

public class MainClass {
    public static void Main(string[] args) {
        string input = Console.ReadLine();
        if (string.IsNullOrEmpty(input)) return;
        
        // If the user has a class Program with static solution(), let's call it.
        // Otherwise assume they just defined the function in the global scope (impossible in C#)
        // or they provided a class Solution.
        try {
            if (input.StartsWith("[")) {
                int[] arr = input.Trim('[', ']').Split(',').Select(s => int.Parse(s.Trim())).ToArray();
                Console.WriteLine(Solution.solution(arr));
            } else {
                int n = int.Parse(input);
                Console.WriteLine(Solution.solution(n));
            }
        } catch {
            // Fallback for full programs that manage their own IO
            // (We just let the user code run as is if the above fails)
        }
    }
}
`
    default: return userCode
  }
}

const runPiston = async (code, language, input) => {
  const spec = PISTON_LANGUAGES[language]
  if (!spec) {
    return { stdout: null, error: `Language "${language}" is not supported via Piston.` }
  }

  // Build the complete runnable program
  let program = code
  const needsWrap = 
    (language === 'C#' && !code.includes('static void Main')) ||
    (language === 'Java' && !code.includes('public static void main')) ||
    (['C++', 'C', 'Go', 'Rust'].includes(language) && !code.includes('main'))

  if (needsWrap) {
    program = buildJDoodleProgram(code, language)
  }

  try {
    const res = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: spec.language,
        version: spec.version,
        files: [{ content: program }],
        stdin: input,
      }),
    })

    if (!res.ok) {
      let msg = `API error: ${res.status}`;
      try {
        const errData = await res.json();
        if (errData.message || errData.error) msg = errData.message || errData.error;
      } catch (e) {}
      throw new Error(msg);
    }

    const data = await res.json()
    // Piston response: { run: { stdout, stderr, code, signal, output } }
    
    if (data.message) throw new Error(data.message)

    const stdout = (data.run?.stdout || '').trim()
    const stderr = (data.run?.stderr || '').trim()

    if (data.run?.code !== 0 && !stdout) {
      return { stdout: null, stderr: stderr, error: stderr || 'Execution failed' }
    }

    return { stdout, stderr: stderr || null, error: null }
  } catch (err) {
    return { stdout: null, error: err.message }
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
    // If no JDoodle keys, fallback to Piston!
    return runPiston(code, language, input)
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
      // Use Piston for all compiled languages — it's free and reliable!
      execResult = await runPiston(code, selectedLanguage, testCase.input)
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
    } else if (language === 'Python3' || language === 'Python') {
      const pyodide = await getPyodide()
      let stdout = ''
      pyodide.setStdout({ batched: (s) => { stdout += s + '\n' } })
      await pyodide.runPythonAsync(code)
      result = { stdout: stdout.trim(), error: null }
    } else {
      // Compiled languages via Piston
      result = await runPiston(code, language, '')
    }
    return { success: true, output: result.stdout || result.error, executionTime: 0, error: result.error }
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

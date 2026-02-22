import { useState, useRef, useEffect } from 'react'
import { getLanguageIcon } from './languageIcons'
import { validateLanguageMatch } from '../../utils/languageDetector'

// Monaco language mapping
const MONACO_LANGUAGE_MAP = {
  "C++": "cpp",
  "Java": "java",
  "Python3": "python",
  "Python": "python",
  "JavaScript": "javascript",
  "TypeScript": "typescript",
  "C#": "csharp",
  "C": "c",
  "Go": "go",
  "Kotlin": "kotlin",
  "Swift": "swift",
  "Rust": "rust",
  "Ruby": "ruby",
  "PHP": "php",
  "Dart": "dart",
  "Scala": "scala",
  "Elixir": "elixir",
  "Erlang": "erlang",
  "Racket": "racket"
}

// Starter code templates
const STARTER_TEMPLATES = {
  "C++": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}",
  "Java": "class Solution {\n    public int solve(int[] arr) {\n        // Your code here\n        return 0;\n    }\n}",
  "Python3": "def solution(arr):\n    # Your code here\n    return 0",
  "Python": "def solution(arr):\n    # Your code here\n    return 0",
  "JavaScript": "function solution(arr) {\n    // Your code here\n    return 0;\n}",
  "TypeScript": "function solution(arr: number[]): number {\n    // Your code here\n    return 0;\n}",
  "C#": "using System;\n\nclass Solution {\n    public int Solve(int[] arr) {\n        // Your code here\n        return 0;\n    }\n}",
  "C": "#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}",
  "Go": "package main\n\nfunc solution(arr []int) int {\n    // Your code here\n    return 0\n}",
  "Kotlin": "fun solution(arr: IntArray): Int {\n    // Your code here\n    return 0\n}",
  "Swift": "func solution(arr: [Int]) -> Int {\n    // Your code here\n    return 0\n}",
  "Rust": "fn solution(arr: Vec<i32>) -> i32 {\n    // Your code here\n    0\n}",
  "Ruby": "def solution(arr)\n    # Your code here\n    0\nend",
  "PHP": "<?php\nfunction solution($arr) {\n    // Your code here\n    return 0;\n}\n?>",
  "Dart": "int solution(List<int> arr) {\n    // Your code here\n    return 0;\n}",
  "Scala": "object Solution {\n    def solve(arr: Array[Int]): Int = {\n        // Your code here\n        0\n    }\n}",
  "Elixir": "defmodule Solution do\n  def solve(arr) do\n    # Your code here\n    0\n  end\nend",
  "Erlang": "-module(solution).\n-export([solve/1]).\n\nsolve(Arr) ->\n    % Your code here\n    0.",
  "Racket": "(define (solution arr)\n  ; Your code here\n  0)"
}

// Languages with working execution (Python3 via Pyodide, JS via Web Worker)
// All others will show "Coming Soon" in the dropdown
const SUPPORTED_LANGUAGES = new Set(['Python3', 'Python', 'JavaScript'])

// Language groups for 3-column layout
const LANGUAGE_GROUPS = [
  {
    title: "Column 1",
    languages: ["C++", "Java", "Python3", "Python", "JavaScript", "TypeScript", "C#", "C"]
  },
  {
    title: "Column 2",
    languages: ["Go", "Kotlin", "Swift", "Rust", "Ruby", "PHP", "Dart", "Scala"]
  },
  {
    title: "Column 3",
    languages: ["Elixir", "Erlang", "Racket"]
  }
]

/**
 * LanguageSelector Component
 * 
 * Multi-column dropdown for selecting programming languages
 * 
 * @param {string} selectedLanguage - Currently selected language
 * @param {function} onLanguageChange - Callback when language changes
 * @param {boolean} hasUserCode - Whether user has written code (prevents template reset)
 * @param {string} currentCode - Current code in the editor (for mismatch detection)
 */
const LanguageSelector = ({
  selectedLanguage = "Python3",
  onLanguageChange,
  hasUserCode = false,
  currentCode = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showMismatchWarning, setShowMismatchWarning] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Check for language mismatch when code or selected language changes
  useEffect(() => {
    if (currentCode && currentCode.trim() !== '' && hasUserCode) {
      const validation = validateLanguageMatch(currentCode, selectedLanguage)
      setShowMismatchWarning(!validation.isMatch && validation.confidence === 'high')
    } else {
      setShowMismatchWarning(false)
    }
  }, [currentCode, selectedLanguage, hasUserCode])

  const handleLanguageSelect = (language) => {
    const monacoLanguage = MONACO_LANGUAGE_MAP[language]
    const starterTemplate = STARTER_TEMPLATES[language]

    if (onLanguageChange) {
      onLanguageChange({
        displayName: language,
        monacoLanguage: monacoLanguage,
        starterTemplate: starterTemplate,
        shouldLoadTemplate: !hasUserCode
      })
    }

    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        {/* Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1c1c27] border border-[#2A2A35] hover:bg-[#252532] transition-all text-white font-medium text-sm"
        >
          <span className="text-lg">&lt; /&gt;</span>
          <span>{selectedLanguage}</span>
          <span className={`material-symbols-outlined text-base transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>

        {/* Mismatch Warning Badge */}
        {showMismatchWarning && (
          <div className="px-2 py-1 rounded-md bg-yellow-500/15 border border-yellow-500/30 flex items-center gap-1">
            <span className="text-yellow-300 text-sm">⚠</span>
            <span className="text-yellow-300 text-xs font-medium whitespace-nowrap">
              Code does not match selected language
            </span>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 bg-[#1c1c27] border border-[#2A2A35] rounded-xl shadow-2xl z-50 w-[600px] max-h-[260px] overflow-y-auto p-4 pr-2"
          style={{ top: '110%' }}
        >
          {/* 3-Column Grid */}
          <div className="grid grid-cols-3 gap-4">
            {LANGUAGE_GROUPS.map((group, groupIndex) => (
              <div key={groupIndex} className="flex flex-col gap-1">
                {group.languages.map((language) => {
                  const isSelected = selectedLanguage === language
                  const isSupported = SUPPORTED_LANGUAGES.has(language)

                  return (
                    <button
                      key={language}
                      onClick={() => isSupported && handleLanguageSelect(language)}
                      disabled={!isSupported}
                      title={!isSupported ? `${language} — coming soon!` : language}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all text-sm ${!isSupported
                        ? 'text-slate-600 cursor-not-allowed opacity-50'
                        : isSelected
                          ? 'text-blue-400 font-bold border-l-2 border-[#2b2bee]'
                          : 'text-slate-300 hover:bg-[#2b2bee26] hover:text-[#76a0ff]'
                        }`}
                    >
                      {/* Left side: Icon + Language Name */}
                      <div className="flex items-center gap-3">
                        <img
                          src={getLanguageIcon(language)}
                          alt={`${language} icon`}
                          className={`w-5 h-5 ${isSupported ? 'opacity-80' : 'opacity-30 grayscale'}`}
                        />
                        <span>{language}</span>
                      </div>

                      {/* Right side: check for selected, 'Soon' badge for unsupported */}
                      {isSelected && (
                        <span className="material-symbols-outlined text-sm text-blue-400">check</span>
                      )}
                      {!isSupported && (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded">
                          Soon
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
export { MONACO_LANGUAGE_MAP, STARTER_TEMPLATES, LANGUAGE_GROUPS }

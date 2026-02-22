/**
 * Language Detection Utility
 * 
 * Detects programming language from code using pattern matching.
 * Used to validate that the selected language matches the written code.
 */

/**
 * Language detection patterns
 * Each language has multiple patterns to check for common syntax elements
 */
const LANGUAGE_PATTERNS = {
  'Python3': [
    /def\s+\w+\s*\(/,           // function definition
    /import\s+\w+/,             // import statement
    /from\s+\w+\s+import/,      // from-import statement
    /print\s*\(/,               // print function
    /:\s*$/m,                   // colon at end of line (if/for/while/def)
    /elif\s+/,                  // elif keyword
    /lambda\s+/,                // lambda keyword
  ],
  'Python': [
    /def\s+\w+\s*\(/,
    /import\s+\w+/,
    /from\s+\w+\s+import/,
    /print\s*\(/,
    /:\s*$/m,
    /elif\s+/,
    /lambda\s+/,
  ],
  'C++': [
    /#include\s*[<"]/,          // include directive
    /std::/,                    // std namespace
    /int\s+main\s*\(/,          // main function
    /cout\s*<<|cin\s*>>/,       // iostream operations
    /vector\s*</,               // vector template
    /using\s+namespace/,        // using namespace
    /::/,                       // scope resolution
  ],
  'Java': [
    /public\s+class\s+\w+/,     // class definition
    /public\s+static\s+void\s+main/, // main method
    /System\.out\.print/,       // print statement
    /new\s+\w+\s*\(/,          // object creation
    /import\s+java\./,          // java import
    /@Override/,                // annotation
    /\.length\(\)/,             // .length() method
  ],
  'JavaScript': [
    /function\s+\w+\s*\(/,      // function declaration
    /const\s+\w+\s*=/,          // const declaration
    /let\s+\w+\s*=/,            // let declaration
    /var\s+\w+\s*=/,            // var declaration
    /console\.log\s*\(/,        // console.log
    /=>\s*{/,                   // arrow function
    /\.forEach\s*\(/,           // forEach method
    /\.map\s*\(/,               // map method
  ],
  'TypeScript': [
    /:\s*(string|number|boolean|any|void)/, // type annotations
    /interface\s+\w+/,          // interface definition
    /type\s+\w+\s*=/,           // type alias
    /function\s+\w+\s*\([^)]*:\s*\w+/, // typed function params
    /const\s+\w+:\s*\w+/,       // typed const
    /as\s+\w+/,                 // type assertion
    /<\w+>/,                    // generic type
  ],
  'C#': [
    /using\s+System/,           // using System
    /class\s+\w+/,              // class definition
    /public\s+\w+\s+\w+\s*\(/, // method with access modifier
    /Console\.Write/,           // Console operations
    /namespace\s+\w+/,          // namespace
    /\[\w+\]/,                  // attributes
    /get;\s*set;/,              // properties
  ],
  'C': [
    /#include\s*[<"]\w+\.h[>"]/,// include header
    /int\s+main\s*\(/,          // main function
    /printf\s*\(/,              // printf
    /scanf\s*\(/,               // scanf
    /malloc\s*\(/,              // malloc
    /free\s*\(/,                // free
  ],
  'Go': [
    /package\s+\w+/,            // package declaration
    /func\s+\w+\s*\(/,          // function declaration
    /import\s+\(/,              // import block
    /fmt\.Print/,               // fmt package
    /:=\s*/,                    // short variable declaration
    /go\s+\w+\(/,               // goroutine
    /chan\s+\w+/,               // channel
  ],
  'Kotlin': [
    /fun\s+\w+\s*\(/,           // function declaration
    /val\s+\w+/,                // val declaration
    /var\s+\w+/,                // var declaration
    /println\s*\(/,             // println
    /data\s+class/,             // data class
    /when\s*\{/,                // when expression
    /::\s*class/,               // class reference
  ],
  'Swift': [
    /func\s+\w+\s*\(/,          // function declaration
    /var\s+\w+:\s*\w+/,         // typed var
    /let\s+\w+:\s*\w+/,         // typed let
    /print\s*\(/,               // print
    /import\s+Foundation/,      // Foundation import
    /\?\./,                     // optional chaining
    /guard\s+let/,              // guard statement
  ],
  'Rust': [
    /fn\s+\w+\s*\(/,            // function declaration
    /let\s+mut\s+\w+/,          // mutable variable
    /println!\s*\(/,            // println macro
    /impl\s+\w+/,               // impl block
    /&str|&mut/,                // references
    /use\s+std::/,              // use statement
    /::\w+/,                    // path separator
  ],
  'Ruby': [
    /def\s+\w+/,                // method definition
    /end\s*$/m,                 // end keyword
    /puts\s+/,                  // puts
    /\.each\s+do/,              // each iterator
    /@\w+/,                     // instance variable
    /require\s+/,               // require
    /class\s+\w+\s*</,          // class with inheritance
  ],
  'PHP': [
    /<\?php/,                   // PHP opening tag
    /\$\w+\s*=/,                // variable assignment
    /echo\s+/,                  // echo statement
    /function\s+\w+\s*\(/,      // function declaration
    /namespace\s+\w+/,          // namespace
    /use\s+\w+\\/,              // use statement with namespace
    /->/,                       // object operator
  ],
  'Dart': [
    /void\s+main\s*\(/,         // main function
    /import\s+['"]dart:/,       // dart import
    /var\s+\w+\s*=/,            // var declaration
    /final\s+\w+/,              // final declaration
    /class\s+\w+/,              // class declaration
    /\?\?/,                     // null-aware operator
    /async\s*{/,                // async function
  ],
  'Scala': [
    /def\s+\w+\s*\(/,           // def keyword
    /object\s+\w+/,             // object declaration
    /val\s+\w+/,                // val declaration
    /var\s+\w+/,                // var declaration
    /println\s*\(/,             // println
    /=>/,                       // lambda arrow
    /case\s+class/,             // case class
  ],
  'Elixir': [
    /defmodule\s+\w+/,          // module definition
    /def\s+\w+\s*\(/,           // function definition
    /do\s*$/m,                  // do keyword
    /end\s*$/m,                 // end keyword
    /IO\.puts/,                 // IO.puts
    /|>/,                       // pipe operator
    /%{\s*\w+:/,                // map syntax
  ],
  'Erlang': [
    /-module\s*\(/,             // module declaration
    /-export\s*\(/,             // export declaration
    /\w+\s*\([^)]*\)\s*->/,     // function clause
    /io:format/,                // io:format
    /spawn\s*\(/,               // spawn
    /receive\s*$/m,             // receive
  ],
  'Racket': [
    /\(define\s+\(/,            // define function
    /\(lambda\s+\(/,            // lambda
    /\(let\s+\(/,               // let binding
    /\(if\s+/,                  // if expression
    /\(map\s+/,                 // map function
    /#lang\s+racket/,           // lang directive
  ],
}

/**
 * Detect the programming language from code content
 * @param {string} code - The code to analyze
 * @returns {string|null} - The detected language name or null if uncertain
 */
export const detectLanguageFromCode = (code) => {
  if (!code || code.trim() === '') {
    return null
  }

  const scores = {}
  
  // Score each language based on pattern matches
  for (const [language, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
    let score = 0
    
    for (const pattern of patterns) {
      if (pattern.test(code)) {
        score++
      }
    }
    
    scores[language] = score
  }
  
  // Find the language with the highest score
  let maxScore = 0
  let detectedLanguage = null
  
  for (const [language, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      detectedLanguage = language
    }
  }
  
  // Only return detection if we have reasonable confidence (at least 2 pattern matches)
  return maxScore >= 2 ? detectedLanguage : null
}

/**
 * Check if the selected language matches the code content
 * @param {string} code - The code to analyze
 * @param {string} selectedLanguage - The language selected by the user
 * @returns {Object} - { isMatch: boolean, detectedLanguage: string|null, confidence: string }
 */
export const validateLanguageMatch = (code, selectedLanguage) => {
  const detectedLanguage = detectLanguageFromCode(code)
  
  // If we can't detect the language, assume it's okay
  if (!detectedLanguage) {
    return {
      isMatch: true,
      detectedLanguage: null,
      confidence: 'low',
      message: null,
    }
  }
  
  // Normalize language names (Python3 and Python are the same)
  const normalizedSelected = selectedLanguage === 'Python3' ? 'Python' : selectedLanguage
  const normalizedDetected = detectedLanguage === 'Python3' ? 'Python' : detectedLanguage
  
  const isMatch = normalizedSelected === normalizedDetected
  
  return {
    isMatch,
    detectedLanguage,
    confidence: 'high',
    message: isMatch 
      ? null 
      : `Language mismatch: Your code appears to be written in ${detectedLanguage}, but ${selectedLanguage} is selected.`,
  }
}

/**
 * Get a friendly language name for display
 * @param {string} language - The language identifier
 * @returns {string} - Display name
 */
export const getLanguageDisplayName = (language) => {
  const displayNames = {
    'Python3': 'Python',
    'Python': 'Python',
    'C++': 'C++',
    'Java': 'Java',
    'JavaScript': 'JavaScript',
    'TypeScript': 'TypeScript',
    'C#': 'C#',
    'C': 'C',
    'Go': 'Go',
    'Kotlin': 'Kotlin',
    'Swift': 'Swift',
    'Rust': 'Rust',
    'Ruby': 'Ruby',
    'PHP': 'PHP',
    'Dart': 'Dart',
    'Scala': 'Scala',
    'Elixir': 'Elixir',
    'Erlang': 'Erlang',
    'Racket': 'Racket',
  }
  
  return displayNames[language] || language
}

export default {
  detectLanguageFromCode,
  validateLanguageMatch,
  getLanguageDisplayName,
}

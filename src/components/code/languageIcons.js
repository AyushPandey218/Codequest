/**
 * Language Icon Mappings
 * 
 * Maps programming language names to their respective icon paths.
 * Icons should be placed in public/icons/ directory.
 */

export const LANGUAGE_ICONS = {
  "C++": "/icons/cpp.svg",
  "Java": "/icons/java.svg",
  "Python3": "/icons/python.svg",
  "Python": "/icons/python.svg",
  "JavaScript": "/icons/javascript.svg",
  "TypeScript": "/icons/typescript.svg",
  "C#": "/icons/csharp.svg",
  "C": "/icons/c.svg",
  
  "Go": "/icons/go.svg",
  "Kotlin": "/icons/kotlin.svg",
  "Swift": "/icons/swift.svg",
  "Rust": "/icons/rust.svg",
  "Ruby": "/icons/ruby.svg",
  "PHP": "/icons/php.svg",
  "Dart": "/icons/dart.svg",
  "Scala": "/icons/scala.svg",
  
  "Elixir": "/icons/elixir.svg",
  "Erlang": "/icons/erlang.svg",
  "Racket": "/icons/racket.svg"
}

/**
 * Get icon path for a language, with fallback
 */
export const getLanguageIcon = (language) => {
  return LANGUAGE_ICONS[language] || "/icons/default-code.svg"
}

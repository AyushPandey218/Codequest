/**
 * Language to File Extension Mapping
 * Maps programming language names to their file extensions
 */

export const LANGUAGE_EXTENSIONS = {
  "C++": "cpp",
  "Java": "java",
  "Python3": "py",
  "Python": "py",
  "JavaScript": "js",
  "TypeScript": "ts",
  "C#": "cs",
  "C": "c",
  "Go": "go",
  "Kotlin": "kt",
  "Swift": "swift",
  "Rust": "rs",
  "Ruby": "rb",
  "PHP": "php",
  "Dart": "dart",
  "Scala": "scala",
  "Elixir": "ex",
  "Erlang": "erl",
  "Racket": "rkt"
};

/**
 * Get file extension for a language
 * @param {string} language - The language name (e.g., "Python3", "JavaScript")
 * @returns {string} - The file extension (e.g., "py", "js")
 */
export const getLanguageExtension = (language) => {
  return LANGUAGE_EXTENSIONS[language] || "txt";
};

/**
 * Get filename for a language
 * @param {string} language - The language name
 * @param {string} basename - The base filename (default: "solution")
 * @returns {string} - The full filename (e.g., "solution.py", "solution.js")
 */
export const getLanguageFilename = (language, basename = "solution") => {
  const extension = getLanguageExtension(language);
  return `${basename}.${extension}`;
};

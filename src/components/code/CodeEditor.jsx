import { useState } from 'react'
import Editor from '@monaco-editor/react'

/**
 * Monaco Code Editor Component
 * 
 * A lightweight wrapper around @monaco-editor/react with sensible defaults
 * 
 * @param {string} value - Current code content (controlled)
 * @param {function} onChange - Callback function that receives updated code
 * @param {string} language - Programming language (python, javascript, java, cpp, etc.)
 * @param {string} theme - Editor theme (vs-dark, light, hc-black)
 * @param {string} height - Editor height (100%, 400px, 50vh, etc.)
 * @param {string} width - Editor width (100%, 600px, etc.)
 * @param {boolean} readOnly - Make editor read-only
 * @param {object} options - Additional Monaco editor options
 */
const CodeEditor = ({
  value = '',
  onChange,
  language = 'python',
  theme = 'vs-dark',
  height = '100%',
  width = '100%',
  readOnly = false,
  options = {},
}) => {
  const [isLoading, setIsLoading] = useState(true)

  // Lightweight default options
  const defaultOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 4,
    wordWrap: 'on',
    padding: { top: 16, bottom: 16 },
    readOnly: readOnly,
    ...options,
  }

  const handleEditorChange = (newValue) => {
    if (onChange) {
      onChange(newValue || '')
    }
  }

  const handleEditorDidMount = (editor, monaco) => {
    setIsLoading(false)

    // Add Ctrl+Enter shortcut to trigger run code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      window.dispatchEvent(new CustomEvent('monaco-run-code'))
    })

    // Focus editor on mount
    editor.focus()
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] z-10">
          <div className="text-white flex flex-col items-center gap-3">
            <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
            <p className="text-sm">Loading Editor...</p>
          </div>
        </div>
      )}
      
      <Editor
        height={height}
        width={width}
        language={language}
        theme={theme}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={defaultOptions}
        loading={null}
      />
    </div>
  )
}

export default CodeEditor

# Code Editor Components

## CodeEditor

A lightweight, reusable Monaco Editor wrapper component.

### Features
- ✅ Uses `@monaco-editor/react`
- ✅ Dark theme (vs-dark) by default
- ✅ Controlled component (value/onChange)
- ✅ Responsive sizing
- ✅ No inline styles (uses Tailwind classes)
- ✅ Clean and lightweight
- ✅ TypeScript-ready prop types

### Usage

```jsx
import CodeEditor from '../../components/code/CodeEditor'

function MyComponent() {
  const [code, setCode] = useState('print("Hello World")')

  return (
    <CodeEditor
      value={code}
      onChange={setCode}
      language="python"
      theme="vs-dark"
      height="500px"
    />
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string | `''` | Current code content (controlled) |
| `onChange` | function | - | Callback that receives updated code |
| `language` | string | `'python'` | Programming language |
| `theme` | string | `'vs-dark'` | Editor theme |
| `height` | string | `'100%'` | Editor height |
| `width` | string | `'100%'` | Editor width |
| `readOnly` | boolean | `false` | Make editor read-only |
| `options` | object | `{}` | Additional Monaco options |

### Supported Languages

- `python`
- `javascript`
- `typescript`
- `java`
- `cpp` (C++)
- `csharp` (C#)
- `go`
- `rust`
- `php`
- `ruby`
- And 70+ more!

### Supported Themes

- `vs-dark` (default dark theme)
- `light` (light theme)
- `hc-black` (high contrast dark)

### Examples

#### Basic Python Editor
```jsx
<CodeEditor
  value={code}
  onChange={setCode}
  language="python"
/>
```

#### JavaScript with Custom Height
```jsx
<CodeEditor
  value={jsCode}
  onChange={setJsCode}
  language="javascript"
  height="400px"
/>
```

#### Read-Only Code Display
```jsx
<CodeEditor
  value={solutionCode}
  language="python"
  readOnly={true}
/>
```

#### Light Theme
```jsx
<CodeEditor
  value={code}
  onChange={setCode}
  theme="light"
/>
```

#### Custom Monaco Options
```jsx
<CodeEditor
  value={code}
  onChange={setCode}
  options={{
    fontSize: 16,
    lineNumbers: 'off',
    minimap: { enabled: true },
  }}
/>
```

### Keyboard Shortcuts

Built-in shortcuts:
- `Ctrl/Cmd + Enter` - Triggers 'monaco-run-code' event
- `Ctrl/Cmd + F` - Find
- `Ctrl/Cmd + H` - Find and Replace
- `Ctrl/Cmd + /` - Toggle comment
- All standard Monaco/VS Code shortcuts

### Events

The component emits custom events:

```jsx
// Listen for run code event
useEffect(() => {
  const handleRunCode = () => {
    console.log('Run code triggered!')
  }
  
  window.addEventListener('monaco-run-code', handleRunCode)
  return () => window.removeEventListener('monaco-run-code', handleRunCode)
}, [])
```

### Implementation Details

- **Lazy Loading**: Shows spinner while Monaco loads
- **Automatic Layout**: Responsive to container size
- **Auto-focus**: Editor focuses on mount
- **No Inline Styles**: Uses Tailwind classes only
- **Controlled Component**: Fully controlled via props
- **Clean API**: Simple and intuitive props

### Design Decisions

1. **No inline styles** - Uses Tailwind CSS classes
2. **Controlled component** - Value and onChange are required for controlled usage
3. **Lightweight** - Minimal configuration, sensible defaults
4. **Reusable** - Can be used anywhere in the app
5. **Responsive** - Works with percentage-based heights/widths

### Where Used

This component is currently used in:
- `src/pages/quests/QuestCoding.jsx` - Quest coding interface
- `src/pages/clash/LiveCodeClash.jsx` - Live code clash editor

### Best Practices

✅ **DO:**
- Use controlled component pattern (value/onChange)
- Wrap in a container with defined dimensions
- Use responsive units (%, vh, etc.) for flexibility
- Keep it simple - use defaults when possible

❌ **DON'T:**
- Import Monaco directly in pages
- Use inline styles
- Hardcode values that should be props
- Create multiple editor instances unnecessarily

### Performance

- **Bundle Size**: ~3MB (Monaco Editor core)
- **Lazy Loaded**: Yes, via `@monaco-editor/react`
- **Web Workers**: Monaco uses web workers automatically
- **Memory**: Single editor instance per page recommended

---

**Questions?** Check `MONACO_EDITOR_GUIDE.md` for more details.

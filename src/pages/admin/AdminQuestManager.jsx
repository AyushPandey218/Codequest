import { useState, useEffect, useRef } from 'react'
import { quests as initialQuests, questDetails as initialQuestDetails } from '../../data/quests'

// ─── Helpers ────────────────────────────────────────────────────────────────

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const CATEGORIES = ['arrays', 'strings', 'math', 'algorithms', 'stacks', 'trees', 'graphs', 'dynamic-programming', 'sorting', 'searching', 'recursion', 'other']
const LANGUAGES = ['Python3', 'JavaScript', 'Java']

const difficultyColor = {
    Easy: 'bg-green-500/15 text-green-400 border-green-500/30',
    Medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    Hard: 'bg-red-500/15 text-red-400 border-red-500/30',
}

const emptyTestCase = () => ({ id: `tc${Date.now()}`, description: '', input: '', expectedOutput: '', isHidden: false })

const emptyForm = () => ({
    title: '',
    description: '',
    icon: '⚡',
    category: 'algorithms',
    difficulty: 'Medium',
    xp: 200,
    duration: '30 min',
    tags: '',
    completions: '0',
    instructions: '',
    hints: [''],
    solution: { Python3: '', JavaScript: '', Java: '' },
    starterCode: { Python3: '', JavaScript: '', Java: '' },
    testCases: [emptyTestCase()],
})

// ─── Components ──────────────────────────────────────────────────────────────

function Toast({ toasts }) {
    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
            {toasts.map(t => (
                <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium backdrop-blur-md animate-slide-up
          ${t.type === 'success' ? 'bg-green-500/20 text-green-300 border-green-500/40' :
                        t.type === 'error' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                            'bg-blue-500/20 text-blue-300 border-blue-500/40'}`}>
                    <span className="material-symbols-outlined text-lg">
                        {t.type === 'success' ? 'check_circle' : t.type === 'error' ? 'error' : 'info'}
                    </span>
                    {t.message}
                </div>
            ))}
        </div>
    )
}

function DeleteModal({ quest, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-[#1c1c27] border border-[#3b3b54] rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
                <div className="flex items-center gap-4 mb-4">
                    <div className="size-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-red-400 text-2xl">delete_forever</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Delete Quest</h3>
                        <p className="text-sm text-slate-400">This action cannot be undone.</p>
                    </div>
                </div>
                <p className="text-slate-300 mb-6">
                    Are you sure you want to delete <span className="font-bold text-white">"{quest.title}"</span>?
                </p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl bg-[#282839] border border-[#3b3b54] text-slate-300 hover:text-white hover:bg-[#3b3b54] transition-all font-medium">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg shadow-red-900/30">
                        Delete Quest
                    </button>
                </div>
            </div>
        </div>
    )
}

function FormField({ label, children, required }) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {label}{required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {children}
        </div>
    )
}

const inputCls = "w-full bg-[#12121a] border border-[#3b3b54] rounded-xl px-3 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors text-sm"
const textareaCls = inputCls + " resize-none font-mono"

function QuestDrawer({ quest, onSave, onClose }) {
    const [form, setForm] = useState(() => {
        if (!quest) return emptyForm()
        const detail = { ...quest }
        return {
            title: detail.title || '',
            description: detail.description || '',
            icon: detail.icon || '⚡',
            category: detail.category || 'algorithms',
            difficulty: detail.difficulty || 'Medium',
            xp: detail.xp || 200,
            duration: detail.duration || '30 min',
            tags: Array.isArray(detail.tags) ? detail.tags.join(', ') : (detail.tags || ''),
            completions: detail.completions || '0',
            instructions: detail.instructions || '',
            hints: detail.hints?.length ? [...detail.hints] : [''],
            solution: { Python3: '', JavaScript: '', Java: '', ...(detail.solution || {}) },
            starterCode: { Python3: '', JavaScript: '', Java: '', ...(detail.starterCode || {}) },
            testCases: detail.testCases?.length ? detail.testCases.map(tc => ({ ...tc })) : [emptyTestCase()],
        }
    })

    const [tab, setTab] = useState('basic')
    const [langTab, setLangTab] = useState('Python3')
    const drawerRef = useRef(null)

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

    const addHint = () => setForm(f => ({ ...f, hints: [...f.hints, ''] }))
    const removeHint = i => setForm(f => ({ ...f, hints: f.hints.filter((_, idx) => idx !== i) }))
    const setHint = (i, val) => setForm(f => ({ ...f, hints: f.hints.map((h, idx) => idx === i ? val : h) }))

    // Test case helpers
    const addTestCase = () => setForm(f => ({ ...f, testCases: [...f.testCases, emptyTestCase()] }))
    const removeTestCase = i => setForm(f => ({ ...f, testCases: f.testCases.filter((_, idx) => idx !== i) }))
    const setTestCase = (i, key, val) => setForm(f => ({
        ...f,
        testCases: f.testCases.map((tc, idx) => idx === i ? { ...tc, [key]: val } : tc),
    }))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.title.trim()) return
        const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
        const hints = form.hints.filter(h => h.trim())
        const testCases = form.testCases.filter(tc => tc.input.trim() || tc.expectedOutput.trim())
        onSave({ ...form, tags, hints, testCases, xp: Number(form.xp) })
    }

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: 'info' },
        { id: 'instructions', label: 'Instructions', icon: 'menu_book' },
        { id: 'hints', label: 'Hints', icon: 'lightbulb' },
        { id: 'tests', label: 'Test Cases', icon: 'science' },
        { id: 'code', label: 'Code', icon: 'code' },
    ]

    return (
        <div className="fixed inset-0 z-[100] flex">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div
                ref={drawerRef}
                className="relative ml-auto w-full max-w-2xl h-screen bg-[#13131c] border-l border-[#3b3b54] flex flex-col shadow-2xl animate-slide-up"
                style={{ animation: 'slideInRight 0.3s ease-out' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#3b3b54] bg-[#1c1c27]">
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-xl">
                                {quest ? 'edit' : 'add'}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">{quest ? 'Edit Quest' : 'Add New Quest'}</h2>
                            <p className="text-xs text-slate-500">{quest ? `Editing: ${quest.title}` : 'Fill in the quest details below'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-[#282839] rounded-lg transition-all">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#3b3b54] bg-[#1c1c27] px-6">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-1.5 px-3 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all -mb-px ${tab === t.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <span className="material-symbols-outlined text-base">{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-4">

                        {/* BASIC INFO TAB */}
                        {tab === 'basic' && (
                            <>
                                <div className="grid grid-cols-[80px_1fr] gap-4">
                                    <FormField label="Icon" required>
                                        <input value={form.icon} onChange={e => set('icon', e.target.value)} className={inputCls + ' text-center text-2xl'} maxLength={4} />
                                    </FormField>
                                    <FormField label="Title" required>
                                        <input value={form.title} onChange={e => set('title', e.target.value)} className={inputCls} placeholder="e.g. Two Sum" required />
                                    </FormField>
                                </div>

                                <FormField label="Description" required>
                                    <textarea value={form.description} onChange={e => set('description', e.target.value)} className={textareaCls} rows={3} placeholder="A short description of the quest..." required />
                                </FormField>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField label="Category" required>
                                        <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </FormField>
                                    <FormField label="Difficulty" required>
                                        <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)} className={inputCls}>
                                            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </FormField>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <FormField label="XP Reward" required>
                                        <input type="number" value={form.xp} onChange={e => set('xp', e.target.value)} className={inputCls} min={1} max={9999} />
                                    </FormField>
                                    <FormField label="Duration">
                                        <input value={form.duration} onChange={e => set('duration', e.target.value)} className={inputCls} placeholder="30 min" />
                                    </FormField>
                                    <FormField label="Completions">
                                        <input value={form.completions} onChange={e => set('completions', e.target.value)} className={inputCls} placeholder="0" />
                                    </FormField>
                                </div>

                                <FormField label="Tags (comma-separated)">
                                    <input value={form.tags} onChange={e => set('tags', e.target.value)} className={inputCls} placeholder="Arrays, Hash Map, Classic" />
                                </FormField>
                            </>
                        )}

                        {/* INSTRUCTIONS TAB */}
                        {tab === 'instructions' && (
                            <FormField label="Instructions (Markdown supported)">
                                <textarea
                                    value={form.instructions}
                                    onChange={e => set('instructions', e.target.value)}
                                    className={textareaCls}
                                    rows={18}
                                    placeholder={`## Quest Title\n\nWrite a function \`solution(arr)\` that...\n\n### Examples\n\`\`\`\nInput: [1, 2, 3]\nOutput: 6\n\`\`\`\n\n### Constraints\n- 0 ≤ arr.length ≤ 10,000`}
                                />
                            </FormField>
                        )}

                        {/* HINTS TAB */}
                        {tab === 'hints' && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-400">Add step-by-step hints shown progressively.</p>
                                    <button type="button" onClick={addHint} className="flex items-center gap-1 text-xs font-bold text-primary hover:text-blue-400 transition-colors">
                                        <span className="material-symbols-outlined text-sm">add</span>
                                        Add Hint
                                    </button>
                                </div>
                                {form.hints.map((hint, i) => (
                                    <div key={i} className="flex gap-2 items-start">
                                        <div className="size-7 rounded-lg bg-[#282839] border border-[#3b3b54] flex items-center justify-center text-xs font-bold text-slate-400 flex-shrink-0 mt-1.5">
                                            {i + 1}
                                        </div>
                                        <input
                                            value={hint}
                                            onChange={e => setHint(i, e.target.value)}
                                            className={inputCls + ' flex-1'}
                                            placeholder={`Hint ${i + 1}...`}
                                        />
                                        {form.hints.length > 1 && (
                                            <button type="button" onClick={() => removeHint(i)} className="mt-1.5 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                                <span className="material-symbols-outlined text-base">remove</span>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* TEST CASES TAB */}
                        {tab === 'tests' && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-400">Define input/output pairs to test user solutions.</p>
                                        <p className="text-xs text-slate-600 mt-0.5">Hidden test cases are not shown to users until after submission.</p>
                                    </div>
                                    <button type="button" onClick={addTestCase} className="flex items-center gap-1 text-xs font-bold text-primary hover:text-blue-400 transition-colors flex-shrink-0">
                                        <span className="material-symbols-outlined text-sm">add</span>
                                        Add Case
                                    </button>
                                </div>

                                {form.testCases.map((tc, i) => (
                                    <div key={tc.id} className="bg-[#12121a] border border-[#3b3b54] rounded-xl p-3 space-y-2">
                                        {/* Row header */}
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-1">
                                                <span className="size-5 rounded bg-[#282839] text-[10px] font-bold text-slate-500 flex items-center justify-center flex-shrink-0">{i + 1}</span>
                                                <input
                                                    value={tc.description}
                                                    onChange={e => setTestCase(i, 'description', e.target.value)}
                                                    className="flex-1 bg-transparent text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none"
                                                    placeholder="Description (e.g. Empty array)"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setTestCase(i, 'isHidden', !tc.isHidden)}
                                                    className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${tc.isHidden
                                                        ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                                                        : 'bg-[#282839] text-slate-500 border-[#3b3b54] hover:text-slate-300'
                                                        }`}
                                                    title="Toggle hidden"
                                                >
                                                    <span className="material-symbols-outlined text-xs">{tc.isHidden ? 'visibility_off' : 'visibility'}</span>
                                                    {tc.isHidden ? 'Hidden' : 'Visible'}
                                                </button>
                                                {form.testCases.length > 1 && (
                                                    <button type="button" onClick={() => removeTestCase(i)} className="p-1 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Input / Output */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Input</label>
                                                <textarea
                                                    value={tc.input}
                                                    onChange={e => setTestCase(i, 'input', e.target.value)}
                                                    className={textareaCls + ' mt-1'}
                                                    rows={2}
                                                    placeholder='e.g. [1, 2, 3]'
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Expected Output</label>
                                                <textarea
                                                    value={tc.expectedOutput}
                                                    onChange={e => setTestCase(i, 'expectedOutput', e.target.value)}
                                                    className={textareaCls + ' mt-1'}
                                                    rows={2}
                                                    placeholder='e.g. 6'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Summary badge */}
                                <div className="flex gap-3 pt-1">
                                    <span className="text-xs text-slate-500">
                                        <span className="text-green-400 font-bold">{form.testCases.filter(t => !t.isHidden).length}</span> visible
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        <span className="text-purple-400 font-bold">{form.testCases.filter(t => t.isHidden).length}</span> hidden
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        <span className="text-white font-bold">{form.testCases.length}</span> total
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* CODE TAB */}
                        {tab === 'code' && (
                            <div className="space-y-4">
                                {/* Language selector */}
                                <div className="flex gap-2 bg-[#1c1c27] border border-[#3b3b54] rounded-xl p-1">
                                    {LANGUAGES.map(lang => (
                                        <button
                                            key={lang}
                                            type="button"
                                            onClick={() => setLangTab(lang)}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${langTab === lang
                                                ? 'bg-primary text-white shadow'
                                                : 'text-slate-400 hover:text-white'
                                                }`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>

                                <FormField label={`Starter Code — ${langTab}`}>
                                    <textarea
                                        value={form.starterCode[langTab]}
                                        onChange={e => setForm(f => ({ ...f, starterCode: { ...f.starterCode, [langTab]: e.target.value } }))}
                                        className={textareaCls}
                                        rows={7}
                                        placeholder={`# Starter code for ${langTab}...`}
                                    />
                                </FormField>

                                <FormField label={`Solution — ${langTab}`}>
                                    <textarea
                                        value={form.solution[langTab]}
                                        onChange={e => setForm(f => ({ ...f, solution: { ...f.solution, [langTab]: e.target.value } }))}
                                        className={textareaCls}
                                        rows={7}
                                        placeholder={`# Solution for ${langTab}...`}
                                    />
                                </FormField>
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-[#3b3b54] bg-[#1c1c27] flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl bg-[#282839] border border-[#3b3b54] text-slate-300 hover:text-white hover:bg-[#3b3b54] transition-all font-medium">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold transition-all shadow-lg shadow-primary/25"
                    >
                        <span className="material-symbols-outlined text-lg">{quest ? 'save' : 'add'}</span>
                        {quest ? 'Save Changes' : 'Create Quest'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const AdminQuestManager = () => {
    // Merge basic quest list with full details
    const buildInitialState = () =>
        initialQuests.map(q => ({
            ...q,
            ...(initialQuestDetails[q.id] || {}),
        }))

    const [quests, setQuests] = useState(buildInitialState)
    const [search, setSearch] = useState('')
    const [diffFilter, setDiffFilter] = useState('all')
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingQuest, setEditingQuest] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [toasts, setToasts] = useState([])

    const addToast = (message, type = 'success') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
    }

    const openAdd = () => { setEditingQuest(null); setDrawerOpen(true) }
    const openEdit = (q) => { setEditingQuest(q); setDrawerOpen(true) }
    const closeDrawer = () => { setDrawerOpen(false); setEditingQuest(null) }

    const handleSave = (formData) => {
        if (editingQuest) {
            setQuests(prev => prev.map(q => q.id === editingQuest.id ? { ...q, ...formData } : q))
            addToast(`"${formData.title}" updated successfully`)
        } else {
            const newId = `q${Date.now()}`
            setQuests(prev => [...prev, { ...formData, id: newId, createdAt: new Date() }])
            addToast(`"${formData.title}" added to quest list`)
        }
        closeDrawer()
    }

    const handleDelete = () => {
        if (!deleteTarget) return
        setQuests(prev => prev.filter(q => q.id !== deleteTarget.id))
        addToast(`"${deleteTarget.title}" deleted`, 'error')
        setDeleteTarget(null)
    }

    const filtered = quests.filter(q => {
        const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
            q.category?.toLowerCase().includes(search.toLowerCase())
        const matchDiff = diffFilter === 'all' || q.difficulty === diffFilter
        return matchSearch && matchDiff
    })

    const stats = {
        total: quests.length,
        easy: quests.filter(q => q.difficulty === 'Easy').length,
        medium: quests.filter(q => q.difficulty === 'Medium').length,
        hard: quests.filter(q => q.difficulty === 'Hard').length,
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="size-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-xl">admin_panel_settings</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Quest Manager</h1>
                    </div>
                    <p className="text-slate-500 text-sm ml-12">Add, edit, and delete coding quests</p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold transition-all shadow-lg shadow-primary/25 hover:scale-[1.01] active:scale-[0.98]"
                >
                    <span className="material-symbols-outlined text-xl">add</span>
                    Add Quest
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Quests', value: stats.total, color: 'text-white', bg: 'bg-[#282839]' },
                    { label: 'Easy', value: stats.easy, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { label: 'Medium', value: stats.medium, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                    { label: 'Hard', value: stats.hard, color: 'text-red-400', bg: 'bg-red-500/10' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} border border-[#3b3b54] rounded-xl p-4 text-center`}>
                        <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search quests by title or category..."
                        className="w-full bg-[#1c1c27] border border-[#3b3b54] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors text-sm"
                    />
                </div>
                {/* Difficulty filter */}
                <div className="flex gap-2">
                    {['all', ...DIFFICULTIES].map(d => (
                        <button
                            key={d}
                            onClick={() => setDiffFilter(d)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all ${diffFilter === d
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-[#1c1c27] border border-[#3b3b54] text-slate-400 hover:text-white'
                                }`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quest Table */}
            <div className="bg-[#1c1c27] border border-[#3b3b54] rounded-2xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[50px_1fr_130px_100px_80px_90px_100px] gap-4 px-5 py-3 border-b border-[#3b3b54] bg-[#13131c]">
                    {['', 'Quest', 'Category', 'Difficulty', 'XP', 'Duration', 'Actions'].map(h => (
                        <span key={h} className="text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</span>
                    ))}
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-[#3b3b54]/50">
                    {filtered.length === 0 ? (
                        <div className="py-16 text-center">
                            <span className="material-symbols-outlined text-5xl text-slate-700 block mb-3">search_off</span>
                            <p className="text-slate-500 font-medium">No quests match your search</p>
                            <button onClick={() => { setSearch(''); setDiffFilter('all') }} className="mt-3 text-primary text-sm hover:underline">
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        filtered.map((quest, idx) => (
                            <div
                                key={quest.id}
                                className="grid grid-cols-[50px_1fr_130px_100px_80px_90px_100px] gap-4 px-5 py-3.5 items-center hover:bg-[#282839]/50 transition-colors group"
                                style={{ animationDelay: `${idx * 30}ms` }}
                            >
                                {/* Icon */}
                                <span className="text-2xl">{quest.icon}</span>

                                {/* Title + Tags */}
                                <div>
                                    <p className="font-bold text-white text-sm">{quest.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{quest.description}</p>
                                    {quest.tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {quest.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[#282839] border border-[#3b3b54] text-slate-400">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Category */}
                                <span className="text-xs text-slate-400 font-mono capitalize">{quest.category}</span>

                                {/* Difficulty */}
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border w-fit ${difficultyColor[quest.difficulty] || 'bg-slate-500/15 text-slate-400 border-slate-500/30'}`}>
                                    {quest.difficulty}
                                </span>

                                {/* XP */}
                                <span className="text-sm font-bold text-yellow-400 flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-sm">stars</span>
                                    {quest.xp}
                                </span>

                                {/* Duration */}
                                <span className="text-xs text-slate-400">{quest.duration}</span>

                                {/* Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEdit(quest)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                                        title="Edit quest"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(quest)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                        title="Delete quest"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer count */}
                <div className="px-5 py-3 border-t border-[#3b3b54]/50 bg-[#13131c]">
                    <p className="text-xs text-slate-600">
                        Showing <span className="text-slate-400 font-medium">{filtered.length}</span> of <span className="text-slate-400 font-medium">{quests.length}</span> quests
                    </p>
                </div>
            </div>

            {/* Modals & Overlays */}
            {drawerOpen && (
                <QuestDrawer quest={editingQuest} onSave={handleSave} onClose={closeDrawer} />
            )}
            {deleteTarget && (
                <DeleteModal quest={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
            )}
            <Toast toasts={toasts} />
        </div>
    )
}

export default AdminQuestManager

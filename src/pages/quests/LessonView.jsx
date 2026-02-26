import { useParams, Link, useNavigate } from 'react-router-dom'
import { modules } from '../../data/modules'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'

const LessonView = () => {
    const { moduleId, lessonId } = useParams()
    const navigate = useNavigate()

    const module = modules.find(m => m.id === parseInt(moduleId))
    const lessonIndex = module?.lessonList?.findIndex(l => l.id === parseInt(lessonId))
    const lesson = module?.lessonList?.[lessonIndex]

    if (!module || !lesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Lesson not found</h2>
                <Button variant="primary" onClick={() => navigate(`/app/modules/${moduleId}`)}>
                    Back to Module
                </Button>
            </div>
        )
    }

    const nextLesson = module.lessonList[lessonIndex + 1]
    const prevLesson = module.lessonList[lessonIndex - 1]

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between">
                <Link
                    to={`/app/modules/${moduleId}`}
                    className="flex items-center gap-2 text-slate-600 dark:text-text-secondary hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span>Back to Module</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Badge variant="primary">{module.title}</Badge>
                    <span className="text-slate-400 font-medium text-sm">
                        Lesson {lessonIndex + 1} of {module.lessonList.length}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <Card variant="elevated" className="overflow-hidden">
                <div className="p-8 space-y-8">
                    <header className="space-y-4 pb-8 border-b border-slate-100 dark:border-border-dark">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                            {lesson.title}
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-text-secondary">
                            {lesson.description}
                        </p>
                    </header>

                    <div className="prose dark:prose-invert max-w-none space-y-6">
                        {lesson.content && lesson.content.length > 0 ? (
                            lesson.content.map((block, idx) => {
                                if (block.type === 'text') {
                                    return (
                                        <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                                            {block.value}
                                        </p>
                                    )
                                }
                                if (block.type === 'code') {
                                    return (
                                        <div key={idx} className="relative group">
                                            <div className="absolute top-0 right-0 px-4 py-2 text-xs font-mono text-slate-500 bg-slate-100 dark:bg-[#1a1a2e] border-b border-l border-slate-200 dark:border-border-dark rounded-bl-lg">
                                                {block.language}
                                            </div>
                                            <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed border border-slate-800">
                                                <code>{block.value}</code>
                                            </pre>
                                        </div>
                                    )
                                }
                                if (block.type === 'heading') {
                                    return (
                                        <h3 key={idx} className="text-2xl font-bold text-slate-900 dark:text-white pt-4">
                                            {block.value}
                                        </h3>
                                    )
                                }
                                return null
                            })
                        ) : (
                            <div className="p-12 text-center bg-slate-50 dark:bg-card-dark rounded-2xl border-2 border-dashed border-slate-200 dark:border-border-dark">
                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">construction</span>
                                <p className="text-slate-500 dark:text-text-secondary text-lg">
                                    Our instructors are currently crafting the content for this lesson.
                                    Stay tuned!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-border-dark">
                {prevLesson ? (
                    <Button
                        variant="secondary"
                        onClick={() => navigate(`/app/modules/${moduleId}/lessons/${prevLesson.id}`)}
                        icon="navigate_before"
                    >
                        Previous: {prevLesson.title}
                    </Button>
                ) : <div />}

                {nextLesson ? (
                    <Button
                        variant="primary"
                        onClick={() => navigate(`/app/modules/${moduleId}/lessons/${nextLesson.id}`)}
                        icon="navigate_next"
                        iconPosition="right"
                    >
                        Next: {nextLesson.title}
                    </Button>
                ) : (
                    <Button
                        variant="success"
                        onClick={() => navigate(`/app/modules/${moduleId}`)}
                        icon="verified"
                    >
                        Complete Module
                    </Button>
                )}
            </div>
        </div>
    )
}

export default LessonView

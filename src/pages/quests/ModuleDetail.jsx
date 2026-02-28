import { useParams, Link, useNavigate } from 'react-router-dom'
import { modules } from '../../data/modules'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'
import { useUser } from '../../context/UserContext'

const ModuleDetail = () => {
    const { moduleId } = useParams()
    const navigate = useNavigate()
    const { moduleProgress } = useUser()
    const module = modules.find(m => m.id === parseInt(moduleId))

    if (!module) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Module not found</h2>
                <Button variant="primary" onClick={() => navigate('/app/modules')}>
                    Back to Modules
                </Button>
            </div>
        )
    }

    const currentModuleProgress = moduleProgress[module.id]?.completedLessons || []
    const completedCount = currentModuleProgress.length
    const progress = (completedCount / module.lessons) * 100
    const isStarted = completedCount > 0
    const isCompleted = completedCount === module.lessons

    const getDifficultyColor = (difficulty) => {
        const colors = {
            easy: 'success',
            medium: 'warning',
            hard: 'danger',
            expert: 'primary',
        }
        return colors[difficulty] || 'default'
    }

    const uncompletedLesson = module.lessonList?.find(l => !currentModuleProgress.includes(l.id)) || module.lessonList?.[0]

    const handleStartModule = () => {
        if (uncompletedLesson) {
            navigate(`/app/modules/${module.id}/lessons/${uncompletedLesson.id}`)
        }
    }

    return (
        <div className="max-w-[1000px] mx-auto space-y-8">
            {/* Back Link */}
            <Link to="/app/modules" className="flex items-center gap-2 text-slate-600 dark:text-text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
                <span>Back to Modules</span>
            </Link>

            {/* Hero Section */}
            <Card variant="elevated" className="overflow-hidden">
                <div className={`h-48 relative bg-gradient-to-br ${module.color}`}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-8xl drop-shadow-2xl">{module.icon}</span>
                    </div>
                </div>
                <div className="p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                                    {module.title}
                                </h1>
                                <Badge variant={getDifficultyColor(module.difficulty)}>
                                    {module.difficulty}
                                </Badge>
                            </div>
                            <p className="text-lg text-slate-600 dark:text-text-secondary max-w-2xl">
                                {module.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {module.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-card-dark text-slate-600 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-border-dark"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 min-w-[200px]">
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full"
                                onClick={handleStartModule}
                                icon={isCompleted ? 'replay' : isStarted ? 'play_arrow' : 'rocket_launch'}
                            >
                                {isCompleted ? 'Review Project' : isStarted ? 'Continue Project' : 'Enroll Now'}
                            </Button>
                            <div className="flex items-center justify-between px-2 py-1">
                                <span className="text-yellow-600 dark:text-yellow-400 font-bold flex items-center gap-1">
                                    <span className="material-symbols-outlined">stars</span>
                                    {module.xp} XP
                                </span>
                                <span className="text-slate-500 dark:text-text-secondary flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    {module.duration}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Progress & Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Course Content */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">list_alt</span>
                        Course Content
                    </h2>

                    <div className="space-y-4">
                        {module.lessonList && module.lessonList.length > 0 ? (
                            module.lessonList.map((lesson, index) => (
                                <Link
                                    key={lesson.id}
                                    to={`/app/modules/${module.id}/lessons/${lesson.id}`}
                                    className="block transition-transform hover:scale-[1.01]"
                                >
                                    <Card
                                        variant="elevated"
                                        className={`p-4 border-l-4 ${currentModuleProgress.includes(lesson.id) ? 'border-l-green-500' : 'border-l-slate-200 dark:border-l-[#282839]'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`size-10 rounded-full flex items-center justify-center font-bold ${currentModuleProgress.includes(lesson.id)
                                                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600'
                                                    : 'bg-slate-100 dark:bg-[#1a1a2e] text-slate-400'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white">{lesson.title}</h4>
                                                    <p className="text-sm text-slate-500 dark:text-text-secondary">{lesson.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs text-slate-400 font-medium">{lesson.duration}</span>
                                                {currentModuleProgress.includes(lesson.id) ? (
                                                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                                                ) : index === completedCount ? (
                                                    <span className="material-symbols-outlined text-primary">play_circle</span>
                                                ) : (
                                                    <span className="material-symbols-outlined text-slate-300">lock</span>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))
                        ) : (
                            <div className="p-8 text-center bg-slate-50 dark:bg-card-dark rounded-xl border border-dashed border-slate-200 dark:border-border-dark">
                                <p className="text-slate-500 dark:text-text-secondary">Curriculum content coming soon!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Progress Card */}
                    <Card variant="elevated" className="p-6">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Your Progress</h3>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-text-secondary">Completion</span>
                                <span className="font-bold text-slate-900 dark:text-white">{Math.round(progress)}%</span>
                            </div>
                            <ProgressBar value={progress} />
                        </div>
                        <p className="text-sm text-slate-500 dark:text-text-secondary">
                            {completedCount} of {module.lessons} lessons completed
                        </p>
                    </Card>

                    {/* Key Details */}
                    <Card variant="elevated" className="p-6">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Module Highlights</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                <span className="material-symbols-outlined text-green-500 text-lg">verified</span>
                                Hands-on Project
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                <span className="material-symbols-outlined text-blue-500 text-lg">workspace_premium</span>
                                Earn 500+ XP
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                <span className="material-symbols-outlined text-purple-500 text-lg">history_edu</span>
                                Project Certificate
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ModuleDetail

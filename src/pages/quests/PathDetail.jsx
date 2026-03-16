import { useParams, Link, useNavigate } from 'react-router-dom'
import { learningPaths } from '../../data/learningPaths'
import { quests } from '../../data/quests'
import { useUser } from '../../context/UserContext'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'

const PathDetail = () => {
    const { pathId } = useParams()
    const navigate = useNavigate()
    const { userProgress } = useUser()

    const path = learningPaths.find(p => p.id === pathId)

    if (!path) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Learning Path not found</h2>
                <Button variant="primary" onClick={() => navigate('/app/paths')}>
                    Back to Paths
                </Button>
            </div>
        )
    }

    const pathQuests = path.questIds.map(id => quests.find(q => q.id === id)).filter(Boolean)
    const completedQuestsInPath = path.questIds.filter(id => userProgress[id]?.completed).length
    const progress = (completedQuestsInPath / path.questIds.length) * 100
    const isCompleted = completedQuestsInPath === path.questIds.length

    const getDifficultyColor = (difficulty) => {
        const colors = {
            'Easy': 'success',
            'Medium': 'warning',
            'Hard': 'danger',
            'Expert': 'primary',
        }
        return colors[difficulty] || 'default'
    }

    return (
        <div className="max-w-[1000px] mx-auto space-y-8">
            {/* Back Link */}
            <Link to="/app/paths" className="flex items-center gap-2 text-slate-600 dark:text-text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
                <span>Back to Learning Paths</span>
            </Link>

            {/* Hero Section */}
            <Card variant="elevated" className="overflow-hidden">
                <div className={`h-48 relative bg-gradient-to-br ${path.color}`}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-8xl drop-shadow-2xl">{path.icon}</span>
                    </div>
                </div>
                <div className="p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                                    {path.title}
                                </h1>
                                <Badge variant={getDifficultyColor(path.difficulty)}>
                                    {path.difficulty}
                                </Badge>
                            </div>
                            <p className="text-lg text-slate-600 dark:text-text-secondary max-w-2xl">
                                {path.description}
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 min-w-[240px]">
                            <Card variant="bordered" className="p-4 bg-slate-50 dark:bg-[#1a1a2e]">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-600 dark:text-text-secondary uppercase font-bold tracking-wider text-[10px]">Your Progress</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{Math.round(progress)}%</span>
                                </div>
                                <ProgressBar value={progress} size="sm" />
                                <p className="text-[10px] text-slate-500 mt-2 text-center">
                                    {completedQuestsInPath} of {path.questIds.length} quests completed
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Journey List */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">route</span>
                    Your Journey
                </h2>

                <div className="space-y-4 relative">
                    {/* Visual Line Connecter */}
                    <div className="absolute left-9 top-4 bottom-4 w-1 bg-slate-200 dark:bg-[#282839] -z-0" />

                    {pathQuests.map((quest, index) => {
                        const isDone = userProgress[quest.id]?.completed;
                        const isNext = index === completedQuestsInPath;
                        const isLocked = index > completedQuestsInPath;

                        return (
                            <Link 
                                key={quest.id} 
                                to={isLocked ? '#' : `/app/quests/${quest.id}`}
                                className={`block relative z-10 transition-transform ${isLocked ? 'cursor-not-allowed' : 'hover:scale-[1.01]'}`}
                                onClick={(e) => isLocked && e.preventDefault()}
                            >
                                <Card
                                    variant="elevated"
                                    className={`p-5 flex items-center gap-6 border-l-4 ${
                                        isDone ? 'border-l-green-500' : isNext ? 'border-l-primary animate-pulse-subtle' : 'border-l-slate-300 dark:border-l-[#282839]'
                                    } ${isLocked ? 'opacity-60' : ''}`}
                                >
                                    {/* Number Circle */}
                                    <div className={`size-8 sm:size-10 rounded-full flex items-center justify-center font-black flex-shrink-0 ${
                                        isDone ? 'bg-green-500 text-white' : 
                                        isNext ? 'bg-primary text-white shadow-lg shadow-primary/30' : 
                                        'bg-slate-200 dark:bg-[#282839] text-slate-500'
                                    }`}>
                                        {isDone ? (
                                            <span className="material-symbols-outlined text-sm sm:text-lg">check</span>
                                        ) : index + 1}
                                    </div>

                                    {/* Quest Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-2xl">{quest.icon}</span>
                                            <h4 className="font-bold text-slate-900 dark:text-white truncate">{quest.title}</h4>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-text-secondary truncate">{quest.description}</p>
                                    </div>

                                    {/* Status Badge / Link */}
                                    <div className="hidden sm:flex items-center gap-4">
                                        <div className="text-right mr-2">
                                            <p className="text-[10px] font-bold text-yellow-500 uppercase">+{quest.xp} XP</p>
                                            <p className="text-[10px] text-slate-400 capitalize">{quest.difficulty}</p>
                                        </div>
                                        {isDone ? (
                                            <Button variant="outline" size="sm" icon="replay">Review</Button>
                                        ) : isLocked ? (
                                            <span className="material-symbols-outlined text-slate-400">lock</span>
                                        ) : (
                                            <Button variant="primary" size="sm" icon="play_arrow">Start</Button>
                                        )}
                                    </div>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Achievement Preview */}
            <Card variant="elevated" className="p-6 border-dashed border-2 border-primary/30 bg-primary/5">
                <div className="flex items-center gap-6">
                    <div className="size-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-4xl shadow-xl rotate-3">
                        <span className="material-symbols-outlined text-5xl">workspace_premium</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Path Completion Reward</h3>
                        <p className="text-sm text-slate-600 dark:text-text-secondary">
                            Finish all quests in this path to unlock the <span className="font-bold text-primary">{path.title} Master</span> badge and earn a bonus of <span className="font-bold text-yellow-500 font-mono">1,000 XP</span>!
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default PathDetail

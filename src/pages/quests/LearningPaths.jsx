import { useState } from 'react'
import { Link } from 'react-router-dom'
import { learningPaths } from '../../data/learningPaths'
import { useUser } from '../../context/UserContext'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'

const LearningPaths = () => {
    const { userProgress } = useUser()

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
        <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                        Learning Paths 🗺️
                    </h1>
                    <p className="text-slate-600 dark:text-text-secondary mt-1">
                        Follow structured journeys to master specific skills
                    </p>
                </div>
            </div>

            {/* Paths Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {learningPaths.map(path => {
                    // Calculate overall path progress
                    const pathQuests = path.questIds;
                    const completedQuestsInPath = pathQuests.filter(id => userProgress[id]?.completed).length;
                    const progress = (completedQuestsInPath / pathQuests.length) * 100;
                    const isCompleted = completedQuestsInPath === pathQuests.length;
                    const isStarted = completedQuestsInPath > 0;

                    return (
                        <Card
                            key={path.id}
                            variant="elevated"
                            hover
                            className="overflow-hidden flex flex-col"
                        >
                            {/* Visual Header */}
                            <div className={`h-32 relative overflow-hidden bg-gradient-to-br ${path.color}`}>
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-6xl drop-shadow-lg">{path.icon}</span>
                                </div>
                                {isCompleted && (
                                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">verified</span>
                                        Mastered
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {path.title}
                                    </h3>
                                    <Badge variant={getDifficultyColor(path.difficulty)} size="sm">
                                        {path.difficulty}
                                    </Badge>
                                </div>

                                <p className="text-sm text-slate-600 dark:text-text-secondary mb-6 flex-1">
                                    {path.description}
                                </p>

                                {/* Progress Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-sm">explore</span>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {pathQuests.length} Quests
                                            </span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                            {completedQuestsInPath}/{pathQuests.length} Complete
                                        </span>
                                    </div>
                                    
                                    <div>
                                        <ProgressBar value={progress} />
                                    </div>

                                    <Link 
                                        to={`/app/paths/${path.id}`} 
                                        className={`block w-full text-center py-2.5 rounded-xl font-bold transition-all mt-4 border-2 flex items-center justify-center gap-2 ${
                                            isCompleted 
                                                ? 'border-primary text-primary hover:bg-primary/10' 
                                                : 'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/25'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {isCompleted ? 'workspace_premium' : 'arrow_forward'}
                                        </span>
                                        {isCompleted ? 'View Path Details' : isStarted ? 'Continue Journey' : 'Begin Journey'}
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Info Message */}
            <Card variant="elevated" className="p-6 bg-slate-100 dark:bg-[#1a1a2e] border-slate-200 dark:border-border-dark">
               <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Why follow a path?</h4>
                    <p className="text-sm text-slate-600 dark:text-text-secondary">
                        Learning paths are curated by experts to take you from beginner to advanced in a logical sequence. 
                        Completing a full path earns you exclusive profile badges and a significant XP boost.
                    </p>
                  </div>
               </div>
            </Card>
        </div>
    )
}

export default LearningPaths

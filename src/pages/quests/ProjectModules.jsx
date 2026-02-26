import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'
import { modules } from '../../data/modules'

const ProjectModules = () => {
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = [
    { id: 'all', label: 'All Modules', icon: 'grid_view' },
    { id: 'web', label: 'Web Dev', icon: 'web' },
    { id: 'python', label: 'Python', icon: 'code' },
    { id: 'data', label: 'Data Science', icon: 'analytics' },
    { id: 'algorithms', label: 'Algorithms', icon: 'psychology' },
  ]

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'success',
      medium: 'warning',
      hard: 'danger',
      expert: 'primary',
    }
    return colors[difficulty] || 'default'
  }

  const filteredModules = modules.filter(module =>
    activeFilter === 'all' || module.category === activeFilter
  )


  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Project Modules 🎓
          </h1>
          <p className="text-slate-600 dark:text-text-secondary mt-1">
            Complete projects to master real-world skills
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="elevated" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-text-secondary">
              Total Modules
            </span>
            <span className="material-symbols-outlined text-blue-500">school</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {modules.length}
          </p>
        </Card>

        <Card variant="elevated" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-text-secondary">
              In Progress
            </span>
            <span className="material-symbols-outlined text-orange-500">pending</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {modules.filter(m => m.completedLessons > 0 && m.completedLessons < m.lessons).length}
          </p>
        </Card>

        <Card variant="elevated" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-text-secondary">
              Completed
            </span>
            <span className="material-symbols-outlined text-green-500">check_circle</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {modules.filter(m => m.completedLessons === m.lessons).length}
          </p>
        </Card>

        <Card variant="elevated" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-text-secondary">
              Total XP
            </span>
            <span className="material-symbols-outlined text-yellow-500">stars</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {modules.reduce((sum, m) => sum + m.xp, 0).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="elevated" className="p-6">
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeFilter === filter.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-slate-100 dark:bg-[#282839] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#323267]'
                }`}
            >
              <span className="material-symbols-outlined text-lg">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredModules.map(module => {
          const progress = (module.completedLessons / module.lessons) * 100
          const isCompleted = module.completedLessons === module.lessons
          const isStarted = module.completedLessons > 0

          return (
            <Card
              key={module.id}
              variant="elevated"
              hover
              className="overflow-hidden"
            >
              {/* Header with gradient */}
              <div className={`h-32 relative overflow-hidden bg-gradient-to-br ${module.color}`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl drop-shadow-lg">{module.icon}</span>
                </div>
                {isCompleted && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Completed
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title & Difficulty */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex-1">
                    {module.title}
                  </h3>
                  <Badge variant={getDifficultyColor(module.difficulty)} size="sm">
                    {module.difficulty}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-text-secondary mb-4">
                  {module.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {module.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#282839] text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-[#323267]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Progress */}
                {isStarted && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Progress
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {module.completedLessons}/{module.lessons} lessons
                      </span>
                    </div>
                    <ProgressBar value={progress} />
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-text-secondary mb-4 pb-4 border-b border-slate-200 dark:border-border-dark">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">schedule</span>
                    <span>{module.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">menu_book</span>
                    <span>{module.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-bold">
                    <span className="material-symbols-outlined text-lg">stars</span>
                    <span>{module.xp} XP</span>
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/app/modules/${module.id}`}>
                  <Button
                    variant={isCompleted ? 'outline' : 'primary'}
                    size="md"
                    className="w-full"
                    icon={isCompleted ? 'replay' : isStarted ? 'play_arrow' : 'rocket_launch'}
                  >
                    {isCompleted ? 'Review Module' : isStarted ? 'Continue Learning' : 'Start Module'}
                  </Button>
                </Link>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredModules.length === 0 && (
        <Card variant="elevated" className="p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4 block">
            search_off
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No modules found
          </h3>
          <p className="text-slate-600 dark:text-text-secondary mb-4">
            Try selecting a different category
          </p>
          <Button variant="primary" onClick={() => setActiveFilter('all')}>
            Show All Modules
          </Button>
        </Card>
      )}

      {/* Info Card */}
      <Card variant="elevated" className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <div className="size-12 rounded-xl bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
            <span className="material-symbols-outlined text-2xl">info</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              About Project Modules
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Project modules are comprehensive learning paths that combine multiple quests into real-world projects.
              Complete all lessons in a module to earn bonus XP and unlock certificates. Each module is designed to
              give you hands-on experience with industry-standard tools and practices.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ProjectModules

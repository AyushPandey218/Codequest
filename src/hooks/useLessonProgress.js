import { useState, useCallback } from 'react'
import { pythonModules } from '../data/pythonLessons'
import { jsModules } from '../data/jsLessons'

const STORAGE_KEY = (trackId) => `cq_lesson_progress_${trackId}`

const loadProgress = (trackId) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(trackId))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const saveProgress = (trackId, progress) => {
  try {
    localStorage.setItem(STORAGE_KEY(trackId), JSON.stringify(progress))
  } catch {
    // ignore
  }
}

const getModulesForTrack = (trackId) => {
  if (trackId === 'js') return jsModules
  return pythonModules
}

export const useLessonProgress = (trackId = 'python') => {
  const [completedLessons, setCompletedLessons] = useState(() => loadProgress(trackId))

  const completeLesson = useCallback((lessonId) => {
    setCompletedLessons(prev => {
      const updated = { ...prev, [lessonId]: true }
      saveProgress(trackId, updated)
      return updated
    })
  }, [trackId])

  const isCompleted = useCallback((lessonId) => {
    return !!completedLessons[lessonId]
  }, [completedLessons])

  const getTotalXP = useCallback(() => {
    const modules = getModulesForTrack(trackId)
    let total = 0
    for (const module of modules) {
      for (const lesson of module.lessons) {
        if (completedLessons[lesson.id]) {
          total += lesson.xp
        }
      }
    }
    return total
  }, [completedLessons, trackId])

  const resetProgress = useCallback(() => {
    setCompletedLessons({})
    saveProgress(trackId, {})
  }, [trackId])

  return { completedLessons, completeLesson, isCompleted, getTotalXP, resetProgress }
}

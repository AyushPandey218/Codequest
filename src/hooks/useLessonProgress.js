import { useCallback, useMemo } from 'react'
import { pythonModules } from '../data/pythonLessons'
import { jsModules } from '../data/jsLessons'
import { cppModules } from '../data/cppLessons'
import { javaModules } from '../data/javaLessons'
import { tsModules } from '../data/tsLessons'
import { sqlModules } from '../data/sqlLessons'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'

const getModulesForTrack = (trackId) => {
  const map = {
    python: pythonModules,
    js: jsModules,
    cpp: cppModules,
    java: javaModules,
    ts: tsModules,
    sql: sqlModules
  }
  return map[trackId] || pythonModules
}

export const useLessonProgress = (trackId = 'python') => {
  const { completeLesson: authCompleteLesson } = useAuth()
  const { moduleProgress } = useUser()

  // Modules belonging to this specific track
  const trackModules = useMemo(() => getModulesForTrack(trackId), [trackId])

  // Derive a flat map of lessonId -> boolean for easier consumption in components
  const completedLessons = useMemo(() => {
    const map = {}
    trackModules.forEach(mod => {
      const prog = moduleProgress?.[mod.id]
      if (prog?.completedLessons) {
        prog.completedLessons.forEach(lessonId => {
          map[lessonId] = true
        })
      }
    })
    return map
  }, [trackModules, moduleProgress])

  /**
   * Completes a lesson.
   * Signature updated to (moduleId, lessonId) to match Firestore structure.
   */
  const completeLesson = useCallback((moduleId, lessonId) => {
    // Basic backward compatibility and error handling
    if (typeof moduleId === 'string' && !lessonId) {
      // Find moduleId if it wasn't provided (old signature)
      const foundMod = trackModules.find(m => m.lessons.some(l => l.id === moduleId))
      if (foundMod) {
        authCompleteLesson(foundMod.id, moduleId)
      } else {
        console.error('Failed to find moduleId for lesson:', moduleId)
      }
    } else {
      authCompleteLesson(moduleId, lessonId)
    }
  }, [trackModules, authCompleteLesson])

  const isCompleted = useCallback((lessonId) => {
    return !!completedLessons[lessonId]
  }, [completedLessons])

  const getTotalXP = useCallback(() => {
    let total = 0
    trackModules.forEach(mod => {
      mod.lessons.forEach(lesson => {
        if (completedLessons[lesson.id]) {
          total += (lesson.xp || 50)
        }
      })
    })
    return total
  }, [completedLessons, trackModules])

  const resetProgress = useCallback(() => {
    // Progress reset is not natively supported for cloud storage without specific logic
    console.warn('Progress reset is disabled for cloud storage.')
  }, [])

  return { completedLessons, completeLesson, isCompleted, getTotalXP, resetProgress, isLoading: !moduleProgress }
}

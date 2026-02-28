import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Hook to fetch all module progress for a specific user
 * @param {string} uid - User ID
 * @returns {Object} { moduleProgress, loading, error }
 */
export const useModuleProgress = (uid) => {
    const [moduleProgress, setModuleProgress] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!uid) {
            setModuleProgress({})
            setLoading(false)
            return
        }

        setLoading(true)

        const q = query(
            collection(db, 'moduleProgress'),
            where('uid', '==', uid)
        )

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const progressMap = {}
                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    progressMap[data.moduleId] = {
                        id: doc.id,
                        ...data
                    }
                })
                setModuleProgress(progressMap)
                setLoading(false)
            },
            (err) => {
                console.error('Firestore error fetching module progress:', err.message)
                setError(err.message)
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [uid])

    return { moduleProgress, loading, error }
}

export default useModuleProgress

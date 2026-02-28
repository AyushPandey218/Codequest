import { useState, useEffect } from 'react'
import { collection, query, getDocs, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

export function useReports() {
    const [reports, setReports] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchReports()
    }, [])

    const fetchReports = async () => {
        try {
            setIsLoading(true)
            const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'))
            const snapshot = await getDocs(q)

            const fetchedReports = snapshot.docs.map(doc => {
                const data = doc.data()
                const createdAt = data.createdAt?.toDate()

                let timeAgo = 'Unknown'
                // Simple time string formatter
                if (createdAt) {
                    const seconds = Math.floor((new Date() - createdAt) / 1000)
                    let interval = seconds / 31536000
                    if (interval > 1) { timeAgo = Math.floor(interval) + 'yr ago'; }
                    else {
                        interval = seconds / 2592000
                        if (interval > 1) { timeAgo = Math.floor(interval) + 'mo ago'; }
                        else {
                            interval = seconds / 86400
                            if (interval > 1) { timeAgo = Math.floor(interval) + 'd ago'; }
                            else {
                                interval = seconds / 3600
                                if (interval > 1) { timeAgo = Math.floor(interval) + 'h ago'; }
                                else {
                                    interval = seconds / 60
                                    if (interval > 1) { timeAgo = Math.floor(interval) + 'm ago'; }
                                    else { timeAgo = Math.floor(seconds) + 's ago'; }
                                }
                            }
                        }
                    }
                }

                return {
                    id: doc.id,
                    type: data.type || 'General',
                    reporter: data.reporterUsername || 'Anonymous',
                    target: data.targetUsername || 'Unknown',
                    content: data.content || 'No content provided',
                    severity: data.severity || 'low',
                    status: data.status || 'pending',
                    time: timeAgo
                }
            })

            setReports(fetchedReports)
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching reports:", error)
            setIsLoading(false)
        }
    }

    const resolveReport = async (reportId) => {
        try {
            const reportRef = doc(db, 'reports', reportId)
            await updateDoc(reportRef, { status: 'resolved' })
            setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r))
        } catch (error) {
            console.error("Error resolving report:", error)
        }
    }

    const dismissReport = async (reportId) => {
        try {
            await deleteDoc(doc(db, 'reports', reportId))
            setReports(prev => prev.filter(r => r.id !== reportId))
        } catch (error) {
            console.error("Error dismissing report:", error)
        }
    }

    return { reports, isLoading, resolveReport, dismissReport }
}

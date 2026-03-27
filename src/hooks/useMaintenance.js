import { useState, useEffect } from 'react'
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

export function useMaintenance() {
    const [maintenanceMode, setMaintenanceMode] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const configRef = doc(db, 'system', 'config')
        
        // Ensure the document exists
        const ensureConfig = async () => {
            const snap = await getDoc(configRef)
            if (!snap.exists()) {
                await setDoc(configRef, { maintenanceMode: false })
            }
        }
        ensureConfig()

        const unsubscribe = onSnapshot(configRef, (doc) => {
            if (doc.exists()) {
                setMaintenanceMode(doc.data().maintenanceMode || false)
            }
            setIsLoading(false)
        }, (error) => {
            console.error("Error listening to maintenance mode:", error)
            setIsLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const toggleMaintenance = async (value) => {
        try {
            const configRef = doc(db, 'system', 'config')
            await updateDoc(configRef, { maintenanceMode: value })
            return true
        } catch (error) {
            console.error("Error toggling maintenance mode:", error)
            throw error
        }
    }

    return { maintenanceMode, isLoading, toggleMaintenance }
}

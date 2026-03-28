import { useState, useEffect } from 'react'
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

export function useMaintenance() {
    const [maintenanceMode, setMaintenanceMode] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const configRef = doc(db, 'system', 'config')
        
        // Ensure the document exists (only if not in demo mode)
        const ensureConfig = async () => {
            try {
                const snap = await getDoc(configRef)
                if (!snap.exists()) {
                    await setDoc(configRef, { maintenanceMode: false })
                }
            } catch (err) {
                console.warn("Could not ensure system config, likely offline or demo mode.", err.message)
            }
        }
        ensureConfig()

        let unsubscribe = () => {}
        try {
            unsubscribe = onSnapshot(configRef, (doc) => {
                if (doc.exists()) {
                    setMaintenanceMode(doc.data().maintenanceMode || false)
                }
                setIsLoading(false)
            }, (error) => {
                console.warn("Error listening to maintenance mode (expected in demo):", error.message)
                setIsLoading(false)
            })
        } catch (err) {
            console.warn("Maintenance listener failed to attach.", err.message)
            setIsLoading(false)
        }

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

import { useState, useEffect, useCallback } from 'react'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useNotification } from '../context/NotificationContext'

/**
 * Hook to manage support tickets for administrators
 */
export const useAdminTickets = () => {
    const [tickets, setTickets] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const { createNotification } = useNotification()

    useEffect(() => {
        setIsLoading(true)
        const q = query(collection(db, 'support_tickets'), orderBy('createdAt', 'desc'))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ticketData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setTickets(ticketData)
            setIsLoading(false)
        }, (err) => {
            console.error('Error fetching support tickets:', err)
            setError(err.message)
            setIsLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const updateTicketStatus = useCallback(async (ticketId, userId, newStatus) => {
        try {
            await updateDoc(doc(db, 'support_tickets', ticketId), {
                status: newStatus,
                updatedAt: new Date()
            })

            // If resolved, notify the user
            if (newStatus === 'resolved' || newStatus === 'closed') {
                await createNotification({
                    title: 'Support Ticket Resolved',
                    message: `Your ticket #${ticketId.slice(0, 5)} has been marked as ${newStatus}.`,
                    type: 'system',
                    link: '/app/support'
                }, userId)
            }

            return true
        } catch (err) {
            console.error('Error updating ticket status:', err)
            throw err
        }
    }, [createNotification])

    const deleteTicket = useCallback(async (ticketId) => {
        try {
            await deleteDoc(doc(db, 'support_tickets', ticketId))
            return true
        } catch (err) {
            console.error('Error deleting ticket:', err)
            throw err
        }
    }, [])

    return {
        tickets,
        isLoading,
        error,
        updateTicketStatus,
        deleteTicket
    }
}

export default useAdminTickets

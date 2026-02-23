import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * AdminRoute - Protects routes that require admin role.
 * Redirects non-admin users to the dashboard.
 */
const AdminRoute = () => {
    const { isAdmin, isLoading } = useAuth()

    if (isLoading) return null

    return isAdmin ? <Outlet /> : <Navigate to="/app/dashboard" replace />
}

export default AdminRoute

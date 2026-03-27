import { Navigate, useLocation } from 'react-router-dom'
import { useMaintenance } from '../hooks/useMaintenance'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from '../components/common/LoadingScreen'

const MaintenanceGuard = ({ children }) => {
    const { maintenanceMode, isLoading } = useMaintenance()
    const { user, isAdmin } = useAuth()
    const location = useLocation()

    if (isLoading) return <LoadingScreen />

    // If maintenance is on, and user is NOT an admin
    if (maintenanceMode && !isAdmin) {
        // Exempt the maintenance page itself to avoid infinite loops
        if (location.pathname === '/maintenance') {
            return children
        }
        
        // Also exempt auth pages if we want staff to be able to login during maintenance
        // (Assume staff know their way to /auth/login)
        if (location.pathname.startsWith('/auth')) {
             return children
        }

        return <Navigate to="/maintenance" replace />
    }

    return children
}

export default MaintenanceGuard

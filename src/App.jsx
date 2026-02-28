import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { NotificationProvider } from './context/NotificationContext'
import router from './router'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function PrivateRoute({ children, allowedRoles, requireBarber }) {
  const { isAuthenticated, role, isBarber } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  if (requireBarber && !isBarber) {
    return <Navigate to="/login" replace />
  }

  return children
}

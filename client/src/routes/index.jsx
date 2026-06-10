import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { PrivateRoute } from '@/routes/PrivateRoute'
import { Layout } from '@/components/layout/Layout'
import { PublicBooking } from '@/pages/public/PublicBooking'
import { Login } from '@/pages/auth/Login'
import { BarberDashboard } from '@/pages/barber/BarberDashboard'
import { BarberAppointments } from '@/pages/barber/BarberAppointments'
import { BarberAvailability } from '@/pages/barber/BarberAvailability'
import { BarberHistory } from '@/pages/barber/BarberHistory'
import { BarberServices } from '@/pages/barber/BarberServices'
import { BarberClients } from '@/pages/barber/BarberClients'
import { BarberProfile } from '@/pages/barber/BarberProfile'

function StaffRedirect() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to="/barber" replace />
}

const barberPanel = (
  <PrivateRoute allowedRoles={['ROLE_ADMIN']} requireBarber>
    <Layout />
  </PrivateRoute>
)

const router = createBrowserRouter([
  { path: '/', element: <PublicBooking /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Navigate to="/" replace /> },
  { path: '/admin', element: <Navigate to="/barber" replace /> },
  { path: '/admin/*', element: <Navigate to="/barber" replace /> },
  {
    element: barberPanel,
    children: [
      { path: 'painel', element: <StaffRedirect /> },
      { path: 'barber', element: <BarberDashboard /> },
      { path: 'barber/appointments', element: <BarberAppointments /> },
      { path: 'barber/clients', element: <BarberClients /> },
      { path: 'barber/availability', element: <BarberAvailability /> },
      { path: 'barber/services', element: <BarberServices /> },
      { path: 'barber/history', element: <BarberHistory /> },
      { path: 'barber/profile', element: <BarberProfile /> },
    ],
  },
])

export function Routes() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

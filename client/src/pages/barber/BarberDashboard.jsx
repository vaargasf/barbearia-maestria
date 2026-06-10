import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { barberService } from '@/services/barber.service'
import { Card } from '@/components/ui/Card'
import { BarberDashboardCharts } from '@/components/barber/BarberDashboardCharts'

export function BarberDashboard() {
  const [profile, setProfile] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [clientsCount, setClientsCount] = useState(0)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      barberService.profile(),
      barberService.myAppointments(),
      barberService.listMyClients(),
      barberService.getStats(),
    ])
      .then(([p, a, clients, s]) => {
        setProfile(p)
        setAppointments(a)
        setClientsCount(clients.length)
        setStats(s)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-white/80">Carregando...</p>

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      {stats && <BarberDashboardCharts stats={stats} />}

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <h2 className="text-maestria-accent font-medium mb-2">Meu perfil</h2>
          {profile && (
            <p className="text-white/80">
              {profile.name} – {profile.email}
            </p>
          )}
          <Link to="/barber/profile" className="text-maestria-accent hover:underline mt-2 inline-block">
            Editar perfil e foto
          </Link>
        </Card>
        <Card>
          <h2 className="text-maestria-accent font-medium mb-2">Agendamentos ativos</h2>
          <p className="text-white/80">{appointments.length} agendamento(s)</p>
          <Link to="/barber/appointments" className="text-maestria-accent hover:underline mt-2 inline-block">
            Ver todos
          </Link>
        </Card>
        <Card>
          <h2 className="text-maestria-accent font-medium mb-2">Meus clientes</h2>
          <p className="text-white/80">{clientsCount} cliente(s) vinculado(s)</p>
          <Link to="/barber/clients" className="text-maestria-accent hover:underline mt-2 inline-block">
            Ver lista
          </Link>
        </Card>
        <Card>
          <h2 className="text-maestria-accent font-medium mb-2">Serviços e disponibilidade</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <Link
              to="/barber/availability"
              className="inline-block px-3 py-1.5 bg-maestria-accent/20 text-maestria-accent rounded font-medium hover:bg-maestria-accent/30"
            >
              Disponibilidade
            </Link>
            <Link
              to="/barber/services"
              className="inline-block px-3 py-1.5 bg-maestria-accent/20 text-maestria-accent rounded font-medium hover:bg-maestria-accent/30"
            >
              Meus serviços
            </Link>
          </div>
        </Card>
      </div>
      <div className="flex gap-2">
        <Link to="/barber/history" className="text-maestria-accent hover:underline">
          Ver histórico de agendamentos
        </Link>
      </div>
    </div>
  )
}

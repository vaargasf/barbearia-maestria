import { NavLink } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'

const barberLinks = [
  { to: '/barber', label: 'Dashboard' },
  { to: '/barber/appointments', label: 'Agendamentos' },
  { to: '/barber/clients', label: 'Meus clientes' },
  { to: '/barber/services', label: 'Meus serviços' },
  { to: '/barber/availability', label: 'Disponibilidade' },
  { to: '/barber/history', label: 'Histórico' },
  { to: '/barber/profile', label: 'Meu perfil' },
]

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-card border-r border-border flex flex-col">
      <div className="p-5 border-b border-border flex items-center gap-3">
        <Logo size="sm" />
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {barberLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/barber'}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-primary/15 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

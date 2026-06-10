import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  const { name, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-6 bg-card/80 backdrop-blur-sm">
      <span className="text-sm text-muted-foreground">
        Olá, <span className="text-foreground font-medium">{name ?? 'Usuário'}</span>
      </span>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        Sair
      </Button>
    </header>
  )
}

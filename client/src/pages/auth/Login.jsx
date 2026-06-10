import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/services/auth.service'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

const demoAccounts = [
  { label: 'Eric', email: 'eric@maestria.com', password: '123456' },
  { label: 'Gustavo', email: 'gustavo@maestria.com', password: '123456' },
]

export function Login() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname

  const { register, handleSubmit, setValue } = useForm()

  const onSubmit = async (data) => {
    setError(null)
    setLoading(true)
    try {
      const res = await authService.login(data.email, data.password)
      login(res)
      const target = from && from !== '/login' && from !== '/' ? from : '/barber'
      navigate(target, { replace: true })
    } catch (e) {
      setError(e?.response?.data?.message ?? 'Falha no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen app-shell">
      <Header />

      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 pt-6">
            <h2 className="text-lg font-semibold mb-1">Área do barbeiro</h2>
            <p className="text-sm text-muted-foreground mb-6">Acesso para Eric, Gustavo e equipe</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm mb-1.5">Email</label>
                <Input type="email" autoComplete="email" {...register('email', { required: true })} />
              </div>
              <div>
                <label className="block text-sm mb-1.5">Senha</label>
                <Input type="password" autoComplete="current-password" {...register('password', { required: true })} />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" className="w-full" loading={loading}>
                Entrar
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-secondary">
              <p className="text-xs text-muted-foreground mb-3">Contas demo</p>
              <div className="flex flex-wrap gap-2">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => {
                      setValue('email', acc.email)
                      setValue('password', acc.password)
                    }}
                    className="text-xs px-2.5 py-1 rounded-md border border-input hover:bg-accent"
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-5 text-center text-muted-foreground text-sm">
              Quer agendar?{' '}
              <Link to="/" className="text-primary hover:underline">
                Voltar ao início
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

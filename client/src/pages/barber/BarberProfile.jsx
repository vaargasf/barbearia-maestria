import { useEffect, useRef, useState } from 'react'
import { CameraIcon } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { barberService } from '@/services/barber.service'
import { getBarberAvatar } from '@/constants/booking'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'

export function BarberProfile() {
  const { updateUser } = useAuth()
  const fileRef = useRef(null)
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    barberService
      .profile()
      .then((p) => {
        setProfile(p)
        setForm({ name: p.name ?? '', phone: p.phone ?? '' })
      })
      .finally(() => setLoading(false))
  }, [])

  const initials = (form.name || profile?.name || '?')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Selecione uma imagem válida.')
      return
    }

    setError(null)
    setMessage(null)
    setUploading(true)

    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      setPreview(dataUrl)
      const updated = await barberService.updateProfileAvatar(dataUrl)
      setProfile(updated)
      setPreview(null)
      setMessage('Foto atualizada com sucesso.')
    } catch (err) {
      setPreview(null)
      setError(err?.response?.data?.message ?? 'Erro ao enviar foto.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      const updated = await barberService.updateProfile(form)
      setProfile(updated)
      updateUser({ name: updated.name })
      setMessage('Perfil atualizado.')
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Erro ao salvar perfil.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-white/80">Carregando...</p>

  const displayAvatar = preview || getBarberAvatar(profile)

  return (
    <div>
      <h1 className="page-title">Meu perfil</h1>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr] max-w-4xl">
        <Card className="flex flex-col items-center p-6 text-center">
          <div className="relative mb-4">
            <Avatar className="h-32 w-32 border-2 border-primary/30">
              {displayAvatar ? (
                <AvatarImage src={displayAvatar} alt={profile?.name} className="object-cover" />
              ) : null}
              <AvatarFallback className="text-2xl bg-secondary text-primary">{initials}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-lg hover:bg-primary/90 disabled:opacity-60"
              aria-label="Alterar foto"
            >
              <CameraIcon size={16} />
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <p className="font-semibold text-foreground">{profile?.name}</p>
          <p className="text-sm text-muted-foreground mt-1">{profile?.email}</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => fileRef.current?.click()}
            loading={uploading}
          >
            Alterar foto
          </Button>
        </Card>

        <Card>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-white/80 mb-1">Nome</label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Telefone</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Email</label>
              <Input value={profile?.email ?? ''} disabled />
              <p className="text-xs text-muted-foreground mt-1">O email não pode ser alterado aqui.</p>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}
            {message && <p className="text-emerald-400 text-sm">{message}</p>}

            <Button type="submit" loading={saving}>
              Salvar alterações
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

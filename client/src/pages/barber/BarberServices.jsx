import { useEffect, useState } from 'react'
import { barberService } from '@/services/barber.service'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Table, TableRow, TableCell } from '@/components/ui/Table'

export function BarberServices() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [editModal, setEditModal] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => barberService.listMyServices().then(setList)

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const openEdit = (s) => {
    setEditModal({
      id: s.id,
      name: s.name,
      price: s.price,
      durationMinutes: s.durationMinutes ?? 0,
      description: s.description ?? '',
      active: s.active ?? true,
    })
  }

  const saveEdit = async () => {
    if (!editModal) return
    setSaving(true)
    try {
      await barberService.updateMyService(editModal.id, {
        name: editModal.name,
        price: editModal.price,
        durationMinutes: editModal.durationMinutes || undefined,
        description: editModal.description || undefined,
        active: editModal.active,
      })
      setEditModal(null)
      load()
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-white/80">Carregando...</p>

  return (
    <div>
      <h1 className="page-title">Meus serviços</h1>
      <Card>
        <p className="text-white/80 mb-4">Edite nome, preço e duração dos seus serviços.</p>
        {list.length === 0 ? (
          <p className="text-white/80">Nenhum serviço cadastrado.</p>
        ) : (
          <Table headers={['Nome', 'Preço', 'Duração', 'Ativo', 'Ações']}>
            {list.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>R$ {s.price}</TableCell>
                <TableCell>{s.durationMinutes ?? '-'} min</TableCell>
                <TableCell>{s.active ? 'Sim' : 'Não'}</TableCell>
                <TableCell>
                  <Button variant="secondary" onClick={() => openEdit(s)}>
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Editar serviço">
        {editModal && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/80 mb-1">Nome</label>
              <Input
                value={editModal.name}
                onChange={(e) => setEditModal((prev) => prev && { ...prev, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Preço (R$)</label>
              <Input
                type="number"
                step="0.01"
                value={editModal.price}
                onChange={(e) => setEditModal((prev) => prev && { ...prev, price: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Duração (min)</label>
              <Input
                type="number"
                value={editModal.durationMinutes}
                onChange={(e) => setEditModal((prev) => prev && { ...prev, durationMinutes: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Descrição</label>
              <Input
                value={editModal.description}
                onChange={(e) => setEditModal((prev) => prev && { ...prev, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={editModal.active}
                onChange={(e) => setEditModal((prev) => prev && { ...prev, active: e.target.checked })}
                className="rounded border-maestria-border/30"
              />
              <label htmlFor="active" className="text-white/80">
                Ativo
              </label>
            </div>
            <Button onClick={saveEdit} loading={saving}>
              Salvar
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}

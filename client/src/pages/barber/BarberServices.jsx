import { useEffect, useState } from 'react'
import { barberService } from '@/services/barber.service'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Table, TableRow, TableCell } from '@/components/ui/Table'

const emptyService = () => ({
  name: '',
  price: 0,
  durationMinutes: 30,
  description: '',
  active: true,
})

export function BarberServices() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [editModal, setEditModal] = useState(null)
  const [createModal, setCreateModal] = useState(false)
  const [newService, setNewService] = useState(emptyService())
  const [deleteModal, setDeleteModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const load = () => barberService.listMyServices().then(setList)

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const openEdit = (s) => {
    setError(null)
    setEditModal({
      id: s.id,
      name: s.name,
      price: s.price,
      durationMinutes: s.durationMinutes ?? 30,
      description: s.description ?? '',
      active: s.active ?? true,
    })
  }

  const openCreate = () => {
    setError(null)
    setNewService(emptyService())
    setCreateModal(true)
  }

  const saveEdit = async () => {
    if (!editModal) return
    setSaving(true)
    setError(null)
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
    } catch (e) {
      setError(e?.response?.data?.message ?? 'Erro ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  const saveCreate = async () => {
    if (!newService.name.trim()) return
    setSaving(true)
    setError(null)
    try {
      await barberService.createMyService({
        name: newService.name,
        price: newService.price,
        durationMinutes: newService.durationMinutes || 30,
        description: newService.description || undefined,
        active: newService.active,
      })
      setCreateModal(false)
      load()
    } catch (e) {
      setError(e?.response?.data?.message ?? 'Erro ao criar serviço.')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteModal) return
    setSaving(true)
    setError(null)
    try {
      await barberService.deleteMyService(deleteModal.id)
      setDeleteModal(null)
      load()
    } catch (e) {
      setError(e?.response?.data?.message ?? 'Erro ao remover serviço.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-white/80">Carregando...</p>

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="page-title mb-0">Meus serviços</h1>
        <Button onClick={openCreate}>Adicionar serviço</Button>
      </div>

      <Card>
        <p className="text-white/80 mb-4">Gerencie seus serviços: adicione, edite ou remova.</p>
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
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="secondary" onClick={() => openEdit(s)}>
                      Editar
                    </Button>
                    <Button variant="ghost" onClick={() => { setError(null); setDeleteModal(s) }}>
                      Remover
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={!!editModal} onClose={() => { setEditModal(null); setError(null) }} title="Editar serviço">
        {editModal && (
          <div className="space-y-4">
            {error && <p className="text-red-400 text-sm">{error}</p>}
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
                step="30"
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
                id="active-edit"
                checked={editModal.active}
                onChange={(e) => setEditModal((prev) => prev && { ...prev, active: e.target.checked })}
                className="rounded border-maestria-border/30"
              />
              <label htmlFor="active-edit" className="text-white/80">
                Ativo
              </label>
            </div>
            <Button onClick={saveEdit} loading={saving}>
              Salvar
            </Button>
          </div>
        )}
      </Modal>

      <Modal open={createModal} onClose={() => { setCreateModal(false); setError(null) }} title="Novo serviço">
        <div className="space-y-4">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div>
            <label className="block text-sm text-white/80 mb-1">Nome</label>
            <Input
              value={newService.name}
              onChange={(e) => setNewService((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-1">Preço (R$)</label>
            <Input
              type="number"
              step="0.01"
              value={newService.price}
              onChange={(e) => setNewService((prev) => ({ ...prev, price: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-1">Duração (min)</label>
            <Input
              type="number"
              step="30"
              value={newService.durationMinutes}
              onChange={(e) => setNewService((prev) => ({ ...prev, durationMinutes: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-1">Descrição</label>
            <Input
              value={newService.description}
              onChange={(e) => setNewService((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <Button onClick={saveCreate} loading={saving} disabled={!newService.name.trim()}>
            Criar serviço
          </Button>
        </div>
      </Modal>

      <Modal open={!!deleteModal} onClose={() => { setDeleteModal(null); setError(null) }} title="Remover serviço">
        {deleteModal && (
          <div className="space-y-4">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <p className="text-white/80">
              Tem certeza que deseja remover o serviço <strong>{deleteModal.name}</strong>?
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setDeleteModal(null)}>
                Cancelar
              </Button>
              <Button onClick={confirmDelete} loading={saving}>
                Confirmar remoção
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

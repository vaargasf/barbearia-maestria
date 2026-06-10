import { useEffect, useState } from 'react'
import { barberService } from '@/services/barber.service'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, TableRow, TableCell } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'

export function BarberAppointments() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelModal, setCancelModal] = useState(null)
  const [proposeModal, setProposeModal] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState(null)

  const today = new Date().toISOString().slice(0, 10)
  const now = new Date()
  const minTimeToday = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const load = () => barberService.myAppointments().then(setList)

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const getApiMessage = (err) =>
    err?.response?.data?.message ?? 'Erro ao processar. Tente novamente.'

  const handleCancel = async () => {
    if (!cancelModal) return
    setActionError(null)
    setActionLoading(true)
    try {
      await barberService.cancelByBarber(cancelModal.appointment.id, cancelModal.message || undefined)
      setCancelModal(null)
      load()
    } catch (e) {
      setActionError(getApiMessage(e))
    } finally {
      setActionLoading(false)
    }
  }

  const handleProposeReschedule = async () => {
    if (!proposeModal || !proposeModal.proposedDate || !proposeModal.proposedStartTime) return
    setActionError(null)
    setActionLoading(true)
    try {
      await barberService.proposeReschedule(proposeModal.appointment.id, {
        proposedDate: proposeModal.proposedDate,
        proposedStartTime: proposeModal.proposedStartTime,
        barberMessage: proposeModal.barberMessage || undefined,
      })
      setProposeModal(null)
      load()
    } catch (e) {
      setActionError(getApiMessage(e))
    } finally {
      setActionLoading(false)
    }
  }

  const canAct = (a) =>
    a.status === 'AGENDADO' || a.status === 'PROPOSTA_REAGENDAMENTO'

  if (loading) return <p className="text-white/80">Carregando...</p>

  return (
    <div>
      <h1 className="page-title">Meus agendamentos</h1>
      <Card>
        {list.length === 0 ? (
          <p className="text-white/80">Nenhum agendamento.</p>
        ) : (
          <Table headers={['Data', 'Horário', 'Cliente', 'Serviço', 'Status', 'Ações']}>
            {list.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.date}</TableCell>
                <TableCell>{(a.startTime || '').slice(0, 5)}</TableCell>
                <TableCell>{a.clientName}</TableCell>
                <TableCell>{a.serviceName}</TableCell>
                <TableCell>
                  <Badge status={a.status}>{a.status}</Badge>
                  {a.status === 'PROPOSTA_REAGENDAMENTO' && a.barberMessage && (
                    <p className="text-white/60 text-sm mt-1">Msg: {a.barberMessage}</p>
                  )}
                </TableCell>
                <TableCell>
                  {canAct(a) && (
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          const today = new Date().toISOString().slice(0, 10)
                          const now = new Date()
                          const defaultTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
                          const useDefault = !a.date || a.date < today
                          setProposeModal({
                            appointment: a,
                            proposedDate: useDefault ? today : a.date,
                            proposedStartTime: useDefault ? defaultTime : (a.startTime || '').slice(0, 5),
                            barberMessage: '',
                          })
                        }}
                      >
                        Propor horário
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setCancelModal({ appointment: a, message: '' })}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={!!cancelModal} onClose={() => { setCancelModal(null); setActionError(null) }} title="Cancelar agendamento">
        {cancelModal && (
          <div className="space-y-4">
            {actionError && <p className="text-red-400 text-sm">{actionError}</p>}
            <p className="text-white/80">
              Cancelar agendamento de {cancelModal.appointment.clientName} em {cancelModal.appointment.date}?
            </p>
            <div>
              <label className="block text-sm text-white/80 mb-1">Mensagem ao cliente (opcional)</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-black border border-maestria-border/30 rounded text-white"
                placeholder="Ex.: imprevisto"
                value={cancelModal.message}
                onChange={(e) => setCancelModal((prev) => prev && { ...prev, message: e.target.value })}
              />
            </div>
            <Button onClick={handleCancel} loading={actionLoading}>
              Confirmar cancelamento
            </Button>
          </div>
        )}
      </Modal>

      <Modal open={!!proposeModal} onClose={() => { setProposeModal(null); setActionError(null) }} title="Propor novo horário">
        {proposeModal && (
          <div className="space-y-4">
            {actionError && <p className="text-red-400 text-sm">{actionError}</p>}
            <p className="text-white/80">Propor reagendamento para {proposeModal.appointment.clientName}.</p>
            <div>
              <label className="block text-sm text-white/80 mb-1">Nova data</label>
              <Input
                type="date"
                min={today}
                value={proposeModal.proposedDate}
                onChange={(e) => setProposeModal((prev) => prev && { ...prev, proposedDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Novo horário</label>
              <Input
                type="time"
                min={proposeModal.proposedDate === today ? minTimeToday : undefined}
                value={proposeModal.proposedStartTime}
                onChange={(e) => setProposeModal((prev) => prev && { ...prev, proposedStartTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Mensagem (opcional)</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-black border border-maestria-border/30 rounded text-white"
                placeholder="Ex.: imprevisto, posso atender nesse horário"
                value={proposeModal.barberMessage}
                onChange={(e) => setProposeModal((prev) => prev && { ...prev, barberMessage: e.target.value })}
              />
            </div>
            <Button onClick={handleProposeReschedule} loading={actionLoading}>
              Enviar proposta
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}

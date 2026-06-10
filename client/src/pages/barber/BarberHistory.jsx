import { useEffect, useState } from 'react'
import { barberService } from '@/services/barber.service'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table, TableRow, TableCell } from '@/components/ui/Table'

export function BarberHistory() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    barberService.myHistory().then(setList).finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-white/80">Carregando...</p>

  return (
    <div>
      <h1 className="page-title">Histórico</h1>
      <Card>
        <p className="text-white/80 mb-4">Todos os agendamentos, cancelamentos e reagendamentos dos seus clientes.</p>
        {list.length === 0 ? (
          <p className="text-white/80">Nenhum registro.</p>
        ) : (
          <Table headers={['Data', 'Horário', 'Cliente', 'Serviço', 'Status', 'Observações']}>
            {list.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.date}</TableCell>
                <TableCell>{(a.startTime || '').slice(0, 5)}</TableCell>
                <TableCell>{a.clientName}</TableCell>
                <TableCell>{a.serviceName}</TableCell>
                <TableCell>
                  <Badge status={a.status}>{a.status}</Badge>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  {a.observation && <p className="text-white/70 text-sm">Cliente: {a.observation}</p>}
                  {a.barberMessage && <p className="text-white/70 text-sm">Barbeiro: {a.barberMessage}</p>}
                  {!a.observation && !a.barberMessage && '—'}
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Card>
    </div>
  )
}

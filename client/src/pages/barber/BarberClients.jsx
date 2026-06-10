import { useEffect, useState } from 'react'
import { barberService } from '@/services/barber.service'
import { Card } from '@/components/ui/Card'
import { Table, TableRow, TableCell } from '@/components/ui/Table'

export function BarberClients() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    barberService.listMyClients().then(setList).finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-white/80">Carregando...</p>

  return (
    <div>
      <h1 className="page-title">Meus clientes</h1>
      <Card>
        <p className="text-white/80 mb-4">Clientes vinculados a você (atribuídos pelo admin).</p>
        {list.length === 0 ? (
          <p className="text-white/80">Nenhum cliente vinculado.</p>
        ) : (
          <Table headers={['Nome', 'Email', 'Telefone']}>
            {list.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone}</TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Card>
    </div>
  )
}

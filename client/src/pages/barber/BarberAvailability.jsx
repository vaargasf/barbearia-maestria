import { useEffect, useState } from 'react'
import { barberService } from '@/services/barber.service'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

const DAYS = [
  { value: 1, label: 'Segunda' },
  { value: 2, label: 'Terça' },
  { value: 3, label: 'Quarta' },
  { value: 4, label: 'Quinta' },
  { value: 5, label: 'Sexta' },
  { value: 6, label: 'Sábado' },
  { value: 7, label: 'Domingo' },
]


export function BarberAvailability() {
  const [slots, setSlots] = useState([])
  const [datesOff, setDatesOff] = useState([])
  const [newDateOff, setNewDateOff] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingDateOff, setSavingDateOff] = useState(false)

  useEffect(() => {
    Promise.all([barberService.getAvailability(), barberService.getDateOff()])
      .then(([avail, off]) => {
        setDatesOff(off)
        if (avail.length > 0) {
          setSlots(
            avail.map((a) => ({
              dayOfWeek: a.dayOfWeek,
              startTime: (a.startTime || '').slice(0, 5),
              endTime: (a.endTime || '').slice(0, 5),
            }))
          )
        } else {
          // Padrão: Segunda a Sábado, 09:00–18:00 (o barbeiro pode alterar dias e horários)
          setSlots(
            DAYS.filter((d) => d.value <= 6).map((d) => ({
              dayOfWeek: d.value,
              startTime: '09:00',
              endTime: '18:00',
            }))
          )
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const addSlot = () => {
    setSlots((prev) => [...prev, { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' }])
  }

  const updateSlot = (index, field, value) => {
    setSlots((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const removeSlot = (index) => {
    setSlots((prev) => prev.filter((_, i) => i !== index))
  }

  const save = async () => {
    setSaving(true)
    try {
      const body = slots.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      }))
      await barberService.setAvailability(body)
    } finally {
      setSaving(false)
    }
  }

  const addDateOff = () => {
    if (!newDateOff) return
    if (datesOff.includes(newDateOff)) return
    setDatesOff((prev) => [...prev, newDateOff].sort())
    setNewDateOff('')
  }

  const removeDateOff = (date) => {
    setDatesOff((prev) => prev.filter((d) => d !== date))
  }

  const saveDateOff = async () => {
    setSavingDateOff(true)
    try {
      const data = await barberService.setDateOff(datesOff)
      setDatesOff(data)
    } finally {
      setSavingDateOff(false)
    }
  }

  if (loading) return <p className="text-white/80">Carregando...</p>

  return (
    <div>
      <h1 className="page-title">Disponibilidade</h1>

      <Card className="mb-6">
        <p className="text-white/80 mb-4">
          Escolha em quais dias da semana você atende e o horário de cada dia. Por padrão vêm Segunda a Sábado (09:00–18:00); você pode alterar, adicionar ou remover dias e horários.
        </p>
        {slots.map((slot, index) => (
          <div key={index} className="flex flex-wrap gap-4 items-end mb-4 p-3 border border-maestria-border/20 rounded">
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm text-white/80 mb-1">Dia</label>
              <select
                className="w-full px-4 py-2 bg-black border border-maestria-border/30 rounded text-white"
                value={slot.dayOfWeek}
                onChange={(e) => updateSlot(index, 'dayOfWeek', Number(e.target.value))}
              >
                {DAYS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Início</label>
              <input
                type="time"
                className="px-4 py-2 bg-black border border-maestria-border/30 rounded text-white"
                value={slot.startTime}
                onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Fim</label>
              <input
                type="time"
                className="px-4 py-2 bg-black border border-maestria-border/30 rounded text-white"
                value={slot.endTime}
                onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
              />
            </div>
            <Button variant="ghost" onClick={() => removeSlot(index)}>
              Remover
            </Button>
          </div>
        ))}
        <div className="flex gap-2 mt-4">
          <Button variant="secondary" onClick={addSlot}>
            Adicionar horário
          </Button>
          <Button onClick={save} loading={saving}>
            Salvar horários
          </Button>
        </div>
      </Card>

      <Card>
        <p className="text-white/80 mb-4">Dias em que você não atende (folgas, feriados). Essas datas aparecem bloqueadas para o cliente.</p>
        <div className="flex gap-2 mb-4">
          <Input
            type="date"
            value={newDateOff}
            onChange={(e) => setNewDateOff(e.target.value)}
            className="max-w-[180px]"
          />
          <Button variant="secondary" onClick={addDateOff}>
            Adicionar data
          </Button>
        </div>
        {datesOff.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-4">
            {datesOff.map((d) => (
              <li
                key={d}
                className="px-3 py-1 bg-maestria-accent/10 text-maestria-accent rounded inline-flex items-center gap-2"
              >
                {d}
                <button
                  type="button"
                  onClick={() => removeDateOff(d)}
                  className="text-white/80 hover:text-white"
                  aria-label="Remover"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <Button onClick={saveDateOff} loading={savingDateOff}>
          Salvar dias de folga
        </Button>
      </Card>
    </div>
  )
}

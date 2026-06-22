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

const TIME_STEP = 1800

function defaultDay(dayOfWeek) {
  const weekday = dayOfWeek <= 6
  return {
    dayOfWeek,
    enabled: weekday,
    startTime: '09:00',
    endTime: '18:00',
    hasBreak: weekday,
    breakStart: '12:00',
    breakEnd: '14:00',
  }
}

function parseAvailability(avail) {
  const byDay = {}
  for (const a of avail) {
    if (!byDay[a.dayOfWeek]) byDay[a.dayOfWeek] = []
    byDay[a.dayOfWeek].push({
      startTime: (a.startTime || '').slice(0, 5),
      endTime: (a.endTime || '').slice(0, 5),
    })
  }

  return DAYS.map((d) => {
    const windows = (byDay[d.value] || []).sort((a, b) => a.startTime.localeCompare(b.startTime))
    if (windows.length === 0) return defaultDay(d.value)

    if (windows.length >= 2) {
      return {
        dayOfWeek: d.value,
        enabled: true,
        startTime: windows[0].startTime,
        endTime: windows[windows.length - 1].endTime,
        hasBreak: true,
        breakStart: windows[0].endTime,
        breakEnd: windows[1].startTime,
      }
    }

    return {
      dayOfWeek: d.value,
      enabled: true,
      startTime: windows[0].startTime,
      endTime: windows[0].endTime,
      hasBreak: false,
      breakStart: '12:00',
      breakEnd: '14:00',
    }
  })
}

function scheduleToSlots(schedule) {
  const slots = []
  for (const day of schedule) {
    if (!day.enabled) continue
    if (day.hasBreak) {
      slots.push({ dayOfWeek: day.dayOfWeek, startTime: day.startTime, endTime: day.breakStart })
      slots.push({ dayOfWeek: day.dayOfWeek, startTime: day.breakEnd, endTime: day.endTime })
    } else {
      slots.push({ dayOfWeek: day.dayOfWeek, startTime: day.startTime, endTime: day.endTime })
    }
  }
  return slots
}

export function BarberAvailability() {
  const [schedule, setSchedule] = useState(DAYS.map((d) => defaultDay(d.value)))
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
          setSchedule(parseAvailability(avail))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const updateDay = (dayOfWeek, field, value) => {
    setSchedule((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, [field]: value } : d))
    )
  }

  const save = async () => {
    setSaving(true)
    try {
      await barberService.setAvailability(scheduleToSlots(schedule))
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
          Configure seus dias e horários de atendimento. Você pode definir um intervalo (pausa) no meio do dia — por exemplo, almoço das 12:00 às 14:00.
        </p>
        {schedule.map((day) => {
          const dayLabel = DAYS.find((d) => d.value === day.dayOfWeek)?.label
          return (
            <div
              key={day.dayOfWeek}
              className={`mb-4 p-4 border border-maestria-border/20 rounded ${!day.enabled ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  id={`day-${day.dayOfWeek}`}
                  checked={day.enabled}
                  onChange={(e) => updateDay(day.dayOfWeek, 'enabled', e.target.checked)}
                  className="rounded border-maestria-border/30"
                />
                <label htmlFor={`day-${day.dayOfWeek}`} className="text-white font-medium">
                  {dayLabel}
                </label>
              </div>

              {day.enabled && (
                <div className="flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="block text-sm text-white/80 mb-1">Início</label>
                    <input
                      type="time"
                      step={TIME_STEP}
                      className="px-4 py-2 bg-black border border-maestria-border/30 rounded text-white"
                      value={day.startTime}
                      onChange={(e) => updateDay(day.dayOfWeek, 'startTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/80 mb-1">Fim</label>
                    <input
                      type="time"
                      step={TIME_STEP}
                      className="px-4 py-2 bg-black border border-maestria-border/30 rounded text-white"
                      value={day.endTime}
                      onChange={(e) => updateDay(day.dayOfWeek, 'endTime', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 self-end pb-2">
                    <input
                      type="checkbox"
                      id={`break-${day.dayOfWeek}`}
                      checked={day.hasBreak}
                      onChange={(e) => updateDay(day.dayOfWeek, 'hasBreak', e.target.checked)}
                      className="rounded border-maestria-border/30"
                    />
                    <label htmlFor={`break-${day.dayOfWeek}`} className="text-sm text-white/80">
                      Tem intervalo
                    </label>
                  </div>

                  {day.hasBreak && (
                    <>
                      <div>
                        <label className="block text-sm text-white/80 mb-1">Intervalo início</label>
                        <input
                          type="time"
                          step={TIME_STEP}
                          className="px-4 py-2 bg-black border border-maestria-border/30 rounded text-white"
                          value={day.breakStart}
                          onChange={(e) => updateDay(day.dayOfWeek, 'breakStart', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/80 mb-1">Intervalo fim</label>
                        <input
                          type="time"
                          step={TIME_STEP}
                          className="px-4 py-2 bg-black border border-maestria-border/30 rounded text-white"
                          value={day.breakEnd}
                          onChange={(e) => updateDay(day.dayOfWeek, 'breakEnd', e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
        <Button onClick={save} loading={saving}>
          Salvar horários
        </Button>
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

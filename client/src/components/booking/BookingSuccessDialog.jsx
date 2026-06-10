import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarPlus, CheckCircle2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { BARBERSHOP } from '@/constants/booking'

function pad(n) {
  return String(n).padStart(2, '0')
}

function parseBookingDateTime(dateStr, timeStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const [h, min] = (timeStr || '00:00').slice(0, 5).split(':').map(Number)
  return new Date(y, m - 1, d, h, min, 0)
}

function toCompactDate(date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`
}

function buildCalendarEvent(booking, service, barber) {
  const date = booking.date
  const start = parseBookingDateTime(date, booking.startTime)
  const end = booking.endTime
    ? parseBookingDateTime(date, booking.endTime)
    : new Date(start.getTime() + (service?.durationMinutes ?? 30) * 60 * 1000)

  return {
    title: `${service?.name ?? booking.serviceName} — ${BARBERSHOP.name}`,
    description: `Barbeiro: ${barber?.name ?? booking.barberName}\nServiço: ${service?.name ?? booking.serviceName}\n\n${BARBERSHOP.name}`,
    location: BARBERSHOP.address,
    start,
    end,
  }
}

function getGoogleCalendarUrl(event) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toCompactDate(event.start)}/${toCompactDate(event.end)}`,
    details: event.description,
    location: event.location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function downloadIcsFile(event) {
  const escape = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Barbearia Maestria//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:maestria-${Date.now()}@barbearia-maestria.local`,
    `DTSTAMP:${toCompactDate(new Date())}`,
    `DTSTART:${toCompactDate(event.start)}`,
    `DTEND:${toCompactDate(event.end)}`,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape(event.description)}`,
    `LOCATION:${escape(event.location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'agendamento-barbearia-maestria.ics'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function BookingSuccessDialog({ booking, service, barber, onClose }) {
  if (!booking) return null

  const event = buildCalendarEvent(booking, service, barber)
  const when = format(event.start, "EEEE, dd 'de' MMMM 'às' HH:mm", { locale: ptBR })

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <Card className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border-border shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <CardContent className="p-6 pt-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>

          <h2 className="text-xl font-bold">Reserva confirmada!</h2>
          <p className="mt-2 text-sm text-muted-foreground capitalize">{when}</p>

          <div className="mt-4 rounded-xl bg-secondary/80 p-4 text-left text-sm space-y-1">
            <p>
              <span className="text-muted-foreground">Serviço:</span>{' '}
              <span className="font-medium">{service?.name ?? booking.serviceName}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Barbeiro:</span>{' '}
              <span className="font-medium">{barber?.name ?? booking.barberName}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Local:</span>{' '}
              <span className="font-medium">{BARBERSHOP.name}</span>
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <CalendarPlus size={14} />
              Adicionar à agenda
            </p>

            <Button
              type="button"
              className="w-full"
              onClick={() => window.open(getGoogleCalendarUrl(event), '_blank', 'noopener,noreferrer')}
            >
              Google Calendar
            </Button>

            <Button type="button" variant="secondary" className="w-full" onClick={() => downloadIcsFile(event)}>
              Apple Calendar / Outlook (.ics)
            </Button>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              No iPhone, toque em &quot;Apple Calendar&quot; e abra o arquivo — o horário será adicionado ao Calendário.
            </p>
          </div>

          <Button type="button" variant="ghost" className="w-full mt-4" onClick={onClose}>
            Fechar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

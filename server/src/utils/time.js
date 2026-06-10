export function formatDate(date) {
  if (!date) return null
  const d = new Date(date)
  return d.toISOString().slice(0, 10)
}

export function parseDate(str) {
  if (!str) return null
  return new Date(`${str}T00:00:00.000Z`)
}

export function addMinutes(time, minutes) {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + minutes
  const nh = Math.floor(total / 60) % 24
  const nm = total % 60
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`
}

export function normalizeTime(time) {
  if (!time) return time
  return time.length >= 5 ? time.slice(0, 5) : time
}

export const CLOSED_STATUSES = [
  'FINALIZADO',
  'CANCELADO',
  'CANCELADO_POR_BARBEIRO',
  'CANCELADO_POR_CLIENTE',
]

export const ACTIVE_STATUSES = ['AGENDADO', 'PROPOSTA_REAGENDAMENTO']

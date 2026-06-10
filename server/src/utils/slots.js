import { prisma } from '../lib/prisma.js'
import { AppError } from './asyncHandler.js'
import { ACTIVE_STATUSES, addMinutes } from './time.js'

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function minutesToTime(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function getDayOfWeek(dateStr) {
  const d = new Date(`${dateStr}T12:00:00.000Z`)
  const jsDay = d.getUTCDay()
  return jsDay === 0 ? 7 : jsDay
}

function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA
}

export async function getAvailableSlots(barberId, dateStr, serviceId) {
  const barber = await prisma.user.findFirst({
    where: { id: barberId, isBarber: true, active: true },
  })
  if (!barber) throw new AppError('Barbeiro não encontrado', 404)

  const service = await prisma.service.findFirst({
    where: { id: serviceId, barberId, active: true },
  })
  if (!service) throw new AppError('Serviço não encontrado', 404)

  const dateOff = await prisma.barberDateOff.findFirst({
    where: { barberId, dateOff: new Date(`${dateStr}T00:00:00.000Z`) },
  })
  if (dateOff) return []

  const dayOfWeek = getDayOfWeek(dateStr)
  const windows = await prisma.availability.findMany({
    where: { barberId, dayOfWeek },
    orderBy: { startTime: 'asc' },
  })
  if (windows.length === 0) return []

  const duration = service.durationMinutes ?? 30
  const appointments = await prisma.appointment.findMany({
    where: {
      barberId,
      date: new Date(`${dateStr}T00:00:00.000Z`),
      status: { in: ACTIVE_STATUSES },
    },
    select: { startTime: true, endTime: true },
  })

  const booked = appointments.map((a) => ({
    start: timeToMinutes(a.startTime.slice(0, 5)),
    end: timeToMinutes(a.endTime.slice(0, 5)),
  }))

  const todayStr = new Date().toISOString().slice(0, 10)
  const now = new Date()
  const minMinutes =
    dateStr === todayStr ? now.getHours() * 60 + now.getMinutes() : null

  const slots = []
  const seen = new Set()

  for (const window of windows) {
    const windowStart = timeToMinutes(window.startTime.slice(0, 5))
    const windowEnd = timeToMinutes(window.endTime.slice(0, 5))

    for (let start = windowStart; start + duration <= windowEnd; start += duration) {
      if (minMinutes != null && start < minMinutes) continue

      const end = start + duration
      const blocked = booked.some((b) => rangesOverlap(start, end, b.start, b.end))
      if (blocked) continue

      const time = minutesToTime(start)
      if (seen.has(time)) continue
      seen.add(time)
      slots.push(time)
    }
  }

  return slots.sort((a, b) => timeToMinutes(a) - timeToMinutes(b))
}

export { addMinutes, timeToMinutes, minutesToTime }

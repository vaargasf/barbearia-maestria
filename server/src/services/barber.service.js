import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/asyncHandler.js'
import { CLOSED_STATUSES } from '../utils/time.js'
import {
  appointmentInclude,
  mapAppointment,
  mapAvailability,
  mapService,
  mapUser,
  serviceInclude,
} from '../utils/mappers.js'
import { cancelByBarber, proposeReschedule } from './appointment.service.js'

export async function getProfile(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new AppError('Usuário não encontrado', 404)
  return mapUser(user)
}

export async function updateProfile(userId, body) {
  const data = {}
  if (body.name != null) data.name = String(body.name).trim()
  if (body.phone != null) data.phone = String(body.phone).trim()
  if (body.avatarUrl != null) data.avatarUrl = String(body.avatarUrl).trim() || null

  if (!Object.keys(data).length) {
    throw new AppError('Nenhum dado para atualizar', 400)
  }

  const user = await prisma.user.update({ where: { id: userId }, data })
  return mapUser(user)
}

export async function updateProfileAvatar(userId, dataUrl) {
  const match = /^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/i.exec(dataUrl ?? '')
  if (!match) throw new AppError('Imagem inválida', 400)

  const ext = match[2].toLowerCase() === 'jpeg' ? 'jpg' : match[2].toLowerCase()
  const buffer = Buffer.from(match[3], 'base64')
  if (buffer.length > 5 * 1024 * 1024) {
    throw new AppError('Imagem muito grande (máx. 5 MB)', 400)
  }

  const uploadDir = path.join(process.cwd(), 'uploads', 'avatars')
  await mkdir(uploadDir, { recursive: true })
  const fileName = `barber-${userId}.${ext}`
  await writeFile(path.join(uploadDir, fileName), buffer)

  const avatarUrl = `/uploads/avatars/${fileName}`
  const user = await prisma.user.update({ where: { id: userId }, data: { avatarUrl } })
  return mapUser(user)
}

export async function myAppointments(barberId) {
  const list = await prisma.appointment.findMany({
    where: {
      barberId,
      status: { notIn: CLOSED_STATUSES },
    },
    include: appointmentInclude,
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  })
  return list.map(mapAppointment)
}

export async function myHistory(barberId) {
  const list = await prisma.appointment.findMany({
    where: { barberId },
    include: appointmentInclude,
    orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
  })
  return list.map(mapAppointment)
}

export async function myClients(barberId) {
  const appointments = await prisma.appointment.findMany({
    where: { barberId },
    select: { clientId: true },
    distinct: ['clientId'],
  })
  const clientIds = appointments.map((a) => a.clientId)
  if (clientIds.length === 0) return []
  const clients = await prisma.user.findMany({
    where: { id: { in: clientIds } },
    orderBy: { name: 'asc' },
  })
  return clients.map(mapUser)
}

export async function getAvailability(barberId) {
  const list = await prisma.availability.findMany({
    where: { barberId },
    orderBy: { dayOfWeek: 'asc' },
  })
  return list.map(mapAvailability)
}

export async function setAvailability(barberId, slots) {
  await prisma.$transaction([
    prisma.availability.deleteMany({ where: { barberId } }),
    prisma.availability.createMany({
      data: slots.map((s) => ({
        barberId,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
    }),
  ])
  return getAvailability(barberId)
}

export async function getDateOff(barberId) {
  const rows = await prisma.barberDateOff.findMany({
    where: { barberId },
    orderBy: { dateOff: 'asc' },
  })
  return rows.map((r) => r.dateOff.toISOString().slice(0, 10))
}

export async function setDateOff(barberId, datesOff) {
  await prisma.$transaction([
    prisma.barberDateOff.deleteMany({ where: { barberId } }),
    ...(datesOff.length
      ? [
          prisma.barberDateOff.createMany({
            data: datesOff.map((d) => ({
              barberId,
              dateOff: new Date(`${d}T00:00:00.000Z`),
            })),
          }),
        ]
      : []),
  ])
  return getDateOff(barberId)
}

export async function listMyServices(barberId) {
  const services = await prisma.service.findMany({
    where: { barberId },
    include: serviceInclude,
    orderBy: { name: 'asc' },
  })
  return services.map(mapService)
}

export async function createMyService(barberId, body) {
  const created = await prisma.service.create({
    data: {
      barberId,
      name: body.name,
      price: body.price,
      durationMinutes: body.durationMinutes ?? 30,
      description: body.description ?? null,
      active: body.active ?? true,
    },
    include: serviceInclude,
  })
  return mapService(created)
}

export async function updateMyService(barberId, serviceId, body) {
  const existing = await prisma.service.findFirst({ where: { id: serviceId, barberId } })
  if (!existing) throw new AppError('Serviço não encontrado', 404)
  const updated = await prisma.service.update({
    where: { id: serviceId },
    data: body,
    include: serviceInclude,
  })
  return mapService(updated)
}

export async function deleteMyService(barberId, serviceId) {
  const existing = await prisma.service.findFirst({ where: { id: serviceId, barberId } })
  if (!existing) throw new AppError('Serviço não encontrado', 404)

  const appointmentCount = await prisma.appointment.count({ where: { serviceId } })
  if (appointmentCount > 0) {
    throw new AppError('Não é possível remover um serviço com agendamentos vinculados', 400)
  }

  await prisma.service.delete({ where: { id: serviceId } })
}

const COUNTABLE_STATUSES = ['AGENDADO', 'FINALIZADO', 'PROPOSTA_REAGENDAMENTO']
const REVENUE_STATUSES = ['FINALIZADO']

function monthKey(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(key) {
  const [year, month] = key.split('-').map(Number)
  const label = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', { month: 'short' })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function pctChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 1000) / 10
}

export async function getDashboardStats(barberId) {
  const now = new Date()
  const monthsCount = 6
  const startDate = new Date(now.getFullYear(), now.getMonth() - (monthsCount - 1), 1)

  const appointments = await prisma.appointment.findMany({
    where: {
      barberId,
      date: { gte: startDate },
      status: { in: COUNTABLE_STATUSES },
    },
    include: { service: true },
  })

  const monthBuckets = []
  for (let i = monthsCount - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthBuckets.push(monthKey(d))
  }

  const byMonth = Object.fromEntries(
    monthBuckets.map((key) => [key, { month: key, label: monthLabel(key), appointments: 0, revenue: 0 }])
  )

  for (const appt of appointments) {
    const key = monthKey(appt.date)
    if (!byMonth[key]) continue
    if (COUNTABLE_STATUSES.includes(appt.status)) {
      byMonth[key].appointments += 1
    }
    if (REVENUE_STATUSES.includes(appt.status) && appt.service?.price != null) {
      byMonth[key].revenue += Number(appt.service.price)
    }
  }

  const months = monthBuckets.map((key) => byMonth[key])
  const current = months[months.length - 1]
  const previous = months[months.length - 2] ?? { appointments: 0, revenue: 0 }

  return {
    months,
    summary: {
      appointmentsThisMonth: current.appointments,
      revenueThisMonth: current.revenue,
      appointmentsChange: pctChange(current.appointments, previous.appointments),
      revenueChange: pctChange(current.revenue, previous.revenue),
    },
  }
}

export const barberAppointmentService = {
  cancelByBarber,
  proposeReschedule,
}

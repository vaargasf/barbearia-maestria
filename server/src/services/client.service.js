import { prisma } from '../lib/prisma.js'
import { mapService, mapUser, serviceInclude } from '../utils/mappers.js'

export async function listBarbers() {
  const barbers = await prisma.user.findMany({
    where: { isBarber: true, active: true },
    orderBy: { name: 'asc' },
  })
  return barbers.map(mapUser)
}

export async function listServicesByBarber(barberId) {
  const services = await prisma.service.findMany({
    where: { barberId, active: true },
    include: serviceInclude,
    orderBy: { name: 'asc' },
  })
  return services.map(mapService)
}

export async function getBarberDateOff(barberId) {
  const rows = await prisma.barberDateOff.findMany({
    where: { barberId },
    orderBy: { dateOff: 'asc' },
  })
  return rows.map((r) => r.dateOff.toISOString().slice(0, 10))
}

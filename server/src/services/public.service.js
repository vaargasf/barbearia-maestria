import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/asyncHandler.js'
import { mapService, mapUser, serviceInclude } from '../utils/mappers.js'
import { getAvailableSlots } from '../utils/slots.js'
import { createAppointment } from './appointment.service.js'
import { getBarberDateOff, listBarbers, listServicesByBarber } from './client.service.js'

export { listBarbers, listServicesByBarber, getBarberDateOff }

export async function listSlots(barberId, date, serviceId) {
  if (!date || !serviceId) {
    throw new AppError('Informe data e serviço')
  }
  return getAvailableSlots(barberId, date, Number(serviceId))
}

async function findOrCreateClient({ name, email, phone, barberId }) {
  const existingEmail = await prisma.user.findUnique({ where: { email } })
  if (existingEmail) {
    if (existingEmail.role !== 'ROLE_CLIENT') {
      throw new AppError('Este email já está em uso')
    }
    await prisma.user.update({
      where: { id: existingEmail.id },
      data: { name, phone },
    })
    return existingEmail
  }

  const existingPhone = await prisma.user.findUnique({ where: { phone } })
  if (existingPhone) throw new AppError('Telefone já cadastrado')

  let cpf
  for (let i = 0; i < 10; i++) {
    const raw = crypto.randomBytes(5).toString('hex').slice(0, 11).padStart(11, '0')
    const candidate = `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9, 11)}`
    const taken = await prisma.user.findUnique({ where: { cpf: candidate } })
    if (!taken) {
      cpf = candidate
      break
    }
  }
  if (!cpf) throw new AppError('Não foi possível registrar cliente')

  const password = await bcrypt.hash(crypto.randomUUID(), 10)
  return prisma.user.create({
    data: {
      name,
      email,
      cpf,
      phone,
      password,
      role: 'ROLE_CLIENT',
      assignedBarberId: barberId,
      active: true,
    },
  })
}

export async function createPublicBooking(body) {
  const { name, email, phone, barberId, serviceId, date, startTime } = body
  if (!name || !email || !phone || !barberId || !serviceId || !date || !startTime) {
    throw new AppError('Preencha todos os campos')
  }

  const slots = await getAvailableSlots(Number(barberId), date, Number(serviceId))
  const normalizedStart = startTime.slice(0, 5)
  if (!slots.includes(normalizedStart)) {
    throw new AppError('Horário indisponível. Escolha outro horário.')
  }

  const client = await findOrCreateClient({
    name,
    email,
    phone,
    barberId: Number(barberId),
  })

  return createAppointment({
    clientId: client.id,
    barberId: Number(barberId),
    serviceId: Number(serviceId),
    date,
    startTime: normalizedStart,
  })
}

export async function getBarberPublic(barberId) {
  const barber = await prisma.user.findFirst({
    where: { id: barberId, isBarber: true, active: true },
  })
  if (!barber) throw new AppError('Barbeiro não encontrado', 404)
  return mapUser(barber)
}

export async function listServicesPublic(barberId) {
  const services = await prisma.service.findMany({
    where: { barberId, active: true },
    include: serviceInclude,
    orderBy: { name: 'asc' },
  })
  return services.map(mapService)
}

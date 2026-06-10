import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/asyncHandler.js'
import { addMinutes, parseDate, normalizeTime } from '../utils/time.js'
import { appointmentInclude, mapAppointment } from '../utils/mappers.js'

export async function getServiceDuration(serviceId) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } })
  return service?.durationMinutes ?? 30
}

export async function createAppointment(body) {
  const client = await prisma.user.findUnique({ where: { id: body.clientId } })
  const barber = await prisma.user.findFirst({ where: { id: body.barberId, isBarber: true, active: true } })
  const service = await prisma.service.findFirst({
    where: { id: body.serviceId, barberId: body.barberId, active: true },
  })
  if (!client || !barber || !service) {
    throw new AppError('Dados inválidos para agendamento')
  }
  const duration = service.durationMinutes ?? 30
  const startTime = normalizeTime(body.startTime)
  const appointment = await prisma.appointment.create({
    data: {
      clientId: body.clientId,
      barberId: body.barberId,
      serviceId: body.serviceId,
      date: parseDate(body.date),
      startTime,
      endTime: addMinutes(startTime, duration),
      status: 'AGENDADO',
    },
    include: appointmentInclude,
  })
  return mapAppointment(appointment)
}

export async function findAppointmentForClient(id, clientId) {
  const appointment = await prisma.appointment.findFirst({
    where: { id, clientId },
    include: appointmentInclude,
  })
  if (!appointment) throw new AppError('Agendamento não encontrado', 404)
  return appointment
}

export async function findAppointmentForBarber(id, barberId) {
  const appointment = await prisma.appointment.findFirst({
    where: { id, barberId },
    include: appointmentInclude,
  })
  if (!appointment) throw new AppError('Agendamento não encontrado', 404)
  return appointment
}

export async function cancelByClient(id, clientId, observation) {
  await findAppointmentForClient(id, clientId)
  await prisma.appointment.update({
    where: { id },
    data: {
      status: 'CANCELADO_POR_CLIENTE',
      observation: observation ?? null,
    },
  })
}

export async function acceptProposal(id, clientId) {
  const appt = await findAppointmentForClient(id, clientId)
  if (appt.status !== 'PROPOSTA_REAGENDAMENTO') {
    throw new AppError('Agendamento não possui proposta pendente')
  }
  const duration = await getServiceDuration(appt.serviceId)
  const startTime = normalizeTime(appt.proposedStartTime)
  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      date: appt.proposedDate,
      startTime,
      endTime: addMinutes(startTime, duration),
      status: 'AGENDADO',
      proposedDate: null,
      proposedStartTime: null,
      proposedEndTime: null,
      barberMessage: null,
    },
    include: appointmentInclude,
  })
  return mapAppointment(updated)
}

export async function rejectProposal(id, clientId) {
  await findAppointmentForClient(id, clientId)
  await prisma.appointment.update({
    where: { id },
    data: { status: 'CANCELADO_POR_BARBEIRO' },
  })
}

export async function rescheduleByClient(id, clientId, body) {
  const appt = await findAppointmentForClient(id, clientId)
  const duration = await getServiceDuration(appt.serviceId)
  const startTime = normalizeTime(body.newStartTime)
  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      date: parseDate(body.newDate),
      startTime,
      endTime: addMinutes(startTime, duration),
      status: 'AGENDADO',
      observation: body.observation ?? appt.observation,
    },
    include: appointmentInclude,
  })
  return mapAppointment(updated)
}

export async function cancelByBarber(id, barberId, barberMessage) {
  await findAppointmentForBarber(id, barberId)
  await prisma.appointment.update({
    where: { id },
    data: {
      status: 'CANCELADO_POR_BARBEIRO',
      barberMessage: barberMessage ?? null,
    },
  })
}

export async function proposeReschedule(id, barberId, body) {
  const appt = await findAppointmentForBarber(id, barberId)
  const duration = await getServiceDuration(appt.serviceId)
  const startTime = normalizeTime(body.proposedStartTime)
  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      status: 'PROPOSTA_REAGENDAMENTO',
      proposedDate: parseDate(body.proposedDate),
      proposedStartTime: startTime,
      proposedEndTime: addMinutes(startTime, duration),
      barberMessage: body.barberMessage ?? null,
    },
    include: appointmentInclude,
  })
  return mapAppointment(updated)
}

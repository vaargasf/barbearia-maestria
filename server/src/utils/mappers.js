import { formatDate, normalizeTime } from './time.js'

export function mapUser(user) {
  if (!user) return null
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    phone: user.phone,
    role: user.role,
    active: user.active,
    isBarber: user.isBarber ?? false,
    avatarUrl: user.avatarUrl ?? null,
    createdAt: user.createdAt?.toISOString?.() ?? user.createdAt,
    assignedBarberId: user.assignedBarberId ?? null,
  }
}

export function mapService(service) {
  return {
    id: service.id,
    name: service.name,
    price: Number(service.price),
    durationMinutes: service.durationMinutes,
    description: service.description,
    active: service.active,
    barberId: service.barberId,
    barberName: service.barber?.name ?? service.barberName ?? null,
  }
}

export function mapAppointment(appointment) {
  return {
    id: appointment.id,
    clientId: appointment.clientId,
    clientName: appointment.client?.name ?? appointment.clientName,
    barberId: appointment.barberId,
    barberName: appointment.barber?.name ?? appointment.barberName,
    serviceId: appointment.serviceId,
    serviceName: appointment.service?.name ?? appointment.serviceName,
    date: formatDate(appointment.date),
    startTime: normalizeTime(appointment.startTime),
    endTime: normalizeTime(appointment.endTime),
    status: appointment.status,
    observation: appointment.observation ?? null,
    barberMessage: appointment.barberMessage ?? null,
    proposedDate: formatDate(appointment.proposedDate),
    proposedStartTime: normalizeTime(appointment.proposedStartTime),
    proposedEndTime: normalizeTime(appointment.proposedEndTime),
    createdAt: appointment.createdAt?.toISOString?.() ?? appointment.createdAt,
  }
}

export function mapAvailability(item) {
  return {
    id: item.id,
    barberId: item.barberId,
    dayOfWeek: item.dayOfWeek,
    startTime: normalizeTime(item.startTime),
    endTime: normalizeTime(item.endTime),
  }
}

export const appointmentInclude = {
  client: true,
  barber: true,
  service: true,
}

export const serviceInclude = {
  barber: { select: { id: true, name: true } },
}

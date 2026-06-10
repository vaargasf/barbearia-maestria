import * as barberService from '../services/barber.service.js'

export async function getProfile(req, res) {
  res.json(await barberService.getProfile(req.user.userId))
}

export async function updateProfile(req, res) {
  res.json(await barberService.updateProfile(req.user.userId, req.body))
}

export async function updateProfileAvatar(req, res) {
  res.json(await barberService.updateProfileAvatar(req.user.userId, req.body?.dataUrl))
}

export async function listAppointments(req, res) {
  res.json(await barberService.myAppointments(req.user.userId))
}

export async function listHistory(req, res) {
  res.json(await barberService.myHistory(req.user.userId))
}

export async function listClients(req, res) {
  res.json(await barberService.myClients(req.user.userId))
}

export async function cancelAppointment(req, res) {
  await barberService.barberAppointmentService.cancelByBarber(
    Number(req.params.id),
    req.user.userId,
    req.body?.observation ?? req.body?.barberMessage
  )
  res.status(204).send()
}

export async function proposeReschedule(req, res) {
  const result = await barberService.barberAppointmentService.proposeReschedule(
    Number(req.params.id),
    req.user.userId,
    req.body
  )
  res.json(result)
}

export async function getAvailability(req, res) {
  res.json(await barberService.getAvailability(req.user.userId))
}

export async function setAvailability(req, res) {
  const body = Array.isArray(req.body) ? req.body : req.body?.slots ?? req.body
  res.json(await barberService.setAvailability(req.user.userId, body))
}

export async function getDateOff(req, res) {
  res.json(await barberService.getDateOff(req.user.userId))
}

export async function setDateOff(req, res) {
  const datesOff = req.body?.datesOff ?? req.body ?? []
  res.json(await barberService.setDateOff(req.user.userId, datesOff))
}

export async function getStats(req, res) {
  res.json(await barberService.getDashboardStats(req.user.userId))
}

export async function listServices(req, res) {
  res.json(await barberService.listMyServices(req.user.userId))
}

export async function updateService(req, res) {
  const result = await barberService.updateMyService(
    req.user.userId,
    Number(req.params.serviceId),
    req.body
  )
  res.json(result)
}

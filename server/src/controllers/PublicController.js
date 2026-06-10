import * as publicService from '../services/public.service.js'

export async function listBarbers(_req, res) {
  res.json(await publicService.listBarbers())
}

export async function listServices(req, res) {
  res.json(await publicService.listServicesByBarber(Number(req.params.barberId)))
}

export async function listDateOff(req, res) {
  res.json(await publicService.getBarberDateOff(Number(req.params.barberId)))
}

export async function listSlots(req, res) {
  const { date, serviceId } = req.query
  res.json(await publicService.listSlots(Number(req.params.barberId), date, Number(serviceId)))
}

export async function createAppointment(req, res) {
  const result = await publicService.createPublicBooking(req.body)
  res.status(201).json(result)
}

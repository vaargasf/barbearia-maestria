import { api } from './http'

export const bookingService = {
  listBarbers: () => api.get('/api/public/barbers').then((r) => r.data),
  listServices: (barberId) =>
    api.get(`/api/public/barbers/${barberId}/services`).then((r) => r.data),
  getDateOff: (barberId) =>
    api.get(`/api/public/barbers/${barberId}/date-off`).then((r) => r.data),
  getSlots: (barberId, date, serviceId) =>
    api
      .get(`/api/public/barbers/${barberId}/slots`, { params: { date, serviceId } })
      .then((r) => r.data),
  create: (body) => api.post('/api/public/appointments', body).then((r) => r.data),
}

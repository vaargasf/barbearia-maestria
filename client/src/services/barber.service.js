import { api } from './http'

export const barberService = {
  profile: () => api.get('/api/barbers/profile').then((r) => r.data),
  updateProfile: (body) => api.put('/api/barbers/profile', body).then((r) => r.data),
  updateProfileAvatar: (dataUrl) =>
    api.put('/api/barbers/profile/avatar', { dataUrl }).then((r) => r.data),
  myAppointments: () => api.get('/api/barbers/appointments').then((r) => r.data),
  myHistory: () => api.get('/api/barbers/history').then((r) => r.data),
  listMyClients: () => api.get('/api/barbers/clients').then((r) => r.data),
  cancelByBarber: (appointmentId, barberMessage) =>
    api.delete(`/api/barbers/appointments/${appointmentId}`, {
      data: barberMessage != null ? { observation: barberMessage } : undefined,
    }),
  proposeReschedule: (appointmentId, body) =>
    api.put(`/api/barbers/appointments/${appointmentId}/propose-reschedule`, body).then((r) => r.data),
  getAvailability: () => api.get('/api/barbers/availability').then((r) => r.data),
  setAvailability: (body) => api.put('/api/barbers/availability', body).then((r) => r.data),
  getDateOff: () => api.get('/api/barbers/date-off').then((r) => r.data),
  setDateOff: (datesOff) => api.put('/api/barbers/date-off', { datesOff }).then((r) => r.data),
  listMyServices: () => api.get('/api/barbers/services').then((r) => r.data),
  getStats: () => api.get('/api/barbers/stats').then((r) => r.data),
  updateMyService: (serviceId, body) =>
    api.put(`/api/barbers/services/${serviceId}`, body).then((r) => r.data),
}

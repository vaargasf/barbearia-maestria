import { api } from './http'

export const authService = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }).then((r) => r.data),
}

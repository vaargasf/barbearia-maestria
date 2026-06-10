import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'

export function signToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      isBarber: user.isBarber ?? false,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  )
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret)
}

export function toLoginResponse(user, token) {
  return {
    token,
    type: 'Bearer',
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isBarber: user.isBarber ?? false,
  }
}

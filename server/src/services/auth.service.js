import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { signToken, toLoginResponse } from '../lib/jwt.js'
import { AppError } from '../utils/asyncHandler.js'

export async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.active) {
    throw new AppError('Email ou senha inválidos', 401)
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new AppError('Email ou senha inválidos', 401)
  }
  if (user.role === 'ROLE_CLIENT') {
    throw new AppError('Acesso restrito a barbeiros', 403)
  }
  if (!user.isBarber) {
    throw new AppError('Acesso restrito a barbeiros', 403)
  }
  const token = signToken(user)
  return toLoginResponse(user, token)
}

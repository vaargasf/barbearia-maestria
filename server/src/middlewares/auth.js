import { verifyToken } from '../lib/jwt.js'

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Não autenticado' })
  }
  try {
    req.user = verifyToken(header.slice(7))
    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' })
  }
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' })
    }
    next()
  }
}

export function requireBarber(req, res, next) {
  if (req.user.role === 'ROLE_ADMIN' && !req.user.isBarber) {
    return res.status(403).json({ message: 'Acesso negado' })
  }
  next()
}

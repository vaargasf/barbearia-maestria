import rateLimit from 'express-rate-limit'

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
})

export const bookingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { message: 'Muitas requisições. Aguarde um momento.' },
  standardHeaders: true,
  legacyHeaders: false,
})

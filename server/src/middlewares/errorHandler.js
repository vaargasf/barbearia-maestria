import { AppError } from '../utils/asyncHandler.js'

export function errorHandler(err, req, res, _next) {
  const status = err.status ?? 500
  const message = err.message ?? 'Erro interno do servidor'
  if (status >= 500) {
    console.error(err)
  }
  res.status(status).json({ message })
}

export function notFoundHandler(_req, res) {
  res.status(404).json({ message: 'Rota não encontrada' })
}

export function throwIfNotFound(entity, message = 'Registro não encontrado') {
  if (!entity) throw new AppError(message, 404)
  return entity
}

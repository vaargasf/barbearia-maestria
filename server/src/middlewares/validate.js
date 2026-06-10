import { AppError } from '../utils/asyncHandler.js'

export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const data = source === 'query' ? req.query : source === 'params' ? req.params : req.body
    const result = schema.safeParse(data)
    if (!result.success) {
      const message = result.error.errors[0]?.message ?? 'Dados inválidos'
      return next(new AppError(message, 400))
    }
    if (source === 'body') req.body = result.data
    else if (source === 'query') req.query = result.data
    else req.params = result.data
    next()
  }
}

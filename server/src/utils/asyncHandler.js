export class AppError extends Error {
  constructor(message, status = 422) {
    super(message)
    this.status = status
  }
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { loginLimiter } from '../middlewares/rateLimiter.js'
import { validate } from '../middlewares/validate.js'
import { loginSchema } from '../utils/validators.js'
import * as AuthController from '../controllers/AuthController.js'

const router = Router()

router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  asyncHandler(AuthController.login)
)

export default router

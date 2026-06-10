import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { bookingLimiter } from '../middlewares/rateLimiter.js'
import { validate } from '../middlewares/validate.js'
import { createBookingSchema, slotsQuerySchema } from '../utils/validators.js'
import * as PublicController from '../controllers/PublicController.js'

const router = Router()

router.get('/barbers', asyncHandler(PublicController.listBarbers))
router.get('/barbers/:barberId/services', asyncHandler(PublicController.listServices))
router.get('/barbers/:barberId/date-off', asyncHandler(PublicController.listDateOff))
router.get(
  '/barbers/:barberId/slots',
  validate(slotsQuerySchema, 'query'),
  asyncHandler(PublicController.listSlots)
)
router.post(
  '/appointments',
  bookingLimiter,
  validate(createBookingSchema),
  asyncHandler(PublicController.createAppointment)
)

export default router

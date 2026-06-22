import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { authMiddleware, requireBarber, requireRoles } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { avatarSchema, createServiceSchema, updateProfileSchema, updateServiceSchema } from '../utils/validators.js'
import * as BarberController from '../controllers/BarberController.js'

const router = Router()

router.use(authMiddleware, requireRoles('ROLE_ADMIN'), requireBarber)

router.get('/profile', asyncHandler(BarberController.getProfile))
router.put('/profile', validate(updateProfileSchema), asyncHandler(BarberController.updateProfile))
router.put(
  '/profile/avatar',
  validate(avatarSchema),
  asyncHandler(BarberController.updateProfileAvatar)
)

router.get('/appointments', asyncHandler(BarberController.listAppointments))
router.get('/history', asyncHandler(BarberController.listHistory))
router.get('/clients', asyncHandler(BarberController.listClients))

router.delete('/appointments/:id', asyncHandler(BarberController.cancelAppointment))
router.put(
  '/appointments/:id/propose-reschedule',
  asyncHandler(BarberController.proposeReschedule)
)

router.get('/availability', asyncHandler(BarberController.getAvailability))
router.put('/availability', asyncHandler(BarberController.setAvailability))
router.get('/date-off', asyncHandler(BarberController.getDateOff))
router.put('/date-off', asyncHandler(BarberController.setDateOff))

router.get('/stats', asyncHandler(BarberController.getStats))
router.get('/services', asyncHandler(BarberController.listServices))
router.post(
  '/services',
  validate(createServiceSchema),
  asyncHandler(BarberController.createService)
)
router.put(
  '/services/:serviceId',
  validate(updateServiceSchema),
  asyncHandler(BarberController.updateService)
)
router.delete('/services/:serviceId', asyncHandler(BarberController.deleteService))

export default router

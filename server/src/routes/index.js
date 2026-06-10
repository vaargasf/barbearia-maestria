import { Router } from 'express'
import authRoutes from './authRoutes.js'
import publicRoutes from './publicRoutes.js'
import barberRoutes from './barberRoutes.js'

const router = Router()

router.use('/public', publicRoutes)
router.use('/auth', authRoutes)
router.use('/barbers', barberRoutes)

export default router

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'
import { config } from './config/index.js'
import routes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: config.frontendUrl,
      credentials: true,
    })
  )
  app.use(express.json({ limit: '6mb' }))

  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'barbearia-maestria-server' })
  })

  app.use('/api', routes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

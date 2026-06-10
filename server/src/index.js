import dotenv from 'dotenv'
import { createApp } from './app.js'
import { config } from './config/index.js'
import { prisma } from './lib/prisma.js'

dotenv.config()

const app = createApp()

app.listen(config.port, () => {
  console.log(`Server rodando em http://localhost:${config.port}`)
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

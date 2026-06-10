import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.appointment.deleteMany()
  await prisma.availability.deleteMany()
  await prisma.barberDateOff.deleteMany()
  await prisma.service.deleteMany()
  await prisma.user.deleteMany()

  const password = await bcrypt.hash('123456', 10)

  const barber1 = await prisma.user.create({
    data: {
      name: 'Eric Maia',
      email: 'eric@maestria.com',
      cpf: '333.333.333-33',
      phone: '(11) 99999-0003',
      password,
      role: 'ROLE_ADMIN',
      isBarber: true,
      avatarUrl: '/barbers/eric-maia.png',
      active: true,
    },
  })

  const barber2 = await prisma.user.create({
    data: {
      name: 'Gustavo Magnus',
      email: 'gustavo@maestria.com',
      cpf: '444.444.444-44',
      phone: '(11) 99999-0004',
      password,
      role: 'ROLE_ADMIN',
      isBarber: true,
      avatarUrl: '/barbers/gustavo-magnus.png',
      active: true,
    },
  })

  const demoClient = await prisma.user.create({
    data: {
      name: 'Carlos Cliente',
      email: 'cliente@maestria.com',
      cpf: '111.111.111-11',
      phone: '(11) 99999-0001',
      password,
      role: 'ROLE_CLIENT',
      active: true,
    },
  })

  const serviceDefs = [
    {
      name: 'Barba Simples (apenas máquina)',
      price: 20,
      durationMinutes: 20,
      description: 'Acabamento de barba feito apenas com máquina.',
    },
    {
      name: 'Barba Vip (espuma / toalha quente)',
      price: 35,
      durationMinutes: 35,
      description: 'Barba com espuma e toalha quente para um acabamento premium.',
    },
    {
      name: 'Corte degrade + barba (apenas máquina)',
      price: 45,
      durationMinutes: 50,
      description: 'Corte degradê combinado com barba na máquina.',
    },
    {
      name: 'Corte degrade / corte social',
      price: 35,
      durationMinutes: 40,
      description: 'Degradê moderno ou corte social, conforme preferência.',
    },
    {
      name: 'Corte e barba vip (com espuma / toalha quente)',
      price: 65,
      durationMinutes: 60,
      description: 'Combo completo de corte e barba com espuma e toalha quente.',
    },
    {
      name: 'Corte Social',
      price: 35,
      durationMinutes: 40,
      description: 'Corte social clássico e bem alinhado.',
    },
    {
      name: 'Sobrancelha (lâmina)',
      price: 20,
      durationMinutes: 15,
      description: 'Design de sobrancelha com lâmina.',
    },
    {
      name: 'Undercut',
      price: 25,
      durationMinutes: 30,
      description: 'Corte undercut com laterais bem marcadas.',
    },
  ]

  const barbers = [barber1, barber2]
  const allServices = []

  for (const barber of barbers) {
    for (const def of serviceDefs) {
      const s = await prisma.service.create({
        data: { ...def, barberId: barber.id },
      })
      allServices.push(s)
    }

    await prisma.availability.createMany({
      data: [
        { barberId: barber.id, dayOfWeek: 1, startTime: '09:00', endTime: '19:00' },
        { barberId: barber.id, dayOfWeek: 2, startTime: '09:00', endTime: '19:00' },
        { barberId: barber.id, dayOfWeek: 3, startTime: '09:00', endTime: '19:00' },
        { barberId: barber.id, dayOfWeek: 4, startTime: '09:00', endTime: '19:00' },
        { barberId: barber.id, dayOfWeek: 5, startTime: '09:00', endTime: '19:00' },
        { barberId: barber.id, dayOfWeek: 6, startTime: '09:00', endTime: '17:00' },
      ],
    })
  }

  const tomorrow = new Date()
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
  tomorrow.setUTCHours(0, 0, 0, 0)

  await prisma.appointment.create({
    data: {
      clientId: demoClient.id,
      barberId: barber1.id,
      serviceId: allServices[0].id,
      date: tomorrow,
      startTime: '10:00',
      endTime: '10:45',
      status: 'AGENDADO',
    },
  })

  const historyPlan = [
    { monthsAgo: 5, total: 8, finalized: 6 },
    { monthsAgo: 4, total: 10, finalized: 8 },
    { monthsAgo: 3, total: 14, finalized: 12 },
    { monthsAgo: 2, total: 11, finalized: 9 },
    { monthsAgo: 1, total: 16, finalized: 14 },
    { monthsAgo: 0, total: 5, finalized: 3 },
  ]

  const ericServices = allServices.filter((s) => s.barberId === barber1.id)
  const times = ['09:00', '10:30', '14:00', '15:30', '17:00']

  for (const plan of historyPlan) {
    const base = new Date()
    base.setUTCDate(1)
    base.setUTCMonth(base.getUTCMonth() - plan.monthsAgo)
    base.setUTCHours(12, 0, 0, 0)

    for (let i = 0; i < plan.total; i += 1) {
      const day = Math.min(28, 2 + i * 2)
      const apptDate = new Date(base)
      apptDate.setUTCDate(day)
      const service = ericServices[i % ericServices.length]
      const isFinalized = i < plan.finalized

      await prisma.appointment.create({
        data: {
          clientId: demoClient.id,
          barberId: barber1.id,
          serviceId: service.id,
          date: apptDate,
          startTime: times[i % times.length],
          endTime: times[i % times.length],
          status: isFinalized ? 'FINALIZADO' : 'AGENDADO',
        },
      })
    }
  }

  console.log('Seed concluído — barbeiros Eric e Gustavo com senha 123456')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

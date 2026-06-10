import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const createBookingSchema = z.object({
  name: z.string().min(2, 'Nome inválido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Telefone inválido'),
  barberId: z.coerce.number().int().positive(),
  serviceId: z.coerce.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  startTime: z.string().min(4, 'Horário inválido'),
})

export const slotsQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  serviceId: z.coerce.number().int().positive(),
})

export const updateProfileSchema = z
  .object({
    name: z.string().min(2).optional(),
    phone: z.string().min(8).optional(),
    avatarUrl: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nenhum dado para atualizar' })

export const updateServiceSchema = z.object({
  name: z.string().min(2).optional(),
  price: z.coerce.number().positive().optional(),
  durationMinutes: z.coerce.number().int().positive().optional(),
  description: z.string().optional(),
  active: z.boolean().optional(),
})

export const avatarSchema = z.object({
  dataUrl: z.string().min(50, 'Imagem inválida'),
})

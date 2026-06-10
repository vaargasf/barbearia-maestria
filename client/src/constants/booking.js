import { BRAND_NAME } from './brand'

export const BARBERSHOP = {
  name: BRAND_NAME,
  address: 'Rua Francisco Teixeira, 15 - Centro',
  imageUrl: '/barbershop.jpg',
  rating: '5,0',
  reviews: '899 avaliações',
}

const BARBER_AVATARS = {
  'eric maia': '/barbers/eric-maia.png',
  'gustavo magnus': '/barbers/gustavo-magnus.png',
}

export function formatPrice(value) {
  return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))
}

export function getBarberAvatar(barber) {
  if (barber?.avatarUrl) return barber.avatarUrl
  const key = (barber?.name ?? '').toLowerCase().trim()
  return BARBER_AVATARS[key] ?? null
}

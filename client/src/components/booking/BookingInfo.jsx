import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent } from '@/components/ui/Card'
import { BARBERSHOP, formatPrice } from '@/constants/booking'

export function BookingInfo({ service, barber, date, time }) {
  const dateObj = date && time ? parseISO(`${date}T${time}:00`) : null

  return (
    <Card>
      <CardContent className="p-3 gap-3 flex flex-col">
        {service && (
          <div className="flex justify-between">
            <h2 className="font-bold">{service.name}</h2>
            <h3 className="font-bold text-sm">{formatPrice(service.price)}</h3>
          </div>
        )}

        {barber && (
          <div className="flex justify-between">
            <h3 className="text-gray-400 text-sm">Barbeiro</h3>
            <h4 className="text-sm">{barber.name}</h4>
          </div>
        )}

        {dateObj && (
          <>
            <div className="flex justify-between">
              <h3 className="text-gray-400 text-sm">Data</h3>
              <h4 className="text-sm">{format(dateObj, "dd 'de' MMMM", { locale: ptBR })}</h4>
            </div>
            <div className="flex justify-between">
              <h3 className="text-gray-400 text-sm">Horário</h3>
              <h4 className="text-sm">{format(dateObj, 'HH:mm')}</h4>
            </div>
          </>
        )}

        <div className="flex justify-between">
          <h3 className="text-gray-400 text-sm">Barbearia</h3>
          <h4 className="text-sm">{BARBERSHOP.name}</h4>
        </div>
      </CardContent>
    </Card>
  )
}

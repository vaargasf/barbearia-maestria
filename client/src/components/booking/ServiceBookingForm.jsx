import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/Calendar'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet'
import { BookingInfo } from '@/components/booking/BookingInfo'
import { BookingSuccessDialog } from '@/components/booking/BookingSuccessDialog'
import { bookingService } from '@/services/booking.service'
import { formatPrice } from '@/constants/booking'

export function ServiceBookingForm({ services, barber }) {
  const [serviceId, setServiceId] = useState('')
  const [date, setDate] = useState(undefined)
  const [hour, setHour] = useState(undefined)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetStep, setSheetStep] = useState('schedule')
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successBooking, setSuccessBooking] = useState(null)

  const { register, handleSubmit, reset } = useForm()
  const service = services.find((s) => String(s.id) === serviceId)
  const dateStr = date ? format(date, 'yyyy-MM-dd') : null

  useEffect(() => {
    if (services.length) {
      setServiceId(String(services[0].id))
    } else {
      setServiceId('')
    }
  }, [services, barber?.id])

  useEffect(() => {
    if (!dateStr || !barber?.id || !service?.id) {
      setSlots([])
      return
    }
    setLoadingSlots(true)
    bookingService
      .getSlots(barber.id, dateStr, service.id)
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false))
  }, [dateStr, barber?.id, service?.id])

  const resetSheet = () => {
    setDate(undefined)
    setHour(undefined)
    setSheetStep('schedule')
    setError(null)
    reset()
  }

  const handleOpenChange = (open) => {
    setSheetOpen(open)
    if (!open) resetSheet()
  }

  const handleContinue = () => {
    if (!date || !hour) return
    setSheetStep('details')
    setError(null)
  }

  const onSubmit = async (data) => {
    if (!service) return
    setError(null)
    setSubmitting(true)
    try {
      const result = await bookingService.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        barberId: barber.id,
        serviceId: service.id,
        date: dateStr,
        startTime: hour,
      })
      setSheetOpen(false)
      resetSheet()
      setSuccessBooking(result)
    } catch (e) {
      setError(e?.response?.data?.message ?? 'Erro ao confirmar reserva.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!services.length) {
    return <p className="text-sm text-muted-foreground mt-4">Nenhum serviço disponível.</p>
  }

  return (
    <>
      {successBooking && service && (
        <BookingSuccessDialog
          booking={successBooking}
          service={service}
          barber={barber}
          onClose={() => setSuccessBooking(null)}
        />
      )}

      <Card>
        <CardContent className="p-4 sm:p-5 space-y-3">
          <Select
            id="service-select"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            aria-label="Serviço"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {formatPrice(s.price)}
              </option>
            ))}
          </Select>

          {service && (
            <Sheet open={sheetOpen} onOpenChange={handleOpenChange}>
              <SheetTrigger asChild>
                <Button disabled={!barber} className="w-full">
                  Agendar horário
                </Button>
              </SheetTrigger>

                <SheetContent className="p-0 flex flex-col w-full sm:max-w-md overflow-y-auto">
                  {sheetStep === 'schedule' ? (
                    <>
                      <SheetHeader className="text-left px-4 sm:px-5 py-5 sm:py-6 border-b border-secondary">
                        <SheetTitle>Fazer reserva</SheetTitle>
                      </SheetHeader>

                      <div className="py-4 sm:py-6 overflow-x-auto">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(d) => {
                            setDate(d)
                            setHour(undefined)
                          }}
                          locale={ptBR}
                          fromDate={new Date()}
                          className="mx-auto"
                          styles={{
                            head_cell: { width: '100%', textTransform: 'capitalize' },
                            cell: { width: '100%' },
                            button: { width: '100%' },
                            nav_button_previous: { width: '32px', height: '32px' },
                            nav_button_next: { width: '32px', height: '32px' },
                            caption: { textTransform: 'capitalize' },
                          }}
                        />
                      </div>

                      {date && (
                        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 overflow-x-auto py-4 sm:py-6 px-4 sm:px-5 border-t border-secondary [&::-webkit-scrollbar]:hidden">
                          {loadingSlots ? (
                            <span className="text-sm text-muted-foreground">Carregando...</span>
                          ) : slots.length === 0 ? (
                            <span className="text-sm text-muted-foreground">Sem horários neste dia.</span>
                          ) : (
                            slots.map((time) => (
                              <Button
                                key={time}
                                onClick={() => setHour(time)}
                                variant={hour === time ? 'default' : 'outline'}
                                className="rounded-full shrink-0 min-w-[72px]"
                                type="button"
                              >
                                {time}
                              </Button>
                            ))
                          )}
                        </div>
                      )}

                      <div className="py-4 sm:py-6 px-4 sm:px-5 border-t border-secondary">
                        <BookingInfo service={service} barber={barber} date={dateStr} time={hour} />
                      </div>

                      <SheetFooter className="px-4 sm:px-5 pb-6">
                        <Button
                          onClick={handleContinue}
                          disabled={!hour || !date}
                          type="button"
                          className="w-full"
                        >
                          Continuar
                        </Button>
                      </SheetFooter>
                    </>
                  ) : (
                    <>
                      <SheetHeader className="text-left px-4 sm:px-5 py-5 sm:py-6 border-b border-secondary">
                        <SheetTitle>Seus dados</SheetTitle>
                      </SheetHeader>

                      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
                        <div className="px-4 sm:px-5 py-5 sm:py-6 space-y-4">
                          <div>
                            <label className="text-sm text-muted-foreground mb-1.5 block">Nome completo</label>
                            <Input autoComplete="name" {...register('name', { required: true })} />
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground mb-1.5 block">Telefone</label>
                            <Input
                              type="tel"
                              autoComplete="tel"
                              placeholder="(11) 99999-9999"
                              {...register('phone', { required: true })}
                            />
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                            <Input type="email" autoComplete="email" {...register('email', { required: true })} />
                          </div>
                          {error && <p className="text-destructive text-sm">{error}</p>}
                        </div>

                        <div className="py-4 sm:py-6 px-4 sm:px-5 border-t border-secondary">
                          <BookingInfo service={service} barber={barber} date={dateStr} time={hour} />
                        </div>

                        <SheetFooter className="px-4 sm:px-5 pb-6 flex-col sm:flex-row gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setSheetStep('schedule')}
                            className="w-full sm:w-auto"
                          >
                            Voltar
                          </Button>
                          <Button type="submit" disabled={submitting} className="w-full sm:flex-1">
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirmar reserva
                          </Button>
                        </SheetFooter>
                      </form>
                    </>
                  )}
                </SheetContent>
              </Sheet>
          )}
        </CardContent>
      </Card>
    </>
  )
}

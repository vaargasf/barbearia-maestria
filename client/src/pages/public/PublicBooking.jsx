import { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BarbershopInfo } from '@/components/booking/BarbershopInfo'
import { BarberItem } from '@/components/booking/BarberItem'
import { ServiceBookingForm } from '@/components/booking/ServiceBookingForm'
import { bookingService } from '@/services/booking.service'

function SectionTitle({ children }) {
  return (
    <h2 className="section-title px-4 sm:px-6">
      <span className="section-title-accent" />
      {children}
    </h2>
  )
}

export function PublicBooking() {
  const [barbers, setBarbers] = useState([])
  const [services, setServices] = useState([])
  const [barberId, setBarberId] = useState(null)
  const [loading, setLoading] = useState(true)
  const servicesRef = useRef(null)

  const selectedBarber = barbers.find((b) => b.id === barberId)

  const handleSelectBarber = (id) => {
    setBarberId(id)
  }

  useEffect(() => {
    if (!barberId) return
    const timer = setTimeout(() => {
      servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      document.getElementById('service-select')?.focus({ preventScroll: true })
    }, 100)
    return () => clearTimeout(timer)
  }, [barberId])

  useEffect(() => {
    bookingService
      .listBarbers()
      .then(setBarbers)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!barberId) {
      setServices([])
      return
    }
    bookingService.listServices(barberId).then(setServices)
  }, [barberId])

  return (
    <div className="app-shell min-h-screen md:border-x md:border-border/50">
      <Header />

      <section className="px-4 sm:px-6 pt-5 sm:pt-8 pb-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
          Olá! Vamos agendar um corte hoje?
        </h1>
        <p className="capitalize text-sm sm:text-base text-muted-foreground mt-2">
          {format(new Date(), "EEEE',' dd 'de' MMMM", { locale: ptBR })}
        </p>
      </section>

      <BarbershopInfo />

      <section className="mt-6 sm:mt-8">
        <SectionTitle>Escolha o barbeiro</SectionTitle>

        {loading ? (
          <p className="text-sm text-muted-foreground px-4 sm:px-6 py-4">Carregando barbeiros...</p>
        ) : (
          <div className="barber-scroll px-4 sm:px-6 pb-2">
            <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:gap-4">
              {barbers.map((barber) => (
                <BarberItem
                  key={barber.id}
                  barber={barber}
                  selected={barberId === barber.id}
                  onSelect={handleSelectBarber}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {barberId && (
        <section ref={servicesRef} className="px-4 sm:px-6 py-6 sm:py-8 mb-20 sm:mb-24 scroll-mt-4">
          <div className="max-w-lg">
            <ServiceBookingForm services={services} barber={selectedBarber} />
          </div>
        </section>
      )}

      {!barberId && <div className="mb-20 sm:mb-24" />}

      <Footer />
    </div>
  )
}

import { MapPinIcon, StarIcon } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { BARBERSHOP } from '@/constants/booking'

export function BarbershopInfo() {
  return (
    <div>
      <div className="relative h-[240px] sm:h-[280px] md:h-[320px] w-full overflow-hidden">
        <img
          src={BARBERSHOP.imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30" />

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 px-5 text-center">
          <Logo
            size="xl"
            className="mb-3 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] brightness-110"
          />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-md">
            {BARBERSHOP.name}
          </h1>
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 pb-6 border-b border-secondary space-y-2">
        <div className="flex items-start gap-2">
          <MapPinIcon className="text-primary shrink-0 mt-0.5" size={18} />
          <p className="text-sm sm:text-base">{BARBERSHOP.address}</p>
        </div>
        <div className="flex items-center gap-2">
          <StarIcon className="text-primary fill-primary shrink-0" size={18} />
          <p className="text-sm sm:text-base">
            {BARBERSHOP.rating} ({BARBERSHOP.reviews})
          </p>
        </div>
      </div>
    </div>
  )
}

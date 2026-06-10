import { StarIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Avatar, AvatarFallback } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { getBarberAvatar } from '@/constants/booking'

export function BarberItem({ barber, selected, onSelect }) {
  const initials = barber.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const avatarSrc = getBarberAvatar(barber)

  return (
    <Card
      className={cn(
        'w-full min-w-[150px] sm:min-w-0 rounded-2xl cursor-pointer transition-all hover:border-primary/40 overflow-hidden',
        selected && 'ring-2 ring-primary border-primary bg-primary/5'
      )}
      onClick={() => onSelect(barber.id)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[4/5] max-h-52 w-full bg-secondary/80">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={barber.name}
              className="absolute inset-0 h-full w-full object-cover object-[center_55%] grayscale-[15%] hover:grayscale-0 transition-all duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg font-bold bg-secondary text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 opacity-95 flex gap-1 items-center shadow-sm"
          >
            <StarIcon size={12} className="fill-primary text-primary" />
            <span className="text-xs">5,0</span>
          </Badge>
        </div>
        <div className="px-3 py-3 sm:py-4 text-center">
          <h2 className="font-bold text-sm sm:text-base leading-tight">{barber.name}</h2>
          <p className="text-xs text-muted-foreground mt-1">Barbeiro</p>
        </div>
      </CardContent>
    </Card>
  )
}

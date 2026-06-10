import { Link } from 'react-router-dom'
import { MenuIcon } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { BRAND_NAME } from '@/constants/brand'
import { Button } from '@/components/ui/Button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet'
import { SideMenu } from '@/components/layout/SideMenu'

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <Logo size="header" className="drop-shadow-[0_0_12px_rgba(139,92,246,0.35)]" />
          <span className="hidden sm:block font-semibold text-sm md:text-base text-foreground truncate">
            {BRAND_NAME}
          </span>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <MenuIcon size={18} />
            </Button>
          </SheetTrigger>
          <SheetContent className="p-0 w-full max-w-xs">
            <SideMenu />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

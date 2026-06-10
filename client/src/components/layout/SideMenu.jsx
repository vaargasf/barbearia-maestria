import { Link } from 'react-router-dom'
import { HomeIcon } from 'lucide-react'
import { SheetHeader, SheetTitle } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'

export function SideMenu() {
  return (
    <>
      <SheetHeader className="text-left border-b border-solid border-secondary p-5">
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>

      <div className="flex flex-col px-5 py-6 gap-3">
        <p className="text-sm text-muted-foreground">
          Agende seu horário direto na página inicial, sem precisar de cadastro.
        </p>
      </div>

      <div className="flex flex-col gap-3 px-5 pb-6">
        <Button variant="outline" className="justify-start" asChild>
          <Link to="/">
            <HomeIcon size={18} className="mr-2" />
            Início
          </Link>
        </Button>
      </div>
    </>
  )
}

// src/components/features/dashboard/MobileNav.tsx
'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { MobileNavProps } from '@/types/ui.types'

import { MainNav } from './main-nav'

export function MobileNav({ navItems }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Deschide meniul de navigație</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0">
        {/* Adăugăm un header în meniu, similar cu cel de pe desktop */}
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            {/* Aici poți adăuga un logo SVG */}
            <span className="">Salon App</span>
          </Link>
        </div>

        {/* Adăugăm padding aici pentru a controla spațierea conținutului */}
        <div className="flex-1 overflow-auto p-4">
          <MainNav items={navItems} onLinkClick={() => setIsOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

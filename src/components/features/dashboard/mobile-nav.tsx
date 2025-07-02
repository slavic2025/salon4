// src/components/dashboard/mobile-nav.tsx
'use client'

import { Menu } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import type { NavItem } from '@/types/ui.types'

import { MainNav } from './main-nav'

interface MobileNavProps {
  navItems: NavItem[]
}

export function MobileNav({ navItems }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {/* Butonul de meniu este vizibil doar pe ecrane mici */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Deschide Meniu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-6">
        <div className="text-lg font-semibold mb-6">Meniu</div>
        {/* 2. Folosim direct `MainNav` și îi pasăm item-ele și un callback
            pentru a închide meniul la click pe un link. */}
        <MainNav items={navItems} onLinkClick={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

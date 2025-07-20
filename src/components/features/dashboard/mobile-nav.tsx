// src/components/features/dashboard/mobile-nav.tsx
'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { MobileNavProps } from '@/types/ui.types'

import { DASHBOARD_CONSTANTS } from './dashboard.constants'
import { MainNav } from './main-nav'

// Constante pentru configurația UI
const UI_CONSTANTS = {
  ICON_SIZE: 'h-5 w-5',
  SHEET_SIDE: 'left' as const,
} as const

// Constante pentru clase CSS specifice
const CSS_CLASSES = {
  TRIGGER_BUTTON: 'shrink-0 md:hidden',
  SHEET_CONTENT: 'flex flex-col p-0',
  HEADER_CONTAINER: `flex items-center border-b px-4 ${DASHBOARD_CONSTANTS.HEIGHTS.HEADER_MOBILE} ${DASHBOARD_CONSTANTS.HEIGHTS.HEADER_DESKTOP} lg:px-6`,
  BRAND_LINK: 'flex items-center gap-2 font-semibold',
  CONTENT_CONTAINER: 'flex-1 overflow-auto p-4',
} as const

export function MobileNav({ navItems }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLinkClick = () => setIsOpen(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={CSS_CLASSES.TRIGGER_BUTTON}>
          <Menu className={UI_CONSTANTS.ICON_SIZE} />
          <span className="sr-only">Deschide meniul de navigație</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={UI_CONSTANTS.SHEET_SIDE} className={CSS_CLASSES.SHEET_CONTENT}>
        <div className={CSS_CLASSES.HEADER_CONTAINER}>
          <Link href="/" className={CSS_CLASSES.BRAND_LINK}>
            <span>{DASHBOARD_CONSTANTS.BRAND_NAME}</span>
          </Link>
        </div>
        <div className={CSS_CLASSES.CONTENT_CONTAINER}>
          <MainNav items={navItems} onLinkClick={handleLinkClick} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

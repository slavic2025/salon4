// src/components/features/dashboard/mobile-nav.tsx
'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { MobileNavProps } from '@/types/ui.types'

import { DASHBOARD_CONSTANTS, DASHBOARD_CSS_CLASSES, DASHBOARD_UI_CONSTANTS } from './dashboard.constants'
import { MainNav } from './main-nav'

export function MobileNav({ navItems }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLinkClick = () => setIsOpen(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={DASHBOARD_CSS_CLASSES.HEADER.MOBILE_TRIGGER}
          aria-label="Deschide meniul de navigație"
        >
          <Menu className={DASHBOARD_UI_CONSTANTS.ICONS.SIZE_MEDIUM} />
        </Button>
      </SheetTrigger>
      <SheetContent side={DASHBOARD_UI_CONSTANTS.SHEET.SIDE} className={DASHBOARD_CSS_CLASSES.MOBILE.SHEET_CONTENT}>
        <div className={DASHBOARD_CSS_CLASSES.MOBILE.HEADER_CONTAINER}>
          <Link href="/" className={DASHBOARD_CSS_CLASSES.BRAND.LINK}>
            <span>{DASHBOARD_CONSTANTS.BRAND_NAME}</span>
          </Link>
        </div>
        <div className={DASHBOARD_CSS_CLASSES.MOBILE.CONTENT_CONTAINER}>
          <MainNav items={navItems} onLinkClick={handleLinkClick} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

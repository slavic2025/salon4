// src/components/features/dashboard/main-nav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getIconComponent } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { MainNavProps } from '@/types/ui.types'

import { DASHBOARD_CSS_CLASSES } from './dashboard.constants'

// Constante pentru configurația UI
const UI_CONSTANTS = {
  ICON_SIZE: 'h-4 w-4',
  TOOLTIP_DELAY: 0,
  TOOLTIP_SIDE: 'right' as const,
} as const

export function MainNav({ items, onLinkClick }: MainNavProps) {
  const pathname = usePathname()

  if (!items?.length) {
    return null
  }

  const isActiveLink = (href: string) => {
    return href === '/' ? pathname === href : pathname.startsWith(href)
  }

  return (
    <TooltipProvider delayDuration={UI_CONSTANTS.TOOLTIP_DELAY}>
      <nav className={DASHBOARD_CSS_CLASSES.NAVIGATION.CONTAINER}>
        {items.map((item, index) => {
          const Icon = getIconComponent(item.icon)
          const isActive = isActiveLink(item.href)

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  href={item.disabled ? '#' : item.href}
                  onClick={onLinkClick}
                  className={cn(
                    DASHBOARD_CSS_CLASSES.NAVIGATION.LINK,
                    isActive && DASHBOARD_CSS_CLASSES.NAVIGATION.ACTIVE,
                    item.disabled && DASHBOARD_CSS_CLASSES.NAVIGATION.DISABLED,
                  )}
                >
                  <Icon className={UI_CONSTANTS.ICON_SIZE} />
                  <span>{item.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side={UI_CONSTANTS.TOOLTIP_SIDE}>
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </nav>
    </TooltipProvider>
  )
}

// src/components/features/dashboard/main-nav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getIconComponent } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { MainNavProps } from '@/types/ui.types'

import { DASHBOARD_CSS_CLASSES, DASHBOARD_UI_CONSTANTS } from './dashboard.constants'

export function MainNav({ items, onLinkClick }: MainNavProps) {
  const pathname = usePathname()

  if (!items?.length) {
    return null
  }

  const isActiveLink = (href: string) => {
    return href === '/' ? pathname === href : pathname.startsWith(href)
  }

  return (
    <TooltipProvider delayDuration={DASHBOARD_UI_CONSTANTS.TOOLTIP.DELAY}>
      <nav className={DASHBOARD_CSS_CLASSES.NAVIGATION.CONTAINER} role="navigation" aria-label="Navigația principală">
        {items.map((item, index) => {
          const Icon = getIconComponent(item.icon)
          const isActive = isActiveLink(item.href)

          return (
            <Tooltip key={`nav-item-${index}`}>
              <TooltipTrigger asChild>
                <Link
                  href={item.disabled ? '#' : item.href}
                  onClick={onLinkClick}
                  className={cn(
                    DASHBOARD_CSS_CLASSES.NAVIGATION.LINK,
                    isActive && DASHBOARD_CSS_CLASSES.NAVIGATION.ACTIVE,
                    item.disabled && DASHBOARD_CSS_CLASSES.NAVIGATION.DISABLED,
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  aria-disabled={item.disabled}
                  tabIndex={item.disabled ? -1 : 0}
                >
                  <Icon className={DASHBOARD_UI_CONSTANTS.ICONS.SIZE_SMALL} aria-hidden="true" />
                  <span className="truncate">{item.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side={DASHBOARD_UI_CONSTANTS.TOOLTIP.SIDE}>
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </nav>
    </TooltipProvider>
  )
}

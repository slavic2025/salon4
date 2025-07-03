// src/components/shared/main-nav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getIconComponent } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { MainNavProps } from '@/types/ui.types'

export function MainNav({ items, onLinkClick }: MainNavProps) {
  const pathname = usePathname()

  if (!items?.length) {
    return null
  }

  return (
    // Adăugăm TooltipProvider ca wrapper pentru a activa tooltip-urile
    <TooltipProvider delayDuration={0}>
      <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
        {items.map((item, index) => {
          const Icon = getIconComponent(item.icon)

          // Logică îmbunătățită pentru link-ul activ:
          // - Folosim startsWith pentru a include și sub-paginile.
          // - Tratăm cazul special al link-ului rădăcină (ex: /admin) pentru a nu fi activ tot timpul.
          const isActive = item.href === '/' ? pathname === item.href : pathname.startsWith(item.href)

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  href={item.disabled ? '#' : item.href}
                  onClick={onLinkClick}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    isActive && 'bg-muted text-primary',
                    item.disabled && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </nav>
    </TooltipProvider>
  )
}

// src/components/dashboard/main-nav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { getIconComponent } from '@/lib/utils' // Import the new helper
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types/ui.types'

interface MainNavProps {
  items: NavItem[]
  onLinkClick?: () => void
}

export function MainNav({ items, onLinkClick }: MainNavProps) {
  const pathname = usePathname()

  if (!items?.length) {
    return null
  }

  return (
    <nav className="flex flex-col gap-2">
      {items.map((item, index) => {
        const Icon = getIconComponent(item.icon)

        const isActive = pathname === item.href

        return (
          <Link
            key={index}
            href={item.disabled ? '#' : item.href}
            onClick={onLinkClick}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              item.disabled && 'cursor-not-allowed opacity-80',
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}

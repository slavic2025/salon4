'use client'

import { PackageOpen } from 'lucide-react'
import { type ReactNode } from 'react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title: string
  description: string
  icon?: ReactNode
  className?: string
  actions?: ReactNode
}

/**
 * O moleculă reutilizabilă pentru a afișa o stare de "gol".
 * Este compusă din atomi: Card, Heading, Icon.
 */
export function EmptyState({
  title,
  description,
  icon = <PackageOpen className="h-12 w-12 text-gray-400" />,
  className,
  actions,
}: EmptyStateProps) {
  return (
    <Card className={cn('flex flex-col items-center justify-center p-8 text-center border-dashed', className)}>
      {icon && <div className="mb-4">{icon}</div>}

      {/* --- AICI ESTE MODIFICAREA --- */}
      {/* Folosim un header HTML simplu în loc de componenta Heading */}
      <header className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </header>

      {/* Randăm acțiuni (ex: un buton) dacă sunt furnizate */}
      {actions && <div className="mt-6">{actions}</div>}
    </Card>
  )
}

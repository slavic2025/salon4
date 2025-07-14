import { List } from 'lucide-react'
import Link from 'next/link'

import { PATHS } from '@/lib/constants'

export type StylistServicesLinkProps = { stylistId: string }

export function StylistServicesLink({ stylistId }: StylistServicesLinkProps) {
  return (
    <Link
      href={PATHS.pages.services(stylistId)}
      className="flex items-center gap-2 focus:outline-none focus:bg-accent/30 hover:bg-accent hover:text-accent-foreground px-2 py-1.5 rounded-sm text-sm transition-colors"
    >
      <List className="h-4 w-4 text-muted-foreground" />
      <span>Servicii</span>
    </Link>
  )
}

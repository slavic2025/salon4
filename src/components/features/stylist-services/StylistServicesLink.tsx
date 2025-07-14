import { List } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { PATHS } from '@/lib/constants'

export type StylistServicesLinkProps = { stylistId: string }

export function StylistServicesLink({ stylistId }: StylistServicesLinkProps) {
  return (
    <Button asChild variant="outline" size="sm" className="w-full justify-start gap-2">
      <Link href={PATHS.pages.services(stylistId)}>
        <List className="h-4 w-4" />
        Servicii
      </Link>
    </Button>
  )
}

// src/components/features/stylist-services/StylistOwnServicesTable.tsx
'use client'

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { StylistServiceLinkWithService } from '@/core/domains/stylist-services/stylist-service.types'

import { StylistOwnServiceTableRow } from './StylistOwnServiceTableRow'

type StylistOwnServicesTableProps = {
  services: StylistServiceLinkWithService[]
  stylistId: string
}

export function StylistOwnServicesTable({ services, stylistId }: StylistOwnServicesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nume</TableHead>
          <TableHead>Categorie</TableHead>
          <TableHead>Preț standard</TableHead>
          <TableHead>Durată standard</TableHead>
          <TableHead>Preț personalizat</TableHead>
          <TableHead>Durată personalizată</TableHead>
          <TableHead>
            <span className="sr-only">Acțiuni</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((link) => (
          <StylistOwnServiceTableRow key={link.serviceId} link={link} stylistId={stylistId} />
        ))}
      </TableBody>
    </Table>
  )
}

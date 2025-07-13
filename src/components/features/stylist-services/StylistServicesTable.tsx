// src/components/features/stylist-services/StylistServicesTable.tsx
'use client'

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { StylistServiceLinkWithService } from '@/core/domains/stylist-services/stylist-service.types'

import { StylistServiceTableRow } from './StylistServiceTableRow'

interface StylistServicesTableProps {
  services: StylistServiceLinkWithService[]
  stylistId: string
}

export function StylistServicesTable({ services, stylistId }: StylistServicesTableProps) {
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
          <StylistServiceTableRow key={link.serviceId} link={link} stylistId={stylistId} />
        ))}
      </TableBody>
    </Table>
  )
}

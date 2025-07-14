// src/components/features/services/ServicesTable.tsx
'use client'

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Service } from '@/core/domains/services/service.types'

import { ServiceTableRow } from './ServiceTableRow'

type ServicesTableProps = {
  services: Service[]
}

export function ServicesTable({ services }: ServicesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nume</TableHead>
          <TableHead>Categorie</TableHead>
          <TableHead>Preț</TableHead>
          <TableHead>Durata</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <ServiceTableRow key={service.id} service={service} />
        ))}
      </TableBody>
    </Table>
  )
}

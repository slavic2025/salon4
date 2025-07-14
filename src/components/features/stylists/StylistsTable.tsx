// src/components/features/stylists/StylistsTable.tsx
'use client'

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Stylist } from '@/core/domains/stylists/stylist.types'

import { StylistTableRow } from './StylistTableRow'

type StylistsTableProps = {
  stylists: Stylist[]
}

export function StylistsTable({ stylists }: StylistsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">Imagine</TableHead>
          <TableHead>Nume</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Contact</TableHead>
          <TableHead>
            <span className="sr-only">Acțiuni</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stylists.map((stylist) => (
          <StylistTableRow key={stylist.id} stylist={stylist} />
        ))}
      </TableBody>
    </Table>
  )
}

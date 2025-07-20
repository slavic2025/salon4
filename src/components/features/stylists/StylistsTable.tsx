// src/components/features/stylists/StylistsTable.tsx
'use client'

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Stylist } from '@/core/domains/stylists/stylist.types'

import { StylistTableRow } from './StylistTableRow'

type StylistsTableProps = {
  stylists: Stylist[]
  className?: string
}

export function StylistsTable({ stylists, className }: StylistsTableProps) {
  if (stylists.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
        <div className="rounded-full bg-muted p-3 mb-4">
          <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Nu s-au găsit stiliști</h3>
        <p className="text-muted-foreground max-w-sm">Încearcă să modifici filtrele sau să adaugi un stilist nou.</p>
      </div>
    )
  }

  return (
    <div className={`rounded-lg border ${className}`}>
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
    </div>
  )
}

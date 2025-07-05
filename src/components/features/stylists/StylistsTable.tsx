// src/components/features/stylists/StylistsTable.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Stylist } from '@/core/domains/stylists/stylist.types'

interface StylistsTableProps {
  stylists: Stylist[]
}

export function StylistsTable({ stylists }: StylistsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Imagine</span>
          </TableHead>
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
          <TableRow key={stylist.id}>
            <TableCell className="hidden sm:table-cell">
              <Avatar className="h-10 w-10">
                <AvatarImage src={stylist.profilePicture ?? undefined} alt={stylist.fullName} />
                <AvatarFallback>{stylist.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell className="font-medium">{stylist.fullName}</TableCell>
            <TableCell>
              <Badge variant={stylist.isActive ? 'outline' : 'destructive'}>
                {stylist.isActive ? 'Activ' : 'Inactiv'}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <div className="text-sm text-muted-foreground">{stylist.email}</div>
              <div className="text-sm text-muted-foreground">{stylist.phone}</div>
            </TableCell>
            <TableCell>{/* Aici vor veni butoanele de Editare/Ștergere */}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

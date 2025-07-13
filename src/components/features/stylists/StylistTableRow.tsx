// src/components/features/stylists/StylistTableRow.tsx
'use client'

import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

import { ManageStylistServicesDialog } from '@/components/features/stylist-services/ManageStylistServicesDialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import type { Stylist } from '@/core/domains/stylists/stylist.types'

import { DeleteStylistMenuItem } from './DeleteStylistMenuItem'
import { EditStylistDialog } from './EditStylistDialog'

interface StylistTableRowProps {
  stylist: Stylist
}

export function StylistTableRow({ stylist }: StylistTableRowProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  return (
    <>
      <TableRow>
        <TableCell className="hidden sm:table-cell">
          <Avatar className="h-10 w-10">
            <AvatarImage src={stylist.profilePicture ?? undefined} alt={stylist.fullName} />
            <AvatarFallback>{stylist.fullName?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </TableCell>
        <TableCell className="font-medium">{stylist.fullName}</TableCell>
        <TableCell>
          <Badge variant={stylist.isActive ? 'outline' : 'destructive'}>{stylist.isActive ? 'Activ' : 'Inactiv'}</Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <div className="text-sm">{stylist.email}</div>
          <div className="text-sm text-muted-foreground">{stylist.phone}</div>
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>Editează</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <ManageStylistServicesDialog stylistId={stylist.id} stylistName={stylist.fullName} />
              </DropdownMenuItem>
              <DeleteStylistMenuItem stylistId={stylist.id} stylistName={stylist.fullName} />
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Dialogul de editare este randat aici, dar este invizibil inițial */}
      <EditStylistDialog stylist={stylist} isOpen={isEditDialogOpen} setIsOpen={setIsEditDialogOpen} />
    </>
  )
}

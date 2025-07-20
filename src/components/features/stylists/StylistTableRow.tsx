// src/components/features/stylists/StylistTableRow.tsx
'use client'

import { Mail, MoreHorizontal, Pencil, Phone } from 'lucide-react'
import { useState } from 'react'

import { StylistServicesLink } from '@/components/features/stylist-services/StylistServicesLink'
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

type StylistTableRowProps = {
  stylist: Stylist
}

export function StylistTableRow({ stylist }: StylistTableRowProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  return (
    <>
      <TableRow className="group hover:bg-muted/50 transition-colors">
        <TableCell className="hidden sm:table-cell">
          <Avatar className="h-10 w-10">
            <AvatarImage src={stylist.profilePicture ?? undefined} alt={stylist.fullName} />
            <AvatarFallback className="text-sm font-semibold">
              {stylist.fullName?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </TableCell>
        <TableCell>
          <div>
            <div className="font-medium">{stylist.fullName}</div>
            {stylist.description && (
              <div className="text-sm text-muted-foreground truncate max-w-[200px]">{stylist.description}</div>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${stylist.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
            <Badge variant={stylist.isActive ? 'outline' : 'destructive'} className="text-xs">
              {stylist.isActive ? 'Activ' : 'Inactiv'}
            </Badge>
          </div>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{stylist.email}</span>
            </div>
            {stylist.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{stylist.phone}</span>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-haspopup="true"
                size="icon"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Opțiuni stilist</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)} className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                <span>Editează</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="flex items-center gap-2">
                <StylistServicesLink stylistId={stylist.id} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="flex items-center gap-2 text-destructive">
                <DeleteStylistMenuItem stylistId={stylist.id} stylistName={stylist.fullName} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Dialogul de editare este randat aici, dar este invizibil inițial */}
      <EditStylistDialog stylist={stylist} isOpen={isEditDialogOpen} setIsOpen={setIsEditDialogOpen} />
    </>
  )
}

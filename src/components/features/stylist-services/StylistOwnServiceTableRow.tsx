// src/components/features/stylist-services/StylistOwnServiceTableRow.tsx
'use client'

import { MoreHorizontal, Pencil } from 'lucide-react'
import { useState } from 'react'

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
import type { StylistServiceLinkWithService } from '@/core/domains/stylist-services/stylist-service.types'
import { DEFAULT_CURRENCY } from '@/lib/constants'

import { DeleteStylistOwnServiceMenuItem } from './DeleteStylistOwnServiceMenuItem'
import { EditStylistOwnServiceDialog } from './EditStylistOwnServiceDialog'

type StylistOwnServiceTableRowProps = {
  link: StylistServiceLinkWithService
  stylistId: string
}

export function StylistOwnServiceTableRow({ link, stylistId }: StylistOwnServiceTableRowProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const service = link.service

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{service.name}</TableCell>
        <TableCell>{service.category}</TableCell>
        <TableCell>
          <Badge variant="outline">
            {service.price} {DEFAULT_CURRENCY}
          </Badge>
        </TableCell>
        <TableCell>{service.duration} min</TableCell>
        <TableCell>{link.customPrice || '-'}</TableCell>
        <TableCell>{link.customDuration || '-'}</TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="bg-muted/60 rounded px-2 py-1 text-xs text-muted-foreground font-semibold">
                Acțiuni
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)} className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-muted-foreground" />
                <span>Editează</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="flex items-center gap-2 text-destructive">
                <DeleteStylistOwnServiceMenuItem
                  stylistId={stylistId}
                  serviceId={service.id}
                  serviceName={service.name}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      <EditStylistOwnServiceDialog
        link={link}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        stylistId={stylistId}
      />
    </>
  )
}

// src/components/features/stylist-services/StylistServiceTableRow.tsx
'use client'

import { MoreHorizontal } from 'lucide-react'
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

import { DeleteStylistServiceMenuItem } from './DeleteStylistServiceMenuItem'
import { EditStylistServiceDialog } from './EditStylistServiceDialog'

interface StylistServiceTableRowProps {
  link: StylistServiceLinkWithService
  stylistId: string
}

export function StylistServiceTableRow({ link, stylistId }: StylistServiceTableRowProps) {
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
              <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>Editează</DropdownMenuItem>
              <DeleteStylistServiceMenuItem stylistId={stylistId} serviceId={service.id} serviceName={service.name} />
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      <EditStylistServiceDialog
        link={link}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        stylistId={stylistId}
      />
    </>
  )
}

// src/components/features/services/ServiceTableRow.tsx
'use client'

import { Clock, MoreHorizontal, Pencil } from 'lucide-react'
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
import {
  SERVICE_CATEGORY_COLORS,
  SERVICE_CATEGORY_ICONS,
  SERVICE_FORMATS,
} from '@/core/domains/services/service.constants'
import type { Service } from '@/core/domains/services/service.types'

import { DeleteServiceMenuItem } from './DeleteServiceMenuItem'
import { EditServiceDialog } from './EditServiceDialog'

type ServiceTableRowProps = {
  service: Service
}

export function ServiceTableRow({ service }: ServiceTableRowProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const categoryColors = SERVICE_CATEGORY_COLORS[service.category ?? 'other']
  const categoryIcon = SERVICE_CATEGORY_ICONS[service.category ?? 'other']

  return (
    <>
      <TableRow className="group hover:bg-muted/50 transition-colors">
        <TableCell>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${categoryColors.bg} ${categoryColors.border} border`}
            >
              <span className="text-sm">{getCategoryIcon(categoryIcon)}</span>
            </div>
            <div>
              <div className="font-medium">{service.name}</div>
              {service.description && (
                <div className="text-sm text-muted-foreground truncate max-w-[200px]">{service.description}</div>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="secondary" className={`${categoryColors.bg} ${categoryColors.text} border-0`}>
            {service.category}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="font-semibold text-primary">
            {service.price} {SERVICE_FORMATS.CURRENCY}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {service.duration} {SERVICE_FORMATS.TIME_UNIT}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm text-muted-foreground">{service.isActive ? 'Activ' : 'Inactiv'}</span>
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
                <span className="sr-only">Opțiuni serviciu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)} className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                <span>Editează</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="flex items-center gap-2 text-destructive">
                <DeleteServiceMenuItem serviceId={service.id} serviceName={service.name} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <EditServiceDialog service={service} isOpen={isEditDialogOpen} setIsOpen={setIsEditDialogOpen} />
    </>
  )
}

function getCategoryIcon(iconName: string) {
  const iconMap: Record<string, string> = {
    scissors: '✂️',
    palette: '🎨',
    sparkles: '✨',
    heart: '💚',
    'plus-circle': '➕',
  }
  return iconMap[iconName] || '📋'
}

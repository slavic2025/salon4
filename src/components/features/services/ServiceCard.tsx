'use client'

import { Clock, Edit, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SERVICE_CATEGORY_COLORS,
  SERVICE_CATEGORY_ICONS,
  SERVICE_FORMATS,
} from '@/core/domains/services/service.constants'
import type { Service } from '@/core/domains/services/service.types'

import { DeleteServiceMenuItem } from './DeleteServiceMenuItem'
import { EditServiceDialog } from './EditServiceDialog'

type ServiceCardProps = {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const categoryColors = SERVICE_CATEGORY_COLORS[service.category ?? 'other']
  const categoryIcon = SERVICE_CATEGORY_ICONS[service.category ?? 'other']

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${categoryColors.bg} ${categoryColors.border} border`}
              >
                <span className="text-lg">{getCategoryIcon(categoryIcon)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{service.name}</h3>
                <Badge variant="secondary" className={`${categoryColors.bg} ${categoryColors.text} border-0`}>
                  {service.category}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Opțiuni serviciu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editează
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-destructive">
                  <DeleteServiceMenuItem serviceId={service.id} serviceName={service.name} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {service.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{service.description}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {service.duration} {SERVICE_FORMATS.TIME_UNIT}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {service.price} {SERVICE_FORMATS.CURRENCY}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-xs text-muted-foreground">{service.isActive ? 'Activ' : 'Inactiv'}</span>
            </div>
          </div>
        </CardFooter>
      </Card>

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

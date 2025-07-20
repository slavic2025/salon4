'use client'

import { Clock, Edit, MoreHorizontal, Scissors } from 'lucide-react'
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
import type { StylistServiceLinkWithService } from '@/core/domains/stylist-services/stylist-service.types'
import { DEFAULT_CURRENCY } from '@/lib/constants'

import { DeleteStylistServiceMenuItem } from './DeleteStylistServiceMenuItem'
import { EditStylistServiceDialog } from './EditStylistServiceDialog'

type StylistServiceCardProps = {
  link: StylistServiceLinkWithService
  stylistId: string
}

export function StylistServiceCard({ link, stylistId }: StylistServiceCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const service = link.service

  const hasCustomPrice = link.customPrice !== null && link.customPrice !== undefined
  const hasCustomDuration = link.customDuration !== null && link.customDuration !== undefined

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Scissors className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{service.name}</h3>
                <Badge variant="secondary" className="mt-1">
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
                  <DeleteStylistServiceMenuItem
                    stylistId={stylistId}
                    serviceId={service.id}
                    serviceName={service.name}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {service.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{service.description}</p>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{hasCustomDuration ? link.customDuration : service.duration} min</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {hasCustomPrice ? link.customPrice : service.price} {DEFAULT_CURRENCY}
                </div>
              </div>
            </div>

            {(hasCustomPrice || hasCustomDuration) && (
              <div className="text-xs text-muted-foreground p-2 bg-muted rounded-md">
                <div className="font-medium mb-1">Prețuri personalizate:</div>
                {hasCustomPrice && (
                  <div>
                    Preț personalizat: {link.customPrice} {DEFAULT_CURRENCY}
                  </div>
                )}
                {hasCustomDuration && <div>Durată personalizată: {link.customDuration} min</div>}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Serviciu activ</span>
            </div>
            {(hasCustomPrice || hasCustomDuration) && (
              <Badge variant="outline" className="text-xs">
                Personalizat
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>

      <EditStylistServiceDialog
        link={link}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        stylistId={stylistId}
      />
    </>
  )
}

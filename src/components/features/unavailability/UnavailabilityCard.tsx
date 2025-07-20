'use client'

import { Calendar, Clock, Edit, MoreHorizontal } from 'lucide-react'
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
  UNAVAILABILITY_CAUSE_LABELS,
  UNAVAILABILITY_COLORS,
  UNAVAILABILITY_ICONS,
} from '@/core/domains/unavailability/unavailability.constants'
import type { Unavailability } from '@/core/domains/unavailability/unavailability.types'

import { EditUnavailabilityDialog } from './EditUnavailabilityDialog'

type UnavailabilityCardProps = {
  unavailability: Unavailability
  stylistId: string
}

export function UnavailabilityCard({ unavailability, stylistId }: UnavailabilityCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const causeColors = UNAVAILABILITY_COLORS[unavailability.cause]
  const causeIcon = UNAVAILABILITY_ICONS[unavailability.cause]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTime = (time: string | null) => {
    if (!time) return null
    return time.substring(0, 5) // Extract HH:MM from HH:MM:SS
  }

  const getDayName = (dateString: string) => {
    const dayNames = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă']
    const dayOfWeek = new Date(dateString).getDay()
    return dayNames[dayOfWeek]
  }

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${causeColors.bg} ${causeColors.border} border`}
              >
                <span className="text-lg">{getCauseIcon(causeIcon)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{UNAVAILABILITY_CAUSE_LABELS[unavailability.cause]}</h3>
                <Badge variant="secondary" className={`${causeColors.bg} ${causeColors.text} border-0`}>
                  {getDayName(unavailability.date)}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Opțiuni indisponibilitate</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editează
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(unavailability.date)}</span>
            </div>
          </div>

          {unavailability.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{unavailability.description}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {unavailability.allDay ? (
                    'Toată ziua'
                  ) : (
                    <>
                      {formatTime(unavailability.startTime)} - {formatTime(unavailability.endTime)}
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${unavailability.allDay ? 'bg-red-500' : 'bg-orange-500'}`} />
              <span className="text-xs text-muted-foreground">
                {unavailability.allDay ? 'Indisponibil toată ziua' : 'Interval specific'}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>

      <EditUnavailabilityDialog
        unavailability={unavailability}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        stylistId={stylistId}
      />
    </>
  )
}

function getCauseIcon(iconName: string) {
  const iconMap: Record<string, string> = {
    'pause-circle': '⏸️',
    'map-pin-off': '📍',
    'alert-circle': '⚠️',
  }
  return iconMap[iconName] || '📅'
}

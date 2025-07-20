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
import { DAY_NAMES, WORK_SCHEDULE_MESSAGES } from '@/core/domains/work-schedule/workSchedule.constants'
import type { WorkSchedule } from '@/core/domains/work-schedule/workSchedule.types'

import { DeleteWorkScheduleMenuItem } from './DeleteWorkScheduleMenuItem'
import { EditWorkScheduleDialog } from './EditWorkScheduleDialog'

type WorkScheduleCardProps = {
  interval: WorkSchedule
  stylistId: string
}

export function WorkScheduleCard({ interval, stylistId }: WorkScheduleCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const dayName = DAY_NAMES[interval.dayOfWeek as keyof typeof DAY_NAMES]
  const dayColors = getDayColors(interval.dayOfWeek)
  const dayIcon = getDayIcon(interval.dayOfWeek)

  // Calculăm durata intervalului
  const duration = calculateDuration(interval.startTime, interval.endTime)

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${dayColors.bg} ${dayColors.border} border`}
              >
                <span className="text-lg">{dayIcon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{dayName}</h3>
                <Badge variant="secondary" className={`${dayColors.bg} ${dayColors.text} border-0`}>
                  {interval.startTime} - {interval.endTime}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Opțiuni interval</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {WORK_SCHEDULE_MESSAGES.UI.EDIT_BUTTON}
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-destructive">
                  <DeleteWorkScheduleMenuItem
                    scheduleId={interval.id}
                    timeInterval={`${interval.startTime} - ${interval.endTime}`}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Interval de lucru</div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Activ</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {interval.startTime} → {interval.endTime}
            </div>
          </div>
        </CardFooter>
      </Card>

      <EditWorkScheduleDialog
        interval={interval}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        stylistId={stylistId}
      />
    </>
  )
}

function getDayColors(dayOfWeek: number) {
  const colorMap: Record<number, { bg: string; border: string; text: string }> = {
    0: { bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-800' }, // Luni
    1: { bg: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-800' }, // Marți
    2: { bg: 'bg-green-100', border: 'border-green-200', text: 'text-green-800' }, // Miercuri
    3: { bg: 'bg-orange-100', border: 'border-orange-200', text: 'text-orange-800' }, // Joi
    4: { bg: 'bg-pink-100', border: 'border-pink-200', text: 'text-pink-800' }, // Vineri
    5: { bg: 'bg-yellow-100', border: 'border-yellow-200', text: 'text-yellow-800' }, // Sâmbătă
    6: { bg: 'bg-red-100', border: 'border-red-200', text: 'text-red-800' }, // Duminică
  }
  return colorMap[dayOfWeek] || { bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-800' }
}

function getDayIcon(dayOfWeek: number) {
  const iconMap: Record<number, string> = {
    0: '📅', // Luni
    1: '📅', // Marți
    2: '📅', // Miercuri
    3: '📅', // Joi
    4: '📅', // Vineri
    5: '📅', // Sâmbătă
    6: '📅', // Duminică
  }
  return iconMap[dayOfWeek] || '📅'
}

function calculateDuration(startTime: string, endTime: string): string {
  const [startHours, startMinutes] = startTime.split(':').map(Number)
  const [endHours, endMinutes] = endTime.split(':').map(Number)

  const startTotalMinutes = startHours * 60 + startMinutes
  const endTotalMinutes = endHours * 60 + endMinutes

  const durationMinutes = endTotalMinutes - startTotalMinutes
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60

  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim()
  }
  return `${minutes}m`
}

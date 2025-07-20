// src/components/features/work-schedule/WorkScheduleIntervalRow.tsx
'use client'

import { Clock, MoreHorizontal, Pencil } from 'lucide-react'
import { useState } from 'react'

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
import { DAY_NAMES, WORK_SCHEDULE_MESSAGES } from '@/core/domains/work-schedule/workSchedule.constants'
import type { WorkSchedule } from '@/core/domains/work-schedule/workSchedule.types'

import { DeleteWorkScheduleMenuItem } from './DeleteWorkScheduleMenuItem'
import { EditWorkScheduleDialog } from './EditWorkScheduleDialog'

type WorkScheduleIntervalRowProps = {
  interval: WorkSchedule
  stylistId: string
}

export function WorkScheduleIntervalRow({ interval, stylistId }: WorkScheduleIntervalRowProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const dayName = DAY_NAMES[interval.dayOfWeek as keyof typeof DAY_NAMES]
  const duration = calculateDuration(interval.startTime, interval.endTime)

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{dayName}</TableCell>
        <TableCell>{interval.startTime}</TableCell>
        <TableCell>{interval.endTime}</TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{duration}</span>
          </div>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="sm" variant="ghost">
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
                <span>{WORK_SCHEDULE_MESSAGES.UI.EDIT_BUTTON}</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="flex items-center gap-2 text-destructive">
                <DeleteWorkScheduleMenuItem
                  scheduleId={interval.id}
                  timeInterval={`${interval.startTime} - ${interval.endTime}`}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <EditWorkScheduleDialog
        interval={interval}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        stylistId={stylistId}
      />
    </>
  )
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

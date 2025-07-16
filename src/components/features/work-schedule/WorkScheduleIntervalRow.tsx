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
import { WORK_SCHEDULE_MESSAGES } from '@/core/domains/work-schedule/workSchedule.constants'
import type { WorkSchedule } from '@/core/domains/work-schedule/workSchedule.types'

import { DeleteWorkScheduleMenuItem } from './DeleteWorkScheduleMenuItem'
import { EditWorkScheduleDialog } from './EditWorkScheduleDialog'

type WorkScheduleIntervalRowProps = {
  interval: WorkSchedule
  stylistId: string
}

export function WorkScheduleIntervalRow({ interval, stylistId }: WorkScheduleIntervalRowProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{interval.startTime}</span>
            <span className="text-muted-foreground">-</span>
            <span className="font-medium text-sm">{interval.endTime}</span>
          </div>
        </div>

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
      </div>

      <EditWorkScheduleDialog
        interval={interval}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        stylistId={stylistId}
      />
    </>
  )
}

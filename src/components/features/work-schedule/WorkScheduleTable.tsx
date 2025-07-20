'use client'

import { EmptyState } from '@/components/shared/EmptyState'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { WORK_SCHEDULE_MESSAGES } from '@/core/domains/work-schedule/workSchedule.constants'
import type { WorkSchedule } from '@/core/domains/work-schedule/workSchedule.types'

import { AddWorkScheduleDialog } from './AddWorkScheduleDialog'
import { WorkScheduleIntervalRow } from './WorkScheduleIntervalRow'

type WorkScheduleTableProps = {
  intervals: WorkSchedule[]
  stylistId: string
  className?: string
}

export function WorkScheduleTable({ intervals, stylistId, className }: WorkScheduleTableProps) {
  if (intervals.length === 0) {
    return (
      <EmptyState
        title={WORK_SCHEDULE_MESSAGES.UI.NO_SCHEDULE_TITLE}
        description={WORK_SCHEDULE_MESSAGES.UI.NO_SCHEDULE_DESC}
        actions={<AddWorkScheduleDialog stylistId={stylistId} />}
        className={className}
      />
    )
  }

  return (
    <div className={`rounded-md border ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ziua</TableHead>
            <TableHead>Ora de început</TableHead>
            <TableHead>Ora de sfârșit</TableHead>
            <TableHead>Durată</TableHead>
            <TableHead className="w-[100px]">Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {intervals.map((interval) => (
            <WorkScheduleIntervalRow key={interval.id} interval={interval} stylistId={stylistId} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

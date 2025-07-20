'use client'

import { EmptyState } from '@/components/shared/EmptyState'
import { WORK_SCHEDULE_MESSAGES } from '@/core/domains/work-schedule/workSchedule.constants'
import type { WorkSchedule } from '@/core/domains/work-schedule/workSchedule.types'

import { AddWorkScheduleDialog } from './AddWorkScheduleDialog'
import { WorkScheduleCard } from './WorkScheduleCard'

type WorkScheduleGridViewProps = {
  intervals: WorkSchedule[]
  stylistId: string
  className?: string
}

export function WorkScheduleGridView({ intervals, stylistId, className }: WorkScheduleGridViewProps) {
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
    <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {intervals.map((interval) => (
        <WorkScheduleCard key={interval.id} interval={interval} stylistId={stylistId} />
      ))}
    </div>
  )
}

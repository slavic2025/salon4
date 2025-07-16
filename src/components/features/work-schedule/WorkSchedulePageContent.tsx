// src/components/features/work-schedule/WorkSchedulePageContent.tsx
'use client'

import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WORK_SCHEDULE_MESSAGES } from '@/core/domains/work-schedule/workSchedule.constants'
import type { StylistWeeklySchedule } from '@/core/domains/work-schedule/workSchedule.types'

import { AddWorkScheduleDialog } from './AddWorkScheduleDialog'
import { WorkScheduleWeeklyView } from './WorkScheduleWeeklyView'

type WorkSchedulePageContentProps = {
  stylistSchedule: StylistWeeklySchedule
}

export function WorkSchedulePageContent({ stylistSchedule }: WorkSchedulePageContentProps) {
  // Calculăm numărul total de intervale din toate zilele
  const totalIntervals = Object.values(stylistSchedule.schedule).reduce(
    (total, daySchedules) => total + (daySchedules?.length || 0),
    0,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{WORK_SCHEDULE_MESSAGES.UI.PAGE_TITLE}</h1>
          <p className="text-muted-foreground">{WORK_SCHEDULE_MESSAGES.UI.PAGE_DESCRIPTION}</p>
        </div>
        <AddWorkScheduleDialog stylistId={stylistSchedule.stylistId} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{WORK_SCHEDULE_MESSAGES.UI.SCHEDULE_OVERVIEW_TITLE}</CardTitle>
          <CardDescription>
            {totalIntervals > 0
              ? WORK_SCHEDULE_MESSAGES.UI.INTERVALS_COUNT(totalIntervals)
              : WORK_SCHEDULE_MESSAGES.UI.NO_INTERVALS_SET}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalIntervals > 0 ? (
            <WorkScheduleWeeklyView schedule={stylistSchedule.schedule} stylistId={stylistSchedule.stylistId} />
          ) : (
            <EmptyState
              title={WORK_SCHEDULE_MESSAGES.UI.NO_SCHEDULE_TITLE}
              description={WORK_SCHEDULE_MESSAGES.UI.NO_SCHEDULE_DESC}
              actions={<AddWorkScheduleDialog stylistId={stylistSchedule.stylistId} />}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

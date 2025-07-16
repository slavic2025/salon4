// src/components/features/work-schedule/WorkScheduleWeeklyView.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DAY_NAMES, DAYS_OF_WEEK } from '@/core/domains/work-schedule/workSchedule.constants'
import type { WorkSchedulesByDay } from '@/core/domains/work-schedule/workSchedule.types'

import { WorkScheduleIntervalRow } from './WorkScheduleIntervalRow'

type WorkScheduleWeeklyViewProps = {
  schedule: WorkSchedulesByDay
  stylistId: string
}

export function WorkScheduleWeeklyView({ schedule, stylistId }: WorkScheduleWeeklyViewProps) {
  // Ordonez zilele de la Luni (0) la Duminică (6)
  const orderedDays = [
    DAYS_OF_WEEK.MONDAY,
    DAYS_OF_WEEK.TUESDAY,
    DAYS_OF_WEEK.WEDNESDAY,
    DAYS_OF_WEEK.THURSDAY,
    DAYS_OF_WEEK.FRIDAY,
    DAYS_OF_WEEK.SATURDAY,
    DAYS_OF_WEEK.SUNDAY,
  ] as const

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {orderedDays.map((dayOfWeek) => {
        const daySchedules = schedule[dayOfWeek] || []
        const dayName = DAY_NAMES[dayOfWeek]

        return (
          <Card key={dayOfWeek} className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{dayName}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {daySchedules.length} {daySchedules.length === 1 ? 'interval' : 'intervale'}
                </Badge>
              </div>
              <CardDescription>
                {daySchedules.length > 0
                  ? 'Intervalele de lucru configurate pentru această zi'
                  : 'Niciun interval configurat'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {daySchedules.length > 0 ? (
                <div className="space-y-2">
                  {daySchedules.map((interval) => (
                    <WorkScheduleIntervalRow key={interval.id} interval={interval} stylistId={stylistId} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p className="text-sm">Niciun interval configurat</p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// src/components/features/work-schedule/WorkScheduleForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { SubmitButton } from '@/components/shared/SubmitButton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DAY_NAMES, WORK_SCHEDULE_MESSAGES } from '@/core/domains/work-schedule/workSchedule.constants'
import {
  type CreateWorkScheduleFormData,
  CreateWorkScheduleFormValidator,
} from '@/core/domains/work-schedule/workSchedule.validators'

type WorkScheduleFormProps = {
  onSubmit: (values: CreateWorkScheduleFormData) => void
  isPending: boolean
  submitButtonText?: string
  defaultValues?: Partial<CreateWorkScheduleFormData>
}

export function WorkScheduleForm({
  onSubmit,
  isPending,
  submitButtonText = WORK_SCHEDULE_MESSAGES.UI.SAVE_BUTTON,
  defaultValues,
}: WorkScheduleFormProps) {
  const form = useForm<CreateWorkScheduleFormData>({
    resolver: zodResolver(CreateWorkScheduleFormValidator),
    defaultValues: defaultValues || {
      dayOfWeek: 0,
      startTime: '',
      endTime: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="dayOfWeek"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{WORK_SCHEDULE_MESSAGES.UI.DAY_LABEL}</FormLabel>
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(parseInt(value))}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Alege ziua săptămânii" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(DAY_NAMES).map(([dayNumber, dayName]) => (
                    <SelectItem key={dayNumber} value={dayNumber}>
                      {dayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{WORK_SCHEDULE_MESSAGES.UI.START_TIME_LABEL}</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  placeholder={WORK_SCHEDULE_MESSAGES.UI.TIME_PLACEHOLDER}
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{WORK_SCHEDULE_MESSAGES.UI.END_TIME_LABEL}</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  placeholder={WORK_SCHEDULE_MESSAGES.UI.TIME_PLACEHOLDER}
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton isPending={isPending} className="w-full">
          {submitButtonText}
        </SubmitButton>
      </form>
    </Form>
  )
}

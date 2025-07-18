// src/components/features/unavailability/BulkUnavailabilityForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { SubmitButton } from '@/components/shared/SubmitButton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  UNAVAILABILITY_CAUSE_LABELS,
  UNAVAILABILITY_CAUSES,
} from '@/core/domains/unavailability/unavailability.constants'
import { useActionForm } from '@/hooks/useActionForm'

import { generateBulkUnavailabilities } from './utils/bulk-utils'

// Schema pentru bulk unavailability form
const BulkUnavailabilityFormSchema = z
  .object({
    stylistId: z.string(),
    startDate: z.string().min(1, 'Data de început este obligatorie'),
    endDate: z.string().min(1, 'Data de sfârșit este obligatorie'),
    includeWeekends: z.boolean(),
    cause: z.enum(['pauza', 'programare_offline', 'alta_situatie'], {
      required_error: 'Cauza este obligatorie',
    }),
    allDay: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    description: z.string().optional(),
  })
  .transform((data) => ({
    ...data,
    startTime: data.startTime && data.startTime.trim() !== '' ? data.startTime.trim() : null,
    endTime: data.endTime && data.endTime.trim() !== '' ? data.endTime.trim() : null,
    description: data.description && data.description.trim() !== '' ? data.description.trim() : null,
  }))
  .refine(
    (data) => {
      return data.endDate >= data.startDate
    },
    {
      message: 'Data de sfârșit trebuie să fie după sau egală cu data de început',
      path: ['endDate'],
    },
  )
  .refine(
    (data) => {
      if (!data.allDay && (!data.startTime || !data.endTime)) {
        return false
      }
      return true
    },
    {
      message: 'Ora de început și sfârșitul sunt obligatorii când nu este toată ziua',
      path: ['startTime'],
    },
  )
  .refine(
    (data) => {
      if (!data.allDay && data.startTime && data.endTime) {
        return data.endTime > data.startTime
      }
      return true
    },
    {
      message: 'Ora de sfârșit trebuie să fie după ora de început',
      path: ['endTime'],
    },
  )

type BulkUnavailabilityFormData = z.infer<typeof BulkUnavailabilityFormSchema>

type BulkUnavailabilityFormProps = {
  stylistId: string
  onSuccess: () => void
}

export function BulkUnavailabilityForm({ stylistId, onSuccess }: BulkUnavailabilityFormProps) {
  const [affectedDates, setAffectedDates] = useState<string[]>([])

  const form = useForm<BulkUnavailabilityFormData>({
    resolver: zodResolver(BulkUnavailabilityFormSchema) as any,
    defaultValues: {
      stylistId,
      startDate: '',
      endDate: '',
      includeWeekends: false,
      cause: 'pauza',
      allDay: false,
      startTime: '',
      endTime: '',
      description: '',
    },
  })

  const watchStartDate = form.watch('startDate')
  const watchEndDate = form.watch('endDate')
  const watchIncludeWeekends = form.watch('includeWeekends')
  const watchAllDay = form.watch('allDay')

  // Calculăm preview-ul datelor afectate
  useEffect(() => {
    if (watchStartDate && watchEndDate) {
      const dates = generateBulkUnavailabilities({
        startDate: watchStartDate,
        endDate: watchEndDate,
        includeWeekends: watchIncludeWeekends,
      })
      setAffectedDates(dates)
    } else {
      setAffectedDates([])
    }
  }, [watchStartDate, watchEndDate, watchIncludeWeekends])

  const { formSubmit, isPending } = useActionForm({
    action: (async (values: BulkUnavailabilityFormData) => {
      // Generăm array-ul de date pentru bulk creation
      const { createBulkUnavailabilityStylistAction } = await import('@/features/unavailability/actions')

      return createBulkUnavailabilityStylistAction({
        stylistId: values.stylistId,
        dates: affectedDates,
        startTime: values.allDay ? null : values.startTime,
        endTime: values.allDay ? null : values.endTime,
        cause: values.cause,
        allDay: values.allDay,
        description: values.description || null,
      })
    }) as any,
    onSuccess,
    toastMessages: {
      loading: 'Se creează indisponibilitățile...',
      success: 'Indisponibilitățile au fost create cu succes',
    },
  })

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de început</FormLabel>
                <FormControl>
                  <Input type="date" min={getTodayDate()} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de sfârșit</FormLabel>
                <FormControl>
                  <Input type="date" min={watchStartDate || getTodayDate()} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="includeWeekends"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Include weekends</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Incluде sâmbăta și duminica în perioada de indisponibilitate
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allDay"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Toată ziua</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Aplicați indisponibilitatea pentru întreaga zi în toate zilele
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {!watchAllDay && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ora de început</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} value={field.value || ''} />
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
                  <FormLabel>Ora de sfârșit</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="cause"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cauza indisponibilității</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Alege cauza" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(UNAVAILABILITY_CAUSES).map(([, value]) => (
                    <SelectItem key={value} value={value}>
                      {UNAVAILABILITY_CAUSE_LABELS[value as keyof typeof UNAVAILABILITY_CAUSE_LABELS]}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descriere (opțională)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalii suplimentare despre indisponibilitate..."
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Preview Section */}
        {affectedDates.length > 0 && (
          <div className="rounded-lg border p-4 bg-muted/30">
            <h4 className="font-semibold text-sm mb-2">Preview</h4>
            <p className="text-sm text-muted-foreground">
              Se vor crea <strong>{affectedDates.length} intrări</strong> pentru perioada selectată
              {!watchIncludeWeekends && ' (fără weekends)'}
            </p>
            {affectedDates.length <= 7 && (
              <div className="mt-2 text-xs text-muted-foreground">Zile: {affectedDates.join(', ')}</div>
            )}
          </div>
        )}

        <SubmitButton isPending={isPending} className="w-full" disabled={affectedDates.length === 0}>
          Creează {affectedDates.length > 0 && `(${affectedDates.length} zile)`}
        </SubmitButton>
      </form>
    </Form>
  )
}

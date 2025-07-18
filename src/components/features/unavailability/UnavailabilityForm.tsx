// src/components/features/unavailability/UnavailabilityForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
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

// Schema locală pentru formularul de indisponibilitate
const UnavailabilityFormSchema = z
  .object({
    stylistId: z.string(),
    date: z.string().min(1, 'Data este obligatorie'),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    cause: z.enum(['pauza', 'programare_offline', 'alta_situatie'], {
      required_error: 'Cauza este obligatorie',
    }),
    allDay: z.boolean(),
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

type UnavailabilityFormData = z.infer<typeof UnavailabilityFormSchema>

type UnavailabilityFormProps = {
  defaultValues?: Partial<UnavailabilityFormData>
  onSubmit: (values: UnavailabilityFormData) => void
  isPending: boolean
  submitButtonText?: string
  stylistId: string
}

export function UnavailabilityForm({
  defaultValues,
  onSubmit,
  isPending,
  submitButtonText = 'Salvează',
  stylistId,
}: UnavailabilityFormProps) {
  const form = useForm<UnavailabilityFormData>({
    resolver: zodResolver(UnavailabilityFormSchema) as any,
    defaultValues: {
      stylistId,
      date: defaultValues?.date ?? '',
      startTime: defaultValues?.startTime ?? '',
      endTime: defaultValues?.endTime ?? '',
      cause: defaultValues?.cause ?? 'pauza',
      allDay: defaultValues?.allDay ?? false,
      description: defaultValues?.description ?? '',
    },
  })

  const watchAllDay = form.watch('allDay')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
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
                <p className="text-sm text-muted-foreground">Marchează această zi ca fiind complet indisponibilă</p>
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

        <SubmitButton isPending={isPending} className="w-full">
          {submitButtonText}
        </SubmitButton>
      </form>
    </Form>
  )
}

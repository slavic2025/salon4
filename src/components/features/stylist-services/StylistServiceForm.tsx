// src/components/features/stylist-services/StylistServiceForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { SubmitButton } from '@/components/shared/SubmitButton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  stylistServiceFormSchema,
  StylistServiceFormValues,
} from '@/core/domains/stylist-services/stylist-service.types'
import { getAllServicesAction } from '@/features/stylist-services/actions'

export function StylistServiceForm({
  onSubmit,
  isPending,
  submitButtonText = 'Salvează',
  defaultValues,
}: {
  onSubmit: (values: StylistServiceFormValues) => void
  isPending: boolean
  submitButtonText?: string
  defaultValues?: Partial<StylistServiceFormValues>
}) {
  const form = useForm<StylistServiceFormValues>({
    resolver: zodResolver(stylistServiceFormSchema),
    defaultValues: defaultValues || {},
  })
  const [services, setServices] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    void getAllServicesAction().then((all) => setServices(all.map((s: any) => ({ id: s.id, name: s.name }))))
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serviciu</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Alege serviciul" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
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
          name="customPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preț personalizat</FormLabel>
              <FormControl>
                <Input type="number" min={0} step={1} placeholder="Lasă necompletat pentru preț standard" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durată personalizată (minute)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  placeholder="Lasă necompletat pentru durata standard"
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

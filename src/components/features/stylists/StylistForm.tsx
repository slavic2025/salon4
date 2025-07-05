// src/components/features/stylists/StylistForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { SubmitButton } from '@/components/shared/SubmitButton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { stylistFormSchema, type StylistFormValues } from '@/core/domains/stylists/stylist.types'

type StylistFormProps = {
  // Primește valori default pentru a pre-completa formularul la editare
  defaultValues?: Partial<StylistFormValues>
  // Primește funcția de submit de la componenta părinte (dialog)
  onSubmit: (values: StylistFormValues) => void
  isPending: boolean
  submitButtonText?: string
}

export function StylistForm({ defaultValues, onSubmit, isPending, submitButtonText = 'Salvează' }: StylistFormProps) {
  const form = useForm<StylistFormValues>({
    resolver: zodResolver(stylistFormSchema),
    defaultValues: defaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nume Complet</FormLabel>
              <FormControl>
                <Input placeholder="ex: Ana Popescu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="nume@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon (Opțional)</FormLabel>
              <FormControl>
                <Input placeholder="ex: 0712345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descriere (Opțional)</FormLabel>
              <FormControl>
                <Textarea placeholder="O scurtă descriere a experienței stilistului..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Status Activ</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Stiliștii inactivi nu pot fi selectați pentru programări noi.
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
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

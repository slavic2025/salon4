// src/components/features/services/ServiceForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { SubmitButton } from '@/components/shared/SubmitButton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { CreateServiceFormValidator, SERVICE_CATEGORIES, type ServiceFormValues } from '@/core/domains/services'
import { DEFAULT_CURRENCY } from '@/lib/constants'

type ServiceFormProps = {
  defaultValues?: Partial<ServiceFormValues>
  onSubmit: (values: ServiceFormValues) => void
  isPending: boolean
  submitButtonText?: string
}

export function ServiceForm({ defaultValues, onSubmit, isPending, submitButtonText = 'Salvează' }: ServiceFormProps) {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(CreateServiceFormValidator),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      price: defaultValues?.price ?? 0,
      duration: defaultValues?.duration ?? 30,
      category: defaultValues?.category ?? SERVICE_CATEGORIES[0],
      isActive: defaultValues?.isActive ?? true,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nume serviciu</FormLabel>
              <FormControl>
                <Input placeholder="ex: Tuns clasic" {...field} />
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
              <FormLabel>Descriere</FormLabel>
              <FormControl>
                <Textarea placeholder="Descriere scurtă a serviciului..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Preț ({DEFAULT_CURRENCY})</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Durată (minute)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} step={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categorie</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Alege categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
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
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Status activ</FormLabel>
                <p className="text-sm text-muted-foreground">Serviciile inactive nu pot fi rezervate de clienți.</p>
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

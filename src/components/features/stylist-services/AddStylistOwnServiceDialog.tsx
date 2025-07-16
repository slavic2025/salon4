// src/components/features/stylist-services/AddStylistOwnServiceDialog.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Service } from '@/core/domains/services/service.types'
import { STYLIST_SERVICE_LINK_MESSAGES } from '@/core/domains/stylist-services/stylist-service.constants'
import {
  stylistServiceFormSchema,
  type StylistServiceFormValues,
} from '@/core/domains/stylist-services/stylist-service.types'
import { createStylistOwnServiceAction, getAllServicesAction } from '@/features/stylist-services/actions'
import { useActionForm } from '@/hooks/useActionForm'

type AddStylistOwnServiceDialogProps = {
  stylistId: string
}

export function AddStylistOwnServiceDialog({ stylistId }: AddStylistOwnServiceDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const form = useForm<StylistServiceFormValues>({
    resolver: zodResolver(stylistServiceFormSchema),
    defaultValues: {
      serviceId: '',
      customPrice: '',
      customDuration: '',
    },
  })

  const { formSubmit, isPending } = useActionForm({
    action: async (values: StylistServiceFormValues) => {
      return createStylistOwnServiceAction({
        stylistId,
        serviceId: values.serviceId,
        customPrice: values.customPrice || null,
        customDuration: values.customDuration ? parseInt(values.customDuration) : null,
      })
    },
    onSuccess: () => {
      toast.success(STYLIST_SERVICE_LINK_MESSAGES.SUCCESS.ASSOCIATED)
      setIsOpen(false)
      form.reset()
      setSelectedService(null)
    },
    onError: ({ validationErrors }) => {
      if (validationErrors) {
        Object.entries(validationErrors).forEach(([field, messages]) => {
          form.setError(field as keyof StylistServiceFormValues, {
            type: 'server',
            message: messages?.[0],
          })
        })
      }
    },
    toastMessages: {
      loading: STYLIST_SERVICE_LINK_MESSAGES.UI.LOADING_UPDATE,
      error: STYLIST_SERVICE_LINK_MESSAGES.ERROR.CREATE_FAILED,
    },
  })

  useEffect(() => {
    if (isOpen) {
      void loadServices()
    }
  }, [isOpen])

  const loadServices = async () => {
    try {
      const servicesData = await getAllServicesAction()
      setServices(servicesData || [])
    } catch (error) {
      console.error(STYLIST_SERVICE_LINK_MESSAGES.ERROR.SERVICES_LOAD_ERROR, error)
      toast.error(STYLIST_SERVICE_LINK_MESSAGES.ERROR.SERVICES_LOAD_FAILED)
    }
  }

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId)
    setSelectedService(service || null)
    form.setValue('serviceId', serviceId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {STYLIST_SERVICE_LINK_MESSAGES.UI.ADD_BUTTON}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{STYLIST_SERVICE_LINK_MESSAGES.UI.ADD_TITLE}</DialogTitle>
          <DialogDescription>{STYLIST_SERVICE_LINK_MESSAGES.UI.ADD_DIALOG_TITLE}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{STYLIST_SERVICE_LINK_MESSAGES.UI.FORM_SERVICE_LABEL}</FormLabel>
                    <Select onValueChange={handleServiceSelect} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={STYLIST_SERVICE_LINK_MESSAGES.UI.SELECT_SERVICE_PLACEHOLDER} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - {service.category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedService && (
                <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                  <div className="font-medium">{STYLIST_SERVICE_LINK_MESSAGES.UI.SERVICE_DETAILS_LABEL}</div>
                  <div>
                    {STYLIST_SERVICE_LINK_MESSAGES.UI.PRICE_STANDARD_LABEL} {selectedService.price}{' '}
                    {STYLIST_SERVICE_LINK_MESSAGES.UI.CURRENCY_UNIT}
                  </div>
                  <div>
                    {STYLIST_SERVICE_LINK_MESSAGES.UI.DURATION_STANDARD_LABEL} {selectedService.duration}{' '}
                    {STYLIST_SERVICE_LINK_MESSAGES.UI.TIME_UNIT}
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="customPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{STYLIST_SERVICE_LINK_MESSAGES.UI.FORM_PRICE_LABEL}</FormLabel>
                    <FormControl>
                      <Input placeholder={STYLIST_SERVICE_LINK_MESSAGES.UI.FORM_PLACEHOLDER_PRICE} {...field} />
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
                    <FormLabel>{STYLIST_SERVICE_LINK_MESSAGES.UI.FORM_DURATION_LABEL}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={STYLIST_SERVICE_LINK_MESSAGES.UI.FORM_PLACEHOLDER_DURATION}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                {STYLIST_SERVICE_LINK_MESSAGES.UI.CANCEL_BUTTON}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? STYLIST_SERVICE_LINK_MESSAGES.UI.LOADING_ADD : STYLIST_SERVICE_LINK_MESSAGES.UI.ADD_BUTTON}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

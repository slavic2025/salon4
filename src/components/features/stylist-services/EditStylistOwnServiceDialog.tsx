// src/components/features/stylist-services/EditStylistOwnServiceDialog.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
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
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { STYLIST_SERVICE_LINK_MESSAGES } from '@/core/domains/stylist-services/stylist-service.constants'
import type { StylistServiceLinkWithService } from '@/core/domains/stylist-services/stylist-service.types'
import {
  stylistServiceFormSchema,
  type StylistServiceFormValues,
} from '@/core/domains/stylist-services/stylist-service.types'
import { updateStylistOwnServiceAction } from '@/features/stylist-services/actions'
import { useActionForm } from '@/hooks/useActionForm'

type EditStylistOwnServiceDialogProps = {
  link: StylistServiceLinkWithService
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  stylistId: string
}

export function EditStylistOwnServiceDialog({ link, isOpen, setIsOpen, stylistId }: EditStylistOwnServiceDialogProps) {
  const service = link.service

  const form = useForm<StylistServiceFormValues>({
    resolver: zodResolver(stylistServiceFormSchema),
    defaultValues: {
      serviceId: service.id,
      customPrice: link.customPrice || '',
      customDuration: link.customDuration?.toString() || '',
    },
  })

  const { formSubmit, isPending } = useActionForm({
    action: async (values: StylistServiceFormValues) => {
      return updateStylistOwnServiceAction({
        stylistId,
        serviceId: values.serviceId,
        customPrice: values.customPrice || null,
        customDuration: values.customDuration ? parseInt(values.customDuration) : null,
      })
    },
    onSuccess: () => {
      toast.success(STYLIST_SERVICE_LINK_MESSAGES.SUCCESS.UPDATED)
      setIsOpen(false)
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
      error: STYLIST_SERVICE_LINK_MESSAGES.ERROR.UPDATE_FAILED,
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{STYLIST_SERVICE_LINK_MESSAGES.UI.EDIT_TITLE}</DialogTitle>
          <DialogDescription>
            {STYLIST_SERVICE_LINK_MESSAGES.UI.EDIT_DIALOG_DESCRIPTION(service.name)}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-4">
                  <div className="text-sm font-medium mb-2">
                    {STYLIST_SERVICE_LINK_MESSAGES.UI.SERVICE_DETAILS_TITLE}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {service.name} - {service.category}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {STYLIST_SERVICE_LINK_MESSAGES.UI.PRICE_STANDARD_LABEL} {service.price}{' '}
                    {STYLIST_SERVICE_LINK_MESSAGES.UI.CURRENCY_UNIT} |{' '}
                    {STYLIST_SERVICE_LINK_MESSAGES.UI.DURATION_STANDARD_LABEL} {service.duration}{' '}
                    {STYLIST_SERVICE_LINK_MESSAGES.UI.TIME_UNIT}
                  </div>
                </div>
              </div>
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
                {isPending
                  ? STYLIST_SERVICE_LINK_MESSAGES.UI.LOADING_SAVE
                  : STYLIST_SERVICE_LINK_MESSAGES.UI.EDIT_BUTTON}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

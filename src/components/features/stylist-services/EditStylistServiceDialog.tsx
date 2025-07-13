// src/components/features/stylist-services/EditStylistServiceDialog.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { STYLIST_SERVICE_LINK_MESSAGES } from '@/core/domains/stylist-services/stylist-service.constants'
import type { StylistServiceLinkWithService } from '@/core/domains/stylist-services/stylist-service.types'
import { updateStylistServiceLinkAction } from '@/features/stylist-services/actions'
import { useActionForm } from '@/hooks/useActionForm'

import { StylistServiceForm } from './StylistServiceForm'

type EditStylistServiceDialogProps = {
  link: StylistServiceLinkWithService
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  stylistId: string
}

export function EditStylistServiceDialog({ link, isOpen, setIsOpen, stylistId }: EditStylistServiceDialogProps) {
  const { formSubmit, isPending } = useActionForm({
    action: (values) =>
      updateStylistServiceLinkAction({
        stylistId,
        serviceId: link.serviceId,
        customPrice: values.customPrice,
        customDuration: values.customDuration ? Number(values.customDuration) : undefined,
      }),
    onSuccess: () => setIsOpen(false),
    toastMessages: {
      loading: STYLIST_SERVICE_LINK_MESSAGES.UI.EDIT_TITLE,
      success: STYLIST_SERVICE_LINK_MESSAGES.SUCCESS.UPDATED,
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editează serviciul asociat</DialogTitle>
        </DialogHeader>
        <StylistServiceForm
          defaultValues={{
            serviceId: link.serviceId,
            customPrice: link.customPrice ?? '',
            customDuration: link.customDuration ? String(link.customDuration) : '',
          }}
          onSubmit={formSubmit}
          isPending={isPending}
          submitButtonText="Salvează Modificările"
        />
      </DialogContent>
    </Dialog>
  )
}

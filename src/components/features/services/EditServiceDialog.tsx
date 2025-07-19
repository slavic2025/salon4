// src/components/features/services/EditServiceDialog.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Service } from '@/core/domains/services'
import { SERVICE_CATEGORIES, SERVICE_SUCCESS_MESSAGES } from '@/core/domains/services'
import { updateServiceAction } from '@/features/services/actions'
import { useActionForm } from '@/hooks/useActionForm'

import { ServiceForm } from './ServiceForm'

type EditServiceDialogProps = {
  service: Service
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function EditServiceDialog({ service, isOpen, setIsOpen }: EditServiceDialogProps) {
  const { formSubmit, isPending } = useActionForm({
    action: updateServiceAction,
    onSuccess: () => setIsOpen(false),
    toastMessages: {
      loading: 'Se actualizează serviciul...',
      success: SERVICE_SUCCESS_MESSAGES.UPDATED,
    },
  })

  const formDefaultValues = {
    ...service,
    description: service.description ?? '',
    category: service.category ?? SERVICE_CATEGORIES[0],
    price: typeof service.price === 'string' ? Number(service.price) : service.price,
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editează Serviciul</DialogTitle>
        </DialogHeader>
        <ServiceForm
          defaultValues={formDefaultValues}
          onSubmit={(values) => formSubmit({ ...values, id: service.id })}
          isPending={isPending}
          submitButtonText="Salvează Modificările"
        />
      </DialogContent>
    </Dialog>
  )
}

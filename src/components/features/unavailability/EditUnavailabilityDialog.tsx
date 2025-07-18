// src/components/features/unavailability/EditUnavailabilityDialog.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UNAVAILABILITY_SUCCESS_MESSAGES } from '@/core/domains/unavailability/unavailability.constants'
import type { Unavailability } from '@/core/domains/unavailability/unavailability.types'
import { updateUnavailabilityStylistAction } from '@/features/unavailability/actions'
import { useActionForm } from '@/hooks/useActionForm'

import { UnavailabilityForm } from './UnavailabilityForm'

type EditUnavailabilityDialogProps = {
  unavailability: Unavailability
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  stylistId: string
}

export function EditUnavailabilityDialog({
  unavailability,
  isOpen,
  setIsOpen,
  stylistId,
}: EditUnavailabilityDialogProps) {
  const { formSubmit, isPending } = useActionForm({
    action: (values) => updateUnavailabilityStylistAction(unavailability.id, values),
    onSuccess: () => setIsOpen(false),
    toastMessages: {
      loading: 'Se actualizează indisponibilitatea...',
      success: UNAVAILABILITY_SUCCESS_MESSAGES.UPDATED,
    },
  })

  const formDefaultValues = {
    stylistId: unavailability.stylistId,
    date: unavailability.date,
    startTime: unavailability.startTime ?? '',
    endTime: unavailability.endTime ?? '',
    cause: unavailability.cause,
    allDay: unavailability.allDay,
    description: unavailability.description ?? '',
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editează Indisponibilitatea</DialogTitle>
        </DialogHeader>
        <UnavailabilityForm
          defaultValues={formDefaultValues}
          onSubmit={formSubmit}
          isPending={isPending}
          submitButtonText="Salvează Modificările"
          stylistId={stylistId}
        />
      </DialogContent>
    </Dialog>
  )
}

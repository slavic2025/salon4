// src/components/features/stylists/EditStylistDialog.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { STYLIST_MESSAGES } from '@/core/domains/stylists/stylist.constants'
import type { Stylist } from '@/core/domains/stylists/stylist.types'
import { updateStylistAction } from '@/features/stylists/actions'
import { useActionForm } from '@/hooks/useActionForm'

import { StylistForm } from './StylistForm'

type EditStylistDialogProps = {
  stylist: Stylist
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function EditStylistDialog({ stylist, isOpen, setIsOpen }: EditStylistDialogProps) {
  const { formSubmit, isPending } = useActionForm({
    action: updateStylistAction,
    onSuccess: () => setIsOpen(false),
    toastMessages: {
      loading: 'Se actualizează profilul...',
      success: STYLIST_MESSAGES.SERVER.UPDATE_SUCCESS,
    },
  })

  const formDefaultValues = {
    ...stylist,
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editează Profilul Stilistului</DialogTitle>
        </DialogHeader>
        <StylistForm
          // `defaultValues` pre-completează formularul cu datele existente
          defaultValues={formDefaultValues}
          // La submit, adăugăm și ID-ul stilistului la payload
          onSubmit={(values) => formSubmit({ ...values, id: stylist.id })}
          isPending={isPending}
          submitButtonText="Salvează Modificările"
        />
      </DialogContent>
    </Dialog>
  )
}

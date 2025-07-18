// src/components/features/unavailability/AddUnavailabilityDialog.tsx
'use client'

import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { UNAVAILABILITY_SUCCESS_MESSAGES } from '@/core/domains/unavailability/unavailability.constants'
import { createUnavailabilityStylistAction } from '@/features/unavailability/actions'
import { useActionForm } from '@/hooks/useActionForm'

import { UnavailabilityForm } from './UnavailabilityForm'

export function AddUnavailabilityDialog({ stylistId }: { stylistId: string }) {
  const [isOpen, setIsOpen] = useState(false)

  const { formSubmit, isPending } = useActionForm({
    action: createUnavailabilityStylistAction,
    onSuccess: () => setIsOpen(false),
    toastMessages: {
      loading: 'Se adaugă indisponibilitatea...',
      success: UNAVAILABILITY_SUCCESS_MESSAGES.CREATED,
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adaugă Indisponibilitate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adaugă o Indisponibilitate Nouă</DialogTitle>
        </DialogHeader>
        <UnavailabilityForm
          onSubmit={formSubmit}
          isPending={isPending}
          submitButtonText="Adaugă Indisponibilitate"
          stylistId={stylistId}
        />
      </DialogContent>
    </Dialog>
  )
}

// src/components/features/stylist-services/AddStylistServiceDialog.tsx
'use client'

import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { STYLIST_SERVICE_LINK_MESSAGES } from '@/core/domains/stylist-services/stylist-service.constants'
import { createStylistServiceLinkAction } from '@/features/stylist-services/actions'
import { useActionForm } from '@/hooks/useActionForm'

import { StylistServiceForm } from './StylistServiceForm'

export function AddStylistServiceDialog({ stylistId }: { stylistId: string }) {
  const [isOpen, setIsOpen] = useState(false)

  const { formSubmit, isPending } = useActionForm({
    action: (values) => createStylistServiceLinkAction({ ...values, stylistId }),
    onSuccess: () => setIsOpen(false),
    toastMessages: {
      loading: STYLIST_SERVICE_LINK_MESSAGES.UI.ADD_TITLE,
      success: STYLIST_SERVICE_LINK_MESSAGES.SUCCESS.ASSOCIATED,
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adaugă Serviciu
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adaugă un Serviciu pentru Stilist</DialogTitle>
        </DialogHeader>
        <StylistServiceForm onSubmit={formSubmit} isPending={isPending} submitButtonText="Adaugă Serviciu" />
      </DialogContent>
    </Dialog>
  )
}

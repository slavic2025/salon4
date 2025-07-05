// src/components/features/stylists/AddStylistDialog.tsx
'use client'

import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { STYLIST_MESSAGES } from '@/core/domains/stylists/stylist.constants'
import { createStylistAction } from '@/features/stylists/actions'
import { useActionForm } from '@/hooks/useActionForm'

import { StylistForm } from './StylistForm'

export function AddStylistDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const { formSubmit, isPending } = useActionForm({
    action: createStylistAction,
    onSuccess: () => setIsOpen(false),
    toastMessages: {
      loading: 'Se adaugă stilistul...',
      success: STYLIST_MESSAGES.SERVER.CREATE_SUCCESS,
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adaugă Stilist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adaugă un Stilist Nou</DialogTitle>
        </DialogHeader>
        <StylistForm onSubmit={formSubmit} isPending={isPending} submitButtonText="Invită și Adaugă Stilist" />
      </DialogContent>
    </Dialog>
  )
}

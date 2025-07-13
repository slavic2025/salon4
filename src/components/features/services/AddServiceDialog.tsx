// src/components/features/services/AddServiceDialog.tsx
'use client'

import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SERVICE_MESSAGES } from '@/core/domains/services/service.constants'
import { createServiceAction } from '@/features/services/actions'
import { useActionForm } from '@/hooks/useActionForm'

import { ServiceForm } from './ServiceForm'

export function AddServiceDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const { formSubmit, isPending } = useActionForm({
    action: createServiceAction,
    onSuccess: () => setIsOpen(false),
    toastMessages: {
      loading: 'Se adaugă serviciul...',
      success: SERVICE_MESSAGES.SUCCESS.CREATED,
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
          <DialogTitle>Adaugă un Serviciu Nou</DialogTitle>
        </DialogHeader>
        <ServiceForm onSubmit={formSubmit} isPending={isPending} submitButtonText="Adaugă Serviciu" />
      </DialogContent>
    </Dialog>
  )
}

// src/components/features/unavailability/BulkUnavailabilityDialog.tsx
'use client'

import { CalendarDays } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { BulkUnavailabilityForm } from './BulkUnavailabilityForm'

export function BulkUnavailabilityDialog({ stylistId }: { stylistId: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarDays className="mr-2 h-4 w-4" />
          Adaugă Perioada
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adaugă Indisponibilitate pentru o Perioadă</DialogTitle>
        </DialogHeader>
        <BulkUnavailabilityForm stylistId={stylistId} onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

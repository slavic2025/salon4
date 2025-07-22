// src/components/features/appointments/BookingStylistStep.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { BookingCard } from '@/components/ui/booking-card'
import type { Stylist } from '@/core/domains/stylists/stylist.types'
import { getStylistsForServicePublicAction } from '@/features/appointments/actions'
import { type StylistSelection, stylistSelectionSchema } from '@/schemas/booking-schemas'
import { useBookingStore } from '@/stores/booking-store'

interface BookingStylistStepProps {
  onNext: () => void
}

export default function BookingStylistStep({ onNext }: BookingStylistStepProps) {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { service, stylist, setStylist } = useBookingStore()

  const form = useForm<StylistSelection>({
    resolver: zodResolver(stylistSelectionSchema),
    defaultValues: {
      stylistId: stylist?.id || '',
    },
  })

  useEffect(() => {
    if (!service?.id) return

    setLoading(true)
    getStylistsForServicePublicAction(service.id)
      .then(setStylists)
      .catch(() => setError('Eroare la încărcarea stiliștilor'))
      .finally(() => setLoading(false))
  }, [service?.id])

  const handleStylistSelect = (selectedStylist: Stylist) => {
    setStylist(selectedStylist)
    form.setValue('stylistId', selectedStylist.id)
    onNext()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Se încarcă stiliștii...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!stylists.length && !loading) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Ne pare rău, la moment nu avem stilisti care oferă acest serviciu.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Alegeți stilistul</h2>
        <p className="text-muted-foreground">Selectați stilistul care vă va oferi serviciul</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stylists.map((stylistItem: Stylist) => (
          <BookingCard
            key={stylistItem.id}
            id={stylistItem.id}
            title={stylistItem.fullName}
            subtitle={stylistItem.email}
            description={stylistItem.description}
            isSelected={stylist?.id === stylistItem.id}
            onClick={() => handleStylistSelect(stylistItem)}
          />
        ))}
      </div>
    </div>
  )
}

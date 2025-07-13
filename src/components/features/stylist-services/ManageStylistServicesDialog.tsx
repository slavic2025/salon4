'use client'

import { Loader2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  createStylistServiceLinkAction,
  deleteStylistServiceLinkAction,
  updateStylistServiceLinkAction,
} from '@/features/stylist-services/actions'
import { useActionForm } from '@/hooks/useActionForm'
import { useCustomServiceValues } from '@/hooks/useCustomServiceValues'
import { useStylistServices } from '@/hooks/useStylistServices'

import { ServiceItem } from './ServiceItem'

interface Props {
  stylistId: string
  stylistName: string
}

export function ManageStylistServicesDialog({ stylistId, stylistName }: Props) {
  const [open, setOpen] = useState(false)
  const { services, selected, initial, loading, setSelected } = useStylistServices(stylistId, open)
  const { customValues, setCustomValue, resetFor } = useCustomServiceValues()

  // Acțiunea de submit pentru toate modificările
  const { formSubmit: saveAllServices, isPending } = useActionForm({
    action: async () => {
      let ok = true
      // Adăugare
      for (const serviceId of [...selected].filter((id) => !initial.has(id))) {
        const custom = customValues[serviceId] || {}
        const res = await createStylistServiceLinkAction({ stylistId, serviceId, ...transformCustom(custom) })
        if (res?.validationErrors) ok = false
      }
      // Ștergere
      for (const serviceId of [...initial].filter((id) => !selected.has(id))) {
        const res = await deleteStylistServiceLinkAction({ stylistId, serviceId })
        if (res?.validationErrors) ok = false
      }
      // Update
      for (const serviceId of [...selected].filter((id) => initial.has(id))) {
        const custom = customValues[serviceId]
        if (custom?.customPrice !== undefined || custom?.customDuration !== undefined) {
          await updateStylistServiceLinkAction({ stylistId, serviceId, ...transformCustom(custom) })
        }
      }
      return ok ? { data: true } : { serverError: 'Au existat erori la salvare.' }
    },
    onSuccess: () => {
      setOpen(false)
    },
    toastMessages: {
      loading: 'Se salvează modificările...',
    },
  })

  const handleToggle = (serviceId: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(serviceId)) {
        next.delete(serviceId)
        resetFor(serviceId)
      } else {
        next.add(serviceId)
      }
      return next
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Gestionează servicii
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Servicii pentru {stylistName}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {services.length === 0 ? (
              <div className="text-sm text-muted-foreground">Nu există servicii disponibile.</div>
            ) : (
              services.map((service) => (
                <ServiceItem
                  key={service.id}
                  service={service}
                  isChecked={selected.has(service.id)}
                  custom={customValues[service.id] ?? {}}
                  onToggle={() => handleToggle(service.id)}
                  onPriceChange={(val) => setCustomValue(service.id, 'customPrice', val)}
                  onDurationChange={(val) => setCustomValue(service.id, 'customDuration', val)}
                  disabled={isPending}
                />
              ))
            )}
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => saveAllServices(undefined)} disabled={isPending || loading}>
            {isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Salvează
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function transformCustom(custom: { customPrice?: string; customDuration?: string }) {
  return {
    customPrice: custom.customPrice || undefined,
    customDuration: custom.customDuration ? Number(custom.customDuration) : undefined,
  }
}

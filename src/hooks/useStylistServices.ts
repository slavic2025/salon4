import { useEffect, useState } from 'react'

import type { Service } from '@/core/domains/services/service.types'
import { getAllServicesAction, getStylistServiceLinksAction } from '@/features/stylist-services/actions'

export function useStylistServices(stylistId: string, open: boolean) {
  const [services, setServices] = useState<Service[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [initial, setInitial] = useState<Set<string>>(new Set())
  const [customMap, setCustomMap] = useState<Record<string, { customPrice?: string; customDuration?: string }>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    void fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, stylistId])

  const fetchData = async () => {
    const allServices = await getAllServicesAction()
    const stylistLinks = await getStylistServiceLinksAction({ stylistId })

    const linked = new Set(stylistLinks.map((l) => l.serviceId))
    const initialCustom: Record<string, { customPrice?: string; customDuration?: string }> = {}

    stylistLinks.forEach((l) => {
      if (l.customPrice || l.customDuration) {
        initialCustom[l.serviceId] = {
          customPrice: l.customPrice ?? '',
          customDuration: l.customDuration ? String(l.customDuration) : '',
        }
      }
    })

    setServices(allServices)
    setSelected(linked)
    setInitial(linked)
    setCustomMap(initialCustom)
    setLoading(false)
  }

  return { services, selected, initial, customMap, loading, setSelected, setCustomMap }
}

import { useState } from 'react'

type CustomValue = { customPrice?: string; customDuration?: string }
type CustomValuesMap = Record<string, CustomValue>

export function useCustomServiceValues() {
  const [customValues, setCustomValues] = useState<CustomValuesMap>({})

  const setCustomValue = (serviceId: string, field: keyof CustomValue, value: string) => {
    setCustomValues((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], [field]: value },
    }))
  }

  const resetFor = (serviceId: string) => {
    setCustomValues((prev) => {
      const next = { ...prev }
      delete next[serviceId]
      return next
    })
  }

  return { customValues, setCustomValue, resetFor, setCustomValues }
}

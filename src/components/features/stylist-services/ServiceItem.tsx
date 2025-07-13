import { memo } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import type { Service } from '@/core/domains/services/service.types'

interface ServiceItemProps {
  service: Service
  isChecked: boolean
  custom: { customPrice?: string; customDuration?: string }
  onToggle: () => void
  onPriceChange: (val: string) => void
  onDurationChange: (val: string) => void
  disabled: boolean
}

export const ServiceItem = memo(function ServiceItem({
  service,
  isChecked,
  custom,
  onToggle,
  onPriceChange,
  onDurationChange,
  disabled,
}: ServiceItemProps) {
  return (
    <label className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Checkbox checked={isChecked} onCheckedChange={onToggle} disabled={disabled} />
        <span>{service.name}</span>
        <span className="ml-auto text-xs text-muted-foreground">{service.category}</span>
      </div>
      {isChecked && (
        <>
          <div className="ml-6 flex gap-2 mt-1">
            <Input
              type="number"
              placeholder="Preț personalizat"
              value={custom.customPrice ?? ''}
              onChange={(e) => onPriceChange(e.target.value)}
              className="w-36"
              min="0"
            />
            <Input
              type="number"
              placeholder="Durată (min)"
              value={custom.customDuration ?? ''}
              onChange={(e) => onDurationChange(e.target.value)}
              className="w-44"
              min="0"
            />
          </div>
          <div className="ml-6 text-xs text-muted-foreground">Lasă necompletat pentru standard.</div>
        </>
      )}
    </label>
  )
})

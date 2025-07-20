'use client'

import { EmptyState } from '@/components/shared/EmptyState'
import type { Unavailability } from '@/core/domains/unavailability/unavailability.types'

import { UnavailabilityCard } from './UnavailabilityCard'

type UnavailabilityGridViewProps = {
  unavailabilities: Unavailability[]
  stylistId: string
  className?: string
}

export function UnavailabilityGridView({ unavailabilities, stylistId, className }: UnavailabilityGridViewProps) {
  if (unavailabilities.length === 0) {
    return (
      <EmptyState
        title="Nicio indisponibilitate găsită"
        description="Nu există indisponibilități care să corespundă filtrelor selectate."
        icon="calendar-x"
      />
    )
  }

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {unavailabilities.map((unavailability) => (
        <UnavailabilityCard key={unavailability.id} unavailability={unavailability} stylistId={stylistId} />
      ))}
    </div>
  )
}

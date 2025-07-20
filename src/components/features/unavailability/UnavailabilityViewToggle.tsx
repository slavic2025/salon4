'use client'

import { Grid3X3, List } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type UnavailabilityViewToggleProps = {
  view: 'table' | 'card'
  onViewChange: (view: 'table' | 'card') => void
  className?: string
}

export function UnavailabilityViewToggle({ view, onViewChange, className }: UnavailabilityViewToggleProps) {
  return (
    <TooltipProvider>
      <div className={`flex items-center rounded-lg border ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={view === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('table')}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
              <span className="sr-only">Vizualizare tabel</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Vizualizare tabel</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={view === 'card' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('card')}
              className="rounded-l-none"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="sr-only">Vizualizare card</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Vizualizare card</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

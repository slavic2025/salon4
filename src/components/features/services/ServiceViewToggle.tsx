'use client'

import { Grid3X3, List } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type ServiceViewToggleProps = {
  view: 'table' | 'card'
  onViewChange: (view: 'table' | 'card') => void
  className?: string
}

export function ServiceViewToggle({ view, onViewChange, className }: ServiceViewToggleProps) {
  return (
    <TooltipProvider>
      <div className={`flex items-center gap-1 rounded-lg border p-1 ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={view === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('table')}
              className="h-8 w-8 p-0"
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
              className="h-8 w-8 p-0"
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

'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrev: () => void
  canGoNext: boolean
  canGoPrev: boolean
  isLoading?: boolean
  className?: string
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  canGoNext,
  canGoPrev,
  isLoading = false,
  className,
}: StepNavigationProps) {
  const [isHydrated, setIsHydrated] = useState(false)
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  // Detectăm când componenta este hidratată
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Nu renderăm butoanele până când nu suntem hidratați pentru a evita diferențele server/client
  if (!isHydrated) {
    return (
      <div className={cn('flex items-center justify-between mt-4', className)}>
        {/* Placeholder pentru butoane în timpul hidratării */}
        <div className="h-9 w-20 bg-gray-200 rounded-md animate-pulse" />
        <div className="text-xs text-muted-foreground">
          Pasul {currentStep + 1} din {totalSteps}
        </div>
        <div className="h-9 w-28 bg-gray-200 rounded-md animate-pulse" />
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-between mt-4', className)}>
      {/* Back Button compact */}
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={isFirstStep || !canGoPrev || isLoading}
        className={cn(
          'transition-all duration-200 h-9 px-3 border-purple-200 hover:bg-purple-50 hover:border-purple-300',
          isFirstStep && 'invisible',
        )}
      >
        <ChevronLeft className="w-3 h-3 mr-1" />
        Înapoi
      </Button>

      {/* Step Indicator compact */}
      <div className="text-xs text-gray-600">
        Pasul {currentStep + 1} din {totalSteps}
      </div>

      {/* Next/Submit Button compact */}
      <Button
        size="sm"
        onClick={onNext}
        disabled={!canGoNext || isLoading}
        className="transition-all duration-200 h-9 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
      >
        {isLastStep ? (
          <span className="text-sm">{isLoading ? 'Se trimite...' : 'Finalizează'}</span>
        ) : (
          <>
            <span className="text-sm">Următorul</span>
            <ChevronRight className="w-3 h-3 ml-1" />
          </>
        )}
      </Button>
    </div>
  )
}

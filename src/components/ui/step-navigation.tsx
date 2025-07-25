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
      <div className={cn('flex items-center justify-between mt-6', className)}>
        {/* Placeholder pentru butoane în timpul hidratării */}
        <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
        <div className="text-sm text-muted-foreground">
          Pasul {currentStep + 1} din {totalSteps}
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-between mt-6', className)}>
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={isFirstStep || !canGoPrev || isLoading}
        className={cn('transition-all duration-200', isFirstStep && 'invisible')}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Înapoi
      </Button>

      {/* Step Indicator */}
      <div className="text-sm text-muted-foreground">
        Pasul {currentStep + 1} din {totalSteps}
      </div>

      {/* Next/Submit Button */}
      <Button onClick={onNext} disabled={!canGoNext || isLoading} className="transition-all duration-200">
        {isLastStep ? (
          <>{isLoading ? 'Se trimite...' : 'Finalizează programarea'}</>
        ) : (
          <>
            Următorul pas
            <ChevronRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}

'use client'

import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: string[]
  className?: string
}

export function ProgressIndicator({ currentStep, totalSteps, steps, className }: ProgressIndicatorProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className={cn('w-full', className)}>
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Steps */}
      <div className="flex justify-between relative">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          const isUpcoming = index > currentStep

          return (
            <div key={step} className="flex flex-col items-center flex-1 relative z-10">
              {/* Step Circle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                  isCompleted && 'bg-primary text-white',
                  isActive && 'bg-primary text-white ring-4 ring-primary/20 scale-110',
                  isUpcoming && 'bg-gray-200 text-gray-500',
                )}
              >
                {isCompleted ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="transition-transform duration-200"
                  >
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Step Label */}
              <div
                className={cn(
                  'mt-2 text-xs font-medium text-center transition-colors duration-300',
                  isActive && 'text-primary font-semibold',
                  isCompleted && 'text-primary',
                  isUpcoming && 'text-gray-500',
                )}
              >
                {step}
              </div>
            </div>
          )
        })}

        {/* Connector Lines */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
      </div>
    </div>
  )
}

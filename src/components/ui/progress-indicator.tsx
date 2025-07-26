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
      {/* Progress Bar compact */}
      <div className="relative mb-4">
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps compacte */}
      <div className="flex justify-between relative">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          const isUpcoming = index > currentStep

          return (
            <div key={step} className="flex flex-col items-center flex-1 relative z-10">
              {/* Step Circle compact */}
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200',
                  isCompleted && 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
                  isActive &&
                    'bg-gradient-to-r from-purple-600 to-pink-600 text-white ring-3 ring-purple-200 scale-110',
                  isUpcoming && 'bg-gray-200 text-gray-500',
                )}
              >
                {isCompleted ? (
                  <svg
                    width="12"
                    height="12"
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

              {/* Step Label compact */}
              <div
                className={cn(
                  'mt-1.5 text-xs font-medium text-center transition-colors duration-200 leading-tight',
                  isActive && 'text-purple-600 font-semibold',
                  isCompleted && 'text-purple-600',
                  isUpcoming && 'text-gray-500',
                )}
              >
                {step}
              </div>
            </div>
          )
        })}

        {/* Connector Lines compacte */}
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
      </div>
    </div>
  )
}

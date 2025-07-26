'use client'

import { Check } from 'lucide-react'
import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface BookingCardProps {
  id: string
  title: string
  subtitle?: string
  description?: string
  category?: string
  price?: string
  duration?: string
  icon?: React.ReactNode
  isSelected: boolean
  onClick: () => void
  disabled?: boolean
  className?: string
  variant?: 'default' | 'service' | 'stylist'
}

export function BookingCard({
  title,
  subtitle,
  description,
  category,
  price,
  duration,
  icon,
  isSelected,
  onClick,
  disabled = false,
  className,
  variant = 'default',
}: BookingCardProps) {
  // Service variant - layout vertical compact și modern
  if (variant === 'service') {
    return (
      <Card
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md group',
          'border hover:border-purple-400 hover:scale-[1.02] transform',
          isSelected && 'ring-2 ring-purple-700 shadow-lg border-purple-700 scale-[1.02]',
          disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
          className,
        )}
        onClick={disabled ? undefined : onClick}
      >
        <CardHeader className="pb-2 text-center">
          {/* Icon compact și modern */}
          {icon && (
            <div
              className={cn(
                'mx-auto mb-2 p-2 rounded-lg transition-colors duration-200',
                isSelected
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white'
                  : 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 group-hover:from-purple-200 group-hover:to-indigo-200',
              )}
            >
              <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
            </div>
          )}

          {/* Title compact */}
          <CardTitle className="text-base font-semibold mb-1 text-gray-900 leading-tight">{title}</CardTitle>
        </CardHeader>

        <CardContent className="pt-0 pb-3 flex flex-col h-full">
          {/* Spacer pentru a împinge prețul și durata la bottom */}
          <div className="flex-1"></div>

          {/* Preț și durată compacte - aliniate la bottom */}
          <div className="space-y-1.5">
            {/* Preț proeminent dar compact */}
            {price && (
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{price}</div>
              </div>
            )}

            {/* Durată cu badge compact */}
            {duration && (
              <div className="text-center">
                <div className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-xs text-purple-700 font-medium">
                  <span className="mr-1">⏱</span>
                  {duration}
                </div>
              </div>
            )}
          </div>

          {/* Selection indicator compact */}
          {isSelected && (
            <div className="mt-2 flex items-center justify-center">
              <div className="flex items-center text-purple-600 text-xs font-medium">
                <Check className="w-3 h-3 mr-1" />
                Selectat
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Default/Stylist variant - layout orizontal compact
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        'border hover:border-purple-300',
        isSelected && 'ring-2 ring-purple-500 shadow-lg border-purple-500',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      onClick={disabled ? undefined : onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Icon compact pentru stylists */}
            {icon && variant === 'stylist' && (
              <div className="p-1.5 rounded-md bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700">
                <div className="w-4 h-4">{icon}</div>
              </div>
            )}

            <div className="flex-1">
              <CardTitle className="text-sm font-semibold leading-tight">{title}</CardTitle>
              {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          </div>

          {isSelected && (
            <div className="ml-2 p-1 bg-gradient-to-r from-purple-700 to-indigo-800 rounded-full">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{description}</p>}

        <div className="flex items-center justify-between">
          {price && <div className="font-semibold text-sm text-purple-600">{price}</div>}
          {duration && (
            <div className="text-xs text-muted-foreground bg-purple-100 px-2 py-0.5 rounded">Durată: {duration}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

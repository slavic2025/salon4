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
  price,
  duration,
  icon,
  isSelected,
  onClick,
  disabled = false,
  className,
  variant = 'default',
}: BookingCardProps) {
  // Service variant - layout vertical modern pentru desktop
  if (variant === 'service') {
    return (
      <Card
        className={cn(
          'cursor-pointer transition-all duration-300 hover:shadow-lg group h-full',
          'border-2 hover:scale-105 transform',
          isSelected && 'ring-2 ring-primary shadow-xl border-primary scale-105',
          disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
          className,
        )}
        onClick={disabled ? undefined : onClick}
      >
        <CardHeader className="pb-4 text-center">
          {/* Icon mare și proeminent */}
          {icon && (
            <div
              className={cn(
                'mx-auto mb-4 p-4 rounded-full transition-colors duration-300',
                isSelected ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary/20',
              )}
            >
              <div className="w-10 h-10 flex items-center justify-center">{icon}</div>
            </div>
          )}

          {/* Title mare și clar */}
          <CardTitle className="text-xl font-bold mb-3 text-gray-900">{title}</CardTitle>

          {/* Description cu line-clamp pentru consistență */}
          {description && <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">{description}</p>}
        </CardHeader>

        <CardContent className="pt-0 pb-6 flex flex-col justify-end h-full">
          {/* Preț și durată bine aliniate */}
          <div className="space-y-3">
            {/* Preț proeminent */}
            {price && (
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{price}</div>
              </div>
            )}

            {/* Durată cu badge */}
            {duration && (
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700 font-medium">
                  <span className="mr-1">⏱</span>
                  {duration}
                </div>
              </div>
            )}
          </div>

          {/* Selection indicator - doar când e selectat */}
          {isSelected && (
            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center text-primary text-sm font-semibold">
                <Check className="w-4 h-4 mr-2" />
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
        isSelected && 'ring-2 ring-primary shadow-lg',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      onClick={disabled ? undefined : onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Icon pentru stylists */}
            {icon && variant === 'stylist' && (
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <div className="w-5 h-5">{icon}</div>
              </div>
            )}

            <div className="flex-1">
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          </div>

          {isSelected && (
            <div className="ml-2 p-1 bg-primary rounded-full">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>}

        <div className="flex items-center justify-between">
          {price && <div className="font-semibold text-primary">{price}</div>}
          {duration && (
            <div className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">Durată: {duration}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

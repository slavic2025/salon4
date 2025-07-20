'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type StylistServiceSkeletonProps = {
  count?: number
  variant?: 'card' | 'table'
}

export function StylistServiceSkeleton({ count = 6, variant = 'card' }: StylistServiceSkeletonProps) {
  if (variant === 'table') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-3 w-[60px]" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-[150px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <Skeleton className="h-4 w-full" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-6 w-[80px]" />
              </div>
              <Skeleton className="h-4 w-[120px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

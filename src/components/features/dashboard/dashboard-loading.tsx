// src/components/features/dashboard/dashboard-loading.tsx
import { Loader2 } from 'lucide-react'

import { DASHBOARD_UI_CONSTANTS } from './dashboard.constants'

// Constante pentru configurația loading
const LOADING_CONFIG = {
  SKELETON_ROWS: 5,
  SKELETON_CARDS: 3,
} as const

// Component pentru skeleton loading
function SkeletonCard() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="space-y-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

// Component pentru skeleton navigation
function SkeletonNavItem() {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="h-4 w-4 animate-pulse rounded bg-muted" />
      <div className="h-4 w-20 animate-pulse rounded bg-muted" />
    </div>
  )
}

export function DashboardLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className={`${DASHBOARD_UI_CONSTANTS.ICONS.SIZE_LARGE} animate-spin text-primary`} />
        <p className="text-sm text-muted-foreground">Se încarcă dashboard-ul...</p>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: LOADING_CONFIG.SKELETON_CARDS }).map((_, index) => (
          <SkeletonCard key={`skeleton-card-${index}`} />
        ))}
      </div>
    </div>
  )
}

export function NavigationSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: LOADING_CONFIG.SKELETON_ROWS }).map((_, index) => (
        <SkeletonNavItem key={`skeleton-nav-${index}`} />
      ))}
    </div>
  )
}

// src/app/(dashboard)/admin/error.tsx
'use client'

import { DashboardErrorBoundary } from '@/components/features/dashboard/dashboard-error-boundary'

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <DashboardErrorBoundary error={error} reset={reset} />
}

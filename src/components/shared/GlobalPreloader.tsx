'use client'

import { useNavigationLoading } from '@/hooks/useNavigationLoading'
import { UI_MESSAGES } from '@/lib/constants'

import { LoadingSpinner } from './LoadingSpinner'

export function GlobalPreloader() {
  const isLoading = useNavigationLoading()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <LoadingSpinner size="lg" variant="primary" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 animate-pulse">
          {UI_MESSAGES.LOADING.NAVIGATION}
        </p>
      </div>
    </div>
  )
}

// src/components/features/dashboard/dashboard-error-boundary.tsx
'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createLogger } from '@/lib/logger'

import { DASHBOARD_UI_CONSTANTS } from './dashboard.constants'

// Constante pentru mesaje
const ERROR_MESSAGES = {
  TITLE: 'A apărut o eroare',
  DESCRIPTION: 'Ne pare rău, a apărut o problemă neașteptată. Te rog încearcă să reîncarci pagina.',
  RETRY_BUTTON: 'Reîncearcă',
  CONTACT_SUPPORT: 'Dacă problema persistă, te rugăm să contactezi suportul.',
} as const

interface DashboardErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function DashboardErrorBoundary({ error, reset }: DashboardErrorBoundaryProps) {
  const logger = createLogger('dashboard-error-boundary')

  useEffect(() => {
    // Loghează eroarea pentru debugging
    logger.error('Eroare în dashboard', {
      error: error.message,
      stack: error.stack,
      digest: error.digest,
    })
  }, [error, logger])

  const handleRetry = () => {
    logger.info('Încercare de resetare dashboard')
    reset()
  }

  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className={`${DASHBOARD_UI_CONSTANTS.ICONS.SIZE_LARGE} text-destructive`} />
          </div>
          <CardTitle className="text-xl">{ERROR_MESSAGES.TITLE}</CardTitle>
          <CardDescription className="text-base">{ERROR_MESSAGES.DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleRetry} className="w-full" aria-label={ERROR_MESSAGES.RETRY_BUTTON}>
            <RefreshCw className={`mr-2 ${DASHBOARD_UI_CONSTANTS.ICONS.SIZE_SMALL}`} />
            {ERROR_MESSAGES.RETRY_BUTTON}
          </Button>
          <p className="text-xs text-muted-foreground text-center">{ERROR_MESSAGES.CONTACT_SUPPORT}</p>
        </CardContent>
      </Card>
    </div>
  )
}

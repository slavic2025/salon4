// src/app/(dashboard)/stylist/appointments/error.tsx
'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function AppointmentsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Eroare la încărcarea programărilor</h2>
          <p className="text-muted-foreground text-center mb-6">
            A apărut o eroare la încărcarea programărilor. Vă rugăm să încercați din nou.
          </p>
          <Button onClick={reset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Încearcă din nou
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

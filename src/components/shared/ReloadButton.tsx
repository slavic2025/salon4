'use client'

import { Button } from '@/components/ui/button'

export function ReloadButton() {
  const handleReload = () => {
    window.location.reload()
  }

  return (
    <Button
      onClick={handleReload}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Încearcă din nou
    </Button>
  )
}

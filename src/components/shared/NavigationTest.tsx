'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { LoadingSpinner } from './LoadingSpinner'

export function NavigationTest() {
  const [isLoading, setIsLoading] = useState(false)

  const handleTestLoading = () => {
    setIsLoading(true)
    // Simulează o operațiune care durează
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Test Preloader</h3>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button onClick={handleTestLoading} disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Se procesează...
              </>
            ) : (
              'Testează Loading'
            )}
          </Button>

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <LoadingSpinner size="sm" />
              <span>Operațiune în curs...</span>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>• Navighează între pagini pentru a vedea preloader-ul global</p>
          <p>• Preloader-ul se activează automat la schimbarea rutei</p>
          <p>• Folosește animații Tailwind CSS pentru performanță optimă</p>
        </div>
      </div>
    </div>
  )
}

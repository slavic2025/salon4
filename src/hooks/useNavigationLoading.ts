'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useNavigationLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true)
    }

    const handleComplete = () => {
      // Adaug o mică întârziere pentru a evita flash-ul prea rapid
      setTimeout(() => {
        setIsLoading(false)
      }, 150)
    }

    // Declanșează loading la schimbarea rutei
    handleStart()

    // Simulează completarea încărcării
    const timer = setTimeout(handleComplete, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [pathname, searchParams])

  return isLoading
}

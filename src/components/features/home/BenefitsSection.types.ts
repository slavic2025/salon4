import { LucideIcon } from 'lucide-react'

export interface Benefit {
  id: string
  icon: LucideIcon
  title: string
  description: string
  ariaLabel: string
}

export interface BenefitsSectionProps {
  className?: string
  isLoading?: boolean
  error?: string | null
}

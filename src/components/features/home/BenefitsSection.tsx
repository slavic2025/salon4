import { ERROR_MESSAGES } from '@/lib/constants/errors'
import { HOME_BENEFITS_CONSTANTS } from '@/lib/constants/home'
import { cn } from '@/lib/utils'

import BenefitCard from './BenefitCard'
import { BENEFITS_DATA } from './BenefitsSection.data'
import type { BenefitsSectionProps } from './BenefitsSection.types'
import BenefitsSectionSkeleton from './BenefitsSectionSkeleton'

export default function BenefitsSection({ className, isLoading = false, error = null }: BenefitsSectionProps) {
  if (isLoading) {
    return <BenefitsSectionSkeleton />
  }

  if (error) {
    return (
      <section className="py-20 bg-white" aria-label="Eroare la încărcarea secțiunii de beneficii">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">{ERROR_MESSAGES.BENEFITS_LOADING_ERROR}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('py-20 bg-white', className)} aria-labelledby="benefits-heading" role="region">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 id="benefits-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {HOME_BENEFITS_CONSTANTS.SECTION_TITLE}
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {HOME_BENEFITS_CONSTANTS.SECTION_DESCRIPTION}
          </p>
        </header>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          role="list"
          aria-label="Lista de beneficii ale salonului"
        >
          {BENEFITS_DATA.map((benefit) => (
            <div key={benefit.id} role="listitem">
              <BenefitCard benefit={benefit} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

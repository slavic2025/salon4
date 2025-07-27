import { cn } from '@/lib/utils'

import type { Benefit } from './BenefitsSection.types'

interface BenefitCardProps {
  benefit: Benefit
  className?: string
}

export default function BenefitCard({ benefit, className }: BenefitCardProps) {
  const { icon: Icon, title, description, ariaLabel } = benefit

  return (
    <article
      className={cn(
        'group relative text-center p-6 rounded-xl bg-white border border-slate-200 hover:border-amber-200 hover:shadow-lg transition-all duration-300 ease-out',
        'focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-2',
        className,
      )}
      tabIndex={0}
    >
      <div className="mx-auto mb-6 p-4 rounded-full bg-amber-50 border border-amber-200 w-16 h-16 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-300 ease-out">
        <Icon
          className="h-8 w-8 text-amber-600 group-hover:text-amber-700 transition-colors duration-200"
          aria-label={ariaLabel}
          role="img"
        />
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-slate-800 transition-colors duration-200">
        {title}
      </h3>

      <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-200">
        {description}
      </p>
    </article>
  )
}

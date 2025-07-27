import { Award, Clock, MapPin, Users } from 'lucide-react'

import { HOME_BENEFITS_CONSTANTS } from '@/lib/constants/home'

import type { Benefit } from './BenefitsSection.types'

export const BENEFITS_DATA: Benefit[] = [
  {
    id: 'experience',
    icon: Users,
    title: HOME_BENEFITS_CONSTANTS.BENEFITS.EXPERIENCE.TITLE,
    description: HOME_BENEFITS_CONSTANTS.BENEFITS.EXPERIENCE.DESCRIPTION,
    ariaLabel: 'Icon pentru experiență',
  },
  {
    id: 'flexible-schedule',
    icon: Clock,
    title: HOME_BENEFITS_CONSTANTS.BENEFITS.FLEXIBLE_SCHEDULE.TITLE,
    description: HOME_BENEFITS_CONSTANTS.BENEFITS.FLEXIBLE_SCHEDULE.DESCRIPTION,
    ariaLabel: 'Icon pentru program flexibil',
  },
  {
    id: 'certifications',
    icon: Award,
    title: HOME_BENEFITS_CONSTANTS.BENEFITS.CERTIFICATIONS.TITLE,
    description: HOME_BENEFITS_CONSTANTS.BENEFITS.CERTIFICATIONS.DESCRIPTION,
    ariaLabel: 'Icon pentru certificări',
  },
  {
    id: 'central-location',
    icon: MapPin,
    title: HOME_BENEFITS_CONSTANTS.BENEFITS.CENTRAL_LOCATION.TITLE,
    description: HOME_BENEFITS_CONSTANTS.BENEFITS.CENTRAL_LOCATION.DESCRIPTION,
    ariaLabel: 'Icon pentru locație centrală',
  },
]

// src/core/domains/stylist/stylist.constants.ts
import type { NavItem } from '@/types/ui.types'

export const STYLIST_NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/stylist',
    icon: 'dashboard',
  },
  {
    title: 'Programările mele',
    href: '/stylist/appointments',
    icon: 'calendar',
  },
  {
    title: 'Indisponibilitate',
    href: '/stylist/unavailability',
    icon: 'calendarX',
  },
  {
    title: 'Programul meu de lucru',
    href: '/stylist/work-schedule',
    icon: 'clock',
  },
  {
    title: 'Serviciile mele',
    href: '/stylist/services',
    icon: 'scissors',
  },
  {
    title: 'Profilul meu',
    href: '/stylist/profile',
    icon: 'user',
  },
]

export const STYLIST_MESSAGES = {
  DASHBOARD: {
    WELCOME_TITLE: 'Dashboard Stilist',
    WELCOME_DESCRIPTION: 'Bine ai venit! Aici poți gestiona programările și serviciile tale.',
  },
  PROFILE: {
    TITLE: 'Profilul meu',
    DESCRIPTION: 'Gestionează informațiile tale personale și profesionale.',
  },
  SERVICES: {
    TITLE: 'Serviciile mele',
    DESCRIPTION: 'Vezi și gestionează serviciile pe care le oferi.',
  },
  APPOINTMENTS: {
    TITLE: 'Programările mele',
    DESCRIPTION: 'Vezi și gestionează programările tale.',
  },
  WORK_SCHEDULE: {
    TITLE: 'Programul meu de lucru',
    DESCRIPTION: 'Configurează intervalele tale de lucru pentru fiecare zi a săptămânii.',
  },
} as const

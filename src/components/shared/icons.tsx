// src/components/shared/icons.tsx

import {
  ArrowRight,
  CalendarDays,
  CalendarX,
  LayoutDashboard,
  LogIn,
  type LucideIcon,
  Scissors,
  Users,
  // Adaugă aici orice altă iconiță de care vei avea nevoie din `lucide-react`
} from 'lucide-react'

/**
 * Definim un tip pentru numele iconițelor, pentru a beneficia de type-safety și autocomplete.
 * Când ai nevoie de o nouă iconiță, o adaugi mai întâi aici.
 */
export type IconName = 'dashboard' | 'users' | 'scissors' | 'arrowRight' | 'login' | 'calendarX' | 'calendarDays'

/**
 * Obiectul `Icons` acționează ca o hartă (map) între numele simple
 * pe care le folosim în cod (ex: 'dashboard') și componenta React corespunzătoare
 * din librăria `lucide-react`.
 */
export const Icons: Record<IconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  users: Users,
  scissors: Scissors,
  arrowRight: ArrowRight,
  login: LogIn,
  calendarX: CalendarX,
  calendarDays: CalendarDays,
}

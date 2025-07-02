// src/core/domains/admin/admin.constants.ts
import type { NavItem } from '@/types/ui.types'

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: 'dashboard',
  },
  {
    title: 'Stiliști',
    href: '/admin/stylists',
    icon: 'users',
  },
  {
    title: 'Servicii',
    href: '/admin/services',
    icon: 'scissors',
  },
  // Adaugă aici alte linkuri pentru admin
]

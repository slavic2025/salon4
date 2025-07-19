// src/app/(dashboard)/stylist/layout.tsx
import { DashboardLayout } from '@/components/features/dashboard/dashboard-layout'
import { STYLIST_NAV_ITEMS } from '@/core/domains/stylists/stylist.constants'
import { ROLES } from '@/lib/constants'
import { enforceRouteAccess } from '@/lib/route-protection'

export default async function StylistDashboardLayout({ children }: { children: React.ReactNode }) {
  // Verificăm accesul la rutele de stylist - va face redirect dacă nu este autorizat
  const { role } = await enforceRouteAccess('/stylist')

  // Double check - ar trebui să fie stylist dacă a trecut de enforceRouteAccess
  if (role !== ROLES.STYLIST) {
    throw new Error('Acces neautorizat la secțiunea de stilist')
  }

  return <DashboardLayout sidebarNavItems={STYLIST_NAV_ITEMS}>{children}</DashboardLayout>
}

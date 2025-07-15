// src/app/(dashboard)/admin/layout.tsx
import { DashboardLayout } from '@/components/features/dashboard/dashboard-layout'
import { ADMIN_NAV_ITEMS } from '@/core/domains/admin/admin.constants'
import { ROLES } from '@/lib/constants'
import { enforceRouteAccess } from '@/lib/route-protection'

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  // Verificăm accesul la rutele de admin - va face redirect dacă nu este autorizat
  const { role } = await enforceRouteAccess('/admin')

  // Double check - ar trebui să fie admin dacă a trecut de enforceRouteAccess
  if (role !== ROLES.ADMIN) {
    throw new Error('Acces neautorizat la secțiunea de administrare')
  }

  return <DashboardLayout sidebarNavItems={ADMIN_NAV_ITEMS}>{children}</DashboardLayout>
}

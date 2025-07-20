// src/app/(dashboard)/admin/layout.tsx
import { Suspense } from 'react'

import { DashboardLayout } from '@/components/features/dashboard/dashboard-layout'
import { DashboardLoading } from '@/components/features/dashboard/dashboard-loading'
import { ADMIN_NAV_ITEMS, ROLES } from '@/lib/constants'
import { enforceRouteAccess } from '@/lib/route-protection'

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  // Verificăm accesul la rutele de admin - va face redirect dacă nu este autorizat
  const { role } = await enforceRouteAccess('/admin')

  // Double check - ar trebui să fie admin dacă a trecut de enforceRouteAccess
  if (role !== ROLES.ADMIN) {
    throw new Error('Acces neautorizat la secțiunea de administrare')
  }

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardLayout sidebarNavItems={ADMIN_NAV_ITEMS}>{children}</DashboardLayout>
    </Suspense>
  )
}

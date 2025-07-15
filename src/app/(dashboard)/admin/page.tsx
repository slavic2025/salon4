// src/app/(dashboard)/admin/page.tsx
import { ROLES } from '@/lib/constants'
import { enforceRouteAccess } from '@/lib/route-protection'

const ADMIN_DASHBOARD_MESSAGES = {
  TITLE: 'Dashboard Admin',
  DESCRIPTION: 'Bine ai venit! Aici poți gestiona întregul salon.',
} as const

export default async function AdminDashboardPage() {
  // Verificare suplimentară la nivel de pagină (Defence in Depth)
  const { role } = await enforceRouteAccess('/admin')

  // Double check - ar trebui să fie admin
  if (role !== ROLES.ADMIN) {
    throw new Error('Acces neautorizat la dashboard-ul de administrare')
  }

  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{ADMIN_DASHBOARD_MESSAGES.TITLE}</h1>
      <p className="text-muted-foreground">{ADMIN_DASHBOARD_MESSAGES.DESCRIPTION}</p>
    </div>
  )
}

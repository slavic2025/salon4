// src/app/(dashboard)/stylist/page.tsx
import { STYLIST_MESSAGES } from '@/core/domains/stylist/stylist.constants'
import { ROLES } from '@/lib/constants'
import { enforceRouteAccess } from '@/lib/route-protection'

export default async function StylistDashboardPage() {
  // Verificare suplimentară la nivel de pagină (Defence in Depth)
  const { role } = await enforceRouteAccess('/stylist')

  // Double check - ar trebui să fie stylist
  if (role !== ROLES.STYLIST) {
    throw new Error('Acces neautorizat la dashboard-ul de stilist')
  }

  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{STYLIST_MESSAGES.DASHBOARD.WELCOME_TITLE}</h1>
      <p className="text-muted-foreground">{STYLIST_MESSAGES.DASHBOARD.WELCOME_DESCRIPTION}</p>
    </div>
  )
}

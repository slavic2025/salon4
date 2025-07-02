// src/app/(dashboard)/admin/layout.tsx
import { DashboardLayout } from '@/components/features/dashboard/dashboard-layout'
import { ADMIN_NAV_ITEMS } from '@/core/domains/admin/admin.constants'

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout sidebarNavItems={ADMIN_NAV_ITEMS}>{children}</DashboardLayout>
}

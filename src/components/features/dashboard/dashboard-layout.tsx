// src/components/features/dashboard/dashboard-layout.tsx
import Link from 'next/link'
import { Suspense } from 'react'

import { DashboardLayoutProps } from '@/types/ui.types'

import { DASHBOARD_CONSTANTS, DASHBOARD_CSS_CLASSES } from './dashboard.constants'
import { MainNav } from './main-nav'
import { MobileNav } from './mobile-nav'
import { UserNav } from './user-nav'

// Constante pentru grid classes - optimizate pentru performanță
const GRID_CLASSES = {
  MOBILE: 'grid-cols-1',
  DESKTOP: 'grid-cols-[180px_1fr] md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]',
} as const

export function DashboardLayout({ sidebarNavItems, children }: DashboardLayoutProps) {
  const gridClasses = `${DASHBOARD_CSS_CLASSES.LAYOUT.MAIN_CONTAINER} ${GRID_CLASSES.MOBILE} ${GRID_CLASSES.DESKTOP}`

  return (
    <div className={gridClasses}>
      {/* Sidebar - ascuns pe mobile */}
      <aside className={`${DASHBOARD_CSS_CLASSES.LAYOUT.SIDEBAR} hidden md:block`}>
        <div className={DASHBOARD_CSS_CLASSES.LAYOUT.SIDEBAR_CONTENT}>
          <div className={DASHBOARD_CSS_CLASSES.LAYOUT.SIDEBAR_HEADER}>
            <Link href="/" className={DASHBOARD_CSS_CLASSES.BRAND.LINK}>
              <span>{DASHBOARD_CONSTANTS.BRAND_NAME}</span>
            </Link>
          </div>
          <div className={DASHBOARD_CSS_CLASSES.LAYOUT.SIDEBAR_NAV_CONTAINER}>
            <nav className={DASHBOARD_CSS_CLASSES.LAYOUT.SIDEBAR_NAV}>
              <MainNav items={sidebarNavItems} />
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={DASHBOARD_CSS_CLASSES.LAYOUT.MAIN_CONTENT}>
        <header className={DASHBOARD_CSS_CLASSES.HEADER.CONTAINER}>
          {/* Mobile Navigation Trigger */}
          <MobileNav navItems={sidebarNavItems} />

          <div className={DASHBOARD_CSS_CLASSES.HEADER.SPACER} />

          {/* User Navigation */}
          <Suspense fallback={<div className="h-9 w-9 animate-pulse rounded-full bg-muted" />}>
            <UserNav />
          </Suspense>
        </header>

        <main className={DASHBOARD_CSS_CLASSES.MAIN.CONTAINER}>{children}</main>
      </div>
    </div>
  )
}

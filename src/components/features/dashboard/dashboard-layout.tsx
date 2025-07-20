// src/components/features/dashboard/dashboard-layout.tsx
import Link from 'next/link'

import { DashboardLayoutProps } from '@/types/ui.types'

import { DASHBOARD_CONSTANTS, DASHBOARD_CSS_CLASSES } from './dashboard.constants'
import { MainNav } from './main-nav'
import { MobileNav } from './mobile-nav'
import { UserNav } from './user-nav'

// Constante pentru clase CSS specifice
const CSS_CLASSES = {
  SIDEBAR_CONTENT: 'flex h-full max-h-screen flex-col gap-2',
  SIDEBAR_HEADER: `flex items-center border-b px-4 ${DASHBOARD_CONSTANTS.HEIGHTS.HEADER_MOBILE} ${DASHBOARD_CONSTANTS.HEIGHTS.HEADER_DESKTOP} lg:px-6`,
  BRAND_LINK: 'flex items-center gap-2 font-semibold',
  SIDEBAR_NAV_CONTAINER: 'flex-1 overflow-auto py-4',
  SIDEBAR_NAV: 'grid items-start px-2 text-sm font-medium lg:px-4',
  HEADER: `${DASHBOARD_CSS_CLASSES.HEADER.CONTAINER} ${DASHBOARD_CONSTANTS.HEIGHTS.HEADER_MOBILE} ${DASHBOARD_CONSTANTS.HEIGHTS.HEADER_DESKTOP} lg:px-6`,
  MAIN: `flex flex-1 flex-col ${DASHBOARD_CONSTANTS.SPACING.GAP_MEDIUM} p-4 ${DASHBOARD_CONSTANTS.SPACING.GAP_LARGE} lg:p-6`,
} as const

export function DashboardLayout({ sidebarNavItems, children }: DashboardLayoutProps) {
  const gridClasses = `${DASHBOARD_CSS_CLASSES.LAYOUT.MAIN_CONTAINER} md:grid-cols-[${DASHBOARD_CONSTANTS.BREAKPOINTS.SIDEBAR_WIDTH_MD}_1fr] lg:grid-cols-[${DASHBOARD_CONSTANTS.BREAKPOINTS.SIDEBAR_WIDTH_LG}_1fr]`

  return (
    <div className={gridClasses}>
      <aside className={DASHBOARD_CSS_CLASSES.LAYOUT.SIDEBAR}>
        <div className={CSS_CLASSES.SIDEBAR_CONTENT}>
          <div className={CSS_CLASSES.SIDEBAR_HEADER}>
            <Link href="/" className={CSS_CLASSES.BRAND_LINK}>
              <span>{DASHBOARD_CONSTANTS.BRAND_NAME}</span>
            </Link>
          </div>
          <div className={CSS_CLASSES.SIDEBAR_NAV_CONTAINER}>
            <nav className={CSS_CLASSES.SIDEBAR_NAV}>
              <MainNav items={sidebarNavItems} />
            </nav>
          </div>
        </div>
      </aside>

      <div className={DASHBOARD_CSS_CLASSES.LAYOUT.MAIN_CONTENT}>
        <header className={CSS_CLASSES.HEADER}>
          <MobileNav navItems={sidebarNavItems} />
          <div className={DASHBOARD_CSS_CLASSES.HEADER.SPACER} />
          <UserNav />
        </header>
        <main className={CSS_CLASSES.MAIN}>{children}</main>
      </div>
    </div>
  )
}

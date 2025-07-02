// src/components/dashboard/dashboard-layout.tsx
import { DashboardLayoutProps } from '@/types/ui.types'

import { MainNav } from './main-nav'
import { MobileNav } from './mobile-nav'
import { UserNav } from './user-nav'

export function DashboardLayout({ sidebarNavItems, children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 ...">
        <div className="container flex h-16 items-center justify-between">
          {/* Pasează item-ele către meniul de mobil */}
          <MobileNav navItems={sidebarNavItems} />
          {/* ... */}
          <UserNav />
        </div>
      </header>
      <div className="container flex-1 ...">
        <aside className="fixed ...">
          {/* Pasează aceleași iteme către meniul de desktop */}
          <nav className="h-full p-6">
            <MainNav items={sidebarNavItems} />
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}

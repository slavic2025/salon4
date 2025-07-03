// src/components/dashboard/dashboard-layout.tsx
import Link from 'next/link'

import { DashboardLayoutProps } from '@/types/ui.types'

import { MainNav } from './main-nav'
import { MobileNav } from './mobile-nav'
import { UserNav } from './user-nav'

export function DashboardLayout({ sidebarNavItems, children }: DashboardLayoutProps) {
  return (
    // Folosim CSS Grid pentru structura principală: o coloană pentru sidebar, o coloană pentru conținut.
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* --- Sidebar pentru Desktop --- */}
      {/* Acesta este vizibil doar pe ecrane medii și mai mari. */}
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          {/* Header-ul Sidebar-ului */}
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              {/* Aici poți adăuga un logo SVG */}
              <span className="">Salon App</span>
            </Link>
          </div>
          {/* Conținutul Sidebar-ului (Meniul) */}
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <MainNav items={sidebarNavItems} />
            </nav>
          </div>
        </div>
      </aside>

      {/* --- Conținutul Principal (Header + Pagina) --- */}
      <div className="flex flex-col">
        {/* Header-ul de sus */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Meniul pentru mobil, care apare doar pe ecrane mici */}
          <MobileNav navItems={sidebarNavItems} />
          {/* Un div gol pentru a împinge meniul de utilizator la dreapta */}
          <div className="w-full flex-1" />
          <UserNav />
        </header>

        {/* Conținutul paginii curente, cu padding și scroll */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

export type NavItem = { title: string; href: string; icon: string; disabled?: boolean }

export type DashboardLayoutProps = {
  sidebarNavItems: NavItem[]
  children: React.ReactNode
}

export type MainNavProps = {
  items: NavItem[]
  onLinkClick?: () => void
}

export type MobileNavProps = {
  navItems: NavItem[]
}

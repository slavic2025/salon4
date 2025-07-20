export type NavItem = {
  readonly title: string
  readonly href: string
  readonly icon: string
  readonly disabled?: boolean
}

export type DashboardLayoutProps = {
  readonly sidebarNavItems: readonly NavItem[]
  readonly children: React.ReactNode
}

export type MainNavProps = {
  readonly items: readonly NavItem[]
  readonly onLinkClick?: () => void
}

export type MobileNavProps = {
  readonly navItems: readonly NavItem[]
}

export type NavItem = { title: string; href: string; icon: string; disabled?: boolean }

export type DashboardLayoutProps = {
  sidebarNavItems: NavItem[]
  children: React.ReactNode
}

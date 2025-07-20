// Constante pentru configurația dashboard-ului
export const DASHBOARD_CONSTANTS = {
  BRAND_NAME: 'Salon App',
  BREAKPOINTS: {
    SIDEBAR_WIDTH_MD: '220px',
    SIDEBAR_WIDTH_LG: '280px',
  },
  HEIGHTS: {
    HEADER_MOBILE: 'h-14',
    HEADER_DESKTOP: 'lg:h-[60px]',
  },
  SPACING: {
    GAP_SMALL: 'gap-2',
    GAP_MEDIUM: 'gap-4',
    GAP_LARGE: 'lg:gap-6',
  },
} as const

// Constante pentru clase CSS comune
export const DASHBOARD_CSS_CLASSES = {
  LAYOUT: {
    MAIN_CONTAINER: 'grid min-h-screen w-full',
    SIDEBAR: 'border-r bg-muted/40',
    MAIN_CONTENT: 'flex flex-col',
  },
  HEADER: {
    CONTAINER: 'flex items-center gap-4 border-b bg-muted/40 px-4',
    SPACER: 'w-full flex-1',
  },
  NAVIGATION: {
    CONTAINER: 'grid items-start gap-1 px-1 text-sm font-medium md:px-2 lg:px-4',
    LINK: 'flex items-center gap-2 rounded-lg px-2 py-2 text-muted-foreground transition-all hover:text-primary md:gap-3 md:px-3',
    ACTIVE: 'bg-muted text-primary',
    DISABLED: 'cursor-not-allowed opacity-50',
  },
} as const

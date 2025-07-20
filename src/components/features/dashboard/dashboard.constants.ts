// Constante pentru configurația dashboard-ului
export const DASHBOARD_CONSTANTS = {
  BRAND_NAME: 'Salon App',
  BREAKPOINTS: {
    SIDEBAR_WIDTH_MOBILE: '100%',
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
  ANIMATIONS: {
    TRANSITION_DURATION: 'duration-200',
    TRANSITION_EASING: 'ease-in-out',
  },
} as const

// Constante pentru clase CSS comune - organizate pe categorii
export const DASHBOARD_CSS_CLASSES = {
  LAYOUT: {
    MAIN_CONTAINER: 'grid min-h-screen w-full',
    SIDEBAR: 'border-r bg-muted/40 backdrop-blur-sm',
    MAIN_CONTENT: 'flex flex-col',
    SIDEBAR_CONTENT: 'flex h-full max-h-screen flex-col gap-2',
    SIDEBAR_HEADER: 'flex items-center border-b px-3 h-14 lg:h-[60px] md:px-4 lg:px-6',
    SIDEBAR_NAV_CONTAINER: 'flex-1 overflow-auto py-4',
    SIDEBAR_NAV: 'grid items-start px-2 text-sm font-medium md:px-3 lg:px-4',
  },
  HEADER: {
    CONTAINER: 'flex items-center gap-4 border-b bg-muted/40 backdrop-blur-sm px-4 h-14 lg:h-[60px] lg:px-6',
    SPACER: 'w-full flex-1',
    MOBILE_TRIGGER: 'shrink-0 md:hidden',
  },
  MAIN: {
    CONTAINER: 'flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6',
  },
  NAVIGATION: {
    CONTAINER: 'grid items-start gap-1 px-1 text-sm font-medium md:px-2 lg:px-4',
    LINK: 'flex items-center gap-2 rounded-lg px-2 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted/50 md:gap-3 md:px-3',
    ACTIVE: 'bg-muted text-primary',
    DISABLED: 'cursor-not-allowed opacity-50',
  },
  BRAND: {
    LINK: 'flex items-center gap-2 font-semibold transition-colors hover:text-primary',
  },
  MOBILE: {
    SHEET_CONTENT: 'flex flex-col p-0',
    HEADER_CONTAINER: 'flex items-center border-b px-4 h-14 lg:h-[60px] lg:px-6',
    CONTENT_CONTAINER: 'flex-1 overflow-auto p-4',
  },
} as const

// Constante pentru configurația UI
export const DASHBOARD_UI_CONSTANTS = {
  ICONS: {
    SIZE_SMALL: 'h-4 w-4',
    SIZE_MEDIUM: 'h-5 w-5',
    SIZE_LARGE: 'h-6 w-6',
  },
  TOOLTIP: {
    DELAY: 0,
    SIDE: 'right' as const,
  },
  SHEET: {
    SIDE: 'left' as const,
  },
  AVATAR: {
    SIZE: 'h-9 w-9',
  },
  DROPDOWN: {
    WIDTH: 'w-56',
  },
} as const

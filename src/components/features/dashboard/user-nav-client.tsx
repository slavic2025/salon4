// src/components/features/dashboard/user-nav-client.tsx
'use client'

import type { User } from '@supabase/supabase-js'
import { LogOut, Settings, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useTransition } from 'react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOutAction } from '@/features/auth/actions'
import { createLogger } from '@/lib/logger'

import { DASHBOARD_UI_CONSTANTS } from './dashboard.constants'

// Constante pentru mesaje
const MESSAGES = {
  SIGN_OUT_PENDING: 'Deconectare în curs...',
  SIGN_OUT_SUCCESS: 'Deconectare reușită!',
  SIGN_OUT_ERROR: 'Deconectarea a eșuat. Te rog încearcă din nou.',
  DEFAULT_USER_NAME: 'Utilizator',
  INITIALS_FALLBACK: '??',
} as const

// Constante pentru configurația UI
const UI_CONFIG = {
  INITIALS_LENGTH: 2,
} as const

type UserNavClientProps = {
  user: User | null
}

export function UserNavClient({ user }: UserNavClientProps) {
  const [isPending, startTransition] = useTransition()
  const logger = createLogger('user-nav')

  const getInitials = (email?: string | null) => {
    return email?.slice(0, UI_CONFIG.INITIALS_LENGTH).toUpperCase() ?? MESSAGES.INITIALS_FALLBACK
  }

  const handleSignOut = () => {
    startTransition(async () => {
      toast.info(MESSAGES.SIGN_OUT_PENDING)
      try {
        await signOutAction()
        toast.success(MESSAGES.SIGN_OUT_SUCCESS)
      } catch (error) {
        toast.error(MESSAGES.SIGN_OUT_ERROR)
        logger.error('Eroare la deconectare', { error, userId: user?.id })
      }
    })
  }

  if (!user) {
    return null
  }

  const userName = user.user_metadata?.full_name ?? MESSAGES.DEFAULT_USER_NAME
  const userEmail = user.email ?? ''
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`relative rounded-full ${DASHBOARD_UI_CONSTANTS.AVATAR.SIZE} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
          aria-label={`Meniu utilizator pentru ${userName}`}
        >
          <Avatar className={DASHBOARD_UI_CONSTANTS.AVATAR.SIZE}>
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback>{getInitials(userEmail)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={DASHBOARD_UI_CONSTANTS.DROPDOWN.WIDTH} align="end" forceMount sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/account/profile">
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon className={`mr-2 ${DASHBOARD_UI_CONSTANTS.ICONS.SIZE_SMALL}`} />
              <span>Profil</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/account/settings">
            <DropdownMenuItem className="cursor-pointer">
              <Settings className={`mr-2 ${DASHBOARD_UI_CONSTANTS.ICONS.SIZE_SMALL}`} />
              <span>Setări</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isPending}
          className="cursor-pointer"
          aria-label="Deconectare"
        >
          <LogOut className={`mr-2 ${DASHBOARD_UI_CONSTANTS.ICONS.SIZE_SMALL}`} />
          <span>{isPending ? 'Deconectare...' : 'Deconectare'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

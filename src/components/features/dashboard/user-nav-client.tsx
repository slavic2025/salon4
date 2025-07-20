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

// Constante pentru configurația UI
const UI_CONSTANTS = {
  AVATAR_SIZE: 'h-9 w-9',
  ICON_SIZE: 'h-4 w-4',
  DROPDOWN_WIDTH: 'w-56',
  INITIALS_FALLBACK: '??',
  INITIALS_LENGTH: 2,
} as const

// Constante pentru mesaje
const MESSAGES = {
  SIGN_OUT_PENDING: 'Deconectare în curs...',
  SIGN_OUT_SUCCESS: 'Deconectare reușită!',
  SIGN_OUT_ERROR: 'Deconectarea a eșuat. Te rog încearcă din nou.',
  DEFAULT_USER_NAME: 'Utilizator',
} as const

type UserNavClientProps = {
  user: User | null
}

export function UserNavClient({ user }: UserNavClientProps) {
  const [isPending, startTransition] = useTransition()
  const logger = createLogger('user-nav')

  const getInitials = (email?: string | null) => {
    return email?.slice(0, UI_CONSTANTS.INITIALS_LENGTH).toUpperCase() ?? UI_CONSTANTS.INITIALS_FALLBACK
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
        <Button variant="ghost" className={`relative rounded-full ${UI_CONSTANTS.AVATAR_SIZE}`}>
          <Avatar className={UI_CONSTANTS.AVATAR_SIZE}>
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback>{getInitials(userEmail)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={UI_CONSTANTS.DROPDOWN_WIDTH} align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/account/profile">
            <DropdownMenuItem>
              <UserIcon className={`mr-2 ${UI_CONSTANTS.ICON_SIZE}`} />
              <span>Profil</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/account/settings">
            <DropdownMenuItem>
              <Settings className={`mr-2 ${UI_CONSTANTS.ICON_SIZE}`} />
              <span>Setări</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isPending} className="cursor-pointer">
          <LogOut className={`mr-2 ${UI_CONSTANTS.ICON_SIZE}`} />
          <span>Deconectare</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

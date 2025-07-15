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

type UserNavClientProps = {
  user: User | null
}

export function UserNavClient({ user }: UserNavClientProps) {
  const [isPending, startTransition] = useTransition()

  // Simplified and safer helper for initials
  const getInitials = (email?: string | null) => {
    return email?.slice(0, 2).toUpperCase() ?? '??'
  }

  const handleSignOut = () => {
    startTransition(async () => {
      toast.info('Deconectare în curs...')
      try {
        await signOutAction()
        toast.success('Deconectare reușită!')
      } catch (error) {
        toast.error('Deconectarea a eșuat. Te rog încearcă din nou.')
        console.error('Eroare la deconectare:', error)
      }
    })
  }

  // If there's no user, we don't render the component.
  // The layout can handle showing a login button.
  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name ?? user.email ?? ''} />
            <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name ?? 'Utilizator'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/account/profile">
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/account/settings">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Setări</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isPending} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Deconectare</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

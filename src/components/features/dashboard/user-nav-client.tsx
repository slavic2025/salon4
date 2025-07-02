// src/components/dashboard/user-nav-client.tsx
'use client'

import type { User } from '@supabase/supabase-js'
import { LogOut, Settings, User as UserIcon } from 'lucide-react'

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

interface UserNavClientProps {
  user: User | null
}

export function UserNavClient({ user }: UserNavClientProps) {
  // Helper to get user initials from email
  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase()
  }

  if (!user) {
    // Optionally render a login button if user is not found
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email ?? ''} />
            <AvatarFallback>{getInitials(user.email ?? '??')}</AvatarFallback>
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
          <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Setări</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* The logout action is handled by a form for robustness */}
        <form action={signOutAction}>
          <button type="submit" className="w-full">
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Deconectare</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

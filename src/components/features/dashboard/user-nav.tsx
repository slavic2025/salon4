// src/components/dashboard/user-nav.tsx
import { createClient } from '@/lib/supabase/server'

import { UserNavClient } from './user-nav-client'

/**
 * An asynchronous Server Component to fetch the current user's data
 * and pass it to the client-side component for rendering.
 */
export async function UserNav() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <UserNavClient user={user} />
}

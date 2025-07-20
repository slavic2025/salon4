// src/components/features/dashboard/user-nav.tsx
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

import { UserNavClient } from './user-nav-client'

const logger = createLogger('user-nav')

export async function UserNav() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      logger.error('Eroare la obținerea utilizatorului', { error })
      return null
    }

    return <UserNavClient user={user} />
  } catch (error) {
    logger.error('Eroare neașteptată în UserNav', { error })
    return null
  }
}

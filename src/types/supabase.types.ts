// src/types/supabase.types.ts

import { ROLES } from '@/lib/constants'
// Extragem tipul exact al rolurilor: 'ADMIN' | 'STYLIST'
type Role = keyof typeof ROLES

// Folosim "declaration merging" pentru a extinde tipurile din pachetul Supabase
declare module '@supabase/supabase-js' {
  // Extindem interfața UserAppMetadata
  export interface UserAppMetadata {
    // Acum, TypeScript știe că `app_metadata` poate conține o cheie `role`
    // de tip 'ADMIN' sau 'STYLIST'.
    role?: Role
  }
}

// src/core/domains/auth/auth.repository.ts

import { eq } from 'drizzle-orm';
import type { DbClient } from '@/db';
import { admins } from '@/db/schema/admins';
import { stylists } from '@/db/schema/stylists';
import { ROLES, type UserRole } from '@/lib/constants';

/**
 * Repository pentru verificarea rolurilor utilizatorilor.
 */
export function createAuthRepository(db: DbClient) {
  return {
    /**
     * Găsește rolul unui utilizator pe baza ID-ului său.
     */
    async getUserRole(userId: string): Promise<UserRole> {
      // Verificăm dacă este admin
      const admin = await db.query.admins.findFirst({
        where: eq(admins.id, userId),
        columns: { id: true },
      });
      if (admin) return ROLES.ADMIN;

      // Verificăm dacă este stilist
      const stylist = await db.query.stylists.findFirst({
        where: eq(stylists.id, userId),
        columns: { id: true },
      });
      if (stylist) return ROLES.STYLIST;
      
      return null;
    },
  };
}

export type AuthRepository = ReturnType<typeof createAuthRepository>;
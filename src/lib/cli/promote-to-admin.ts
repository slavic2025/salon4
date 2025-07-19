// src/lib/cli/promote-to-admin.ts
import 'dotenv/config'

import type { User } from '@supabase/supabase-js'
import { eq } from 'drizzle-orm'

import { createAuthRepository } from '@/core/domains/auth'
import { db } from '@/db'
import { admins } from '@/db/schema/admins'

import { createLogger } from '../logger'

const logger = createLogger('CLI:promote-to-admin')

/**
 * Adaugă ID-ul unui utilizator în tabela de administratori, verificând dacă nu există deja.
 * @param user - Obiectul utilizatorului de promovat.
 */
async function promoteUserToAdmin(user: User): Promise<void> {
  const existingAdmin = await db.query.admins.findFirst({ where: eq(admins.id, user.id) })
  if (existingAdmin) {
    logger.info(`User ${user.email} is already an admin. No action needed.`)
    return
  }

  await db.insert(admins).values({ id: user.id, fullName: user.email })
  logger.info(`✅ Successfully promoted ${user.email} to admin!`)
}

/**
 * Funcția principală care orchestrează scriptul.
 */
async function main() {
  logger.info('Starting script...')

  const email = process.argv[2]
  if (!email) {
    logger.error('Please provide an email as an argument to the script.')
    process.exit(1)
  }

  // Folosim noul nostru repository centralizat
  const authRepo = createAuthRepository(db)

  try {
    logger.info(`Looking for user with email: ${email}`)
    const user = await authRepo.findUserByEmail(email)
    logger.info(`Found user: ${user.email} (ID: ${user.id})`)

    await promoteUserToAdmin(user)
  } catch (error) {
    logger.error('Script execution failed.', { error })
    process.exit(1)
  }
}

void main()

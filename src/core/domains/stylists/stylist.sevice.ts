// src/core/domains/stylists/stylist.service.ts

import type { SupabaseClient } from '@supabase/supabase-js'

import { UniquenessError } from '@/lib/errors'
import { createLogger } from '@/lib/logger'

import { STYLIST_MESSAGES } from './stylist.constants'
import type { StylistRepository } from './stylist.repository'
import type { CreateStylistPayload, UpdateStylistPayload } from './stylist.types'

export function createStylistService(
  repository: StylistRepository,
  supabaseAdmin: SupabaseClient, // Folosim clientul de admin pentru a crea și șterge utilizatori
) {
  const logger = createLogger('StylistService')

  /**
   * Funcție privată care centralizează logica de verificare a unicității.
   * Aruncă o eroare `UniquenessError` dacă se găsesc duplicate.
   * @param data - Obiect cu câmpurile de verificat (email, phone).
   * @param idToExclude - ID-ul de exclus la verificare (esențial pentru editare).
   */
  async function _ensureUniqueness(data: { email: string; phone?: string | null }, idToExclude: string | null = null) {
    const errors: { field: string; message: string }[] = []

    // Verifică unicitatea email-ului
    const existingByEmail = await repository.findByEmail(data.email)
    if (existingByEmail && existingByEmail.id !== idToExclude) {
      errors.push({ field: 'email', message: STYLIST_MESSAGES.VALIDATION.INVALID_EMAIL })
    }

    // Verifică unicitatea telefonului, dacă este furnizat
    if (data.phone) {
      const existingByPhone = await repository.findByPhone(data.phone)
      if (existingByPhone && existingByPhone.id !== idToExclude) {
        errors.push({ field: 'phone', message: 'Numărul de telefon este deja folosit.' })
      }
    }

    if (errors.length > 0) {
      throw new UniquenessError('Uniqueness validation failed', errors)
    }
  }

  return {
    /** Obține o listă cu toți stiliștii. */
    async getAllStylists() {
      return repository.findAll()
    },

    /**
     * Ordonează crearea completă a unui stilist:
     * 1. Invită utilizatorul în Supabase Auth.
     * 2. Creează profilul în tabela `stylists`.
     * 3. Face rollback (șterge contul Auth) dacă pasul 2 eșuează.
     */
    async createStylist(payload: CreateStylistPayload) {
      await _ensureUniqueness(payload)
      logger.info('Attempting to create and invite a new stylist...', { email: payload.email })

      const {
        data: { user },
        error: inviteError,
      } = await supabaseAdmin.auth.admin.inviteUserByEmail(payload.email)

      if (inviteError || !user) {
        logger.error('Failed to create auth user for stylist.', { error: inviteError })
        throw new Error(STYLIST_MESSAGES.SERVER.CREATE_AUTH_ERROR)
      }

      logger.info('Auth user created successfully.', { userId: user.id })

      try {
        const newStylistProfile = await repository.create({
          id: user.id,
          email: user.email!,
          fullName: payload.fullName,
          phone: payload.phone,
          description: payload.description,
          isActive: payload.isActive,
        })

        logger.info('Stylist profile created successfully.', { stylistId: newStylistProfile.id })
        return { success: true, message: STYLIST_MESSAGES.SERVER.CREATE_SUCCESS }
      } catch (profileError) {
        logger.error('Failed to create stylist profile. Initiating rollback...', {
          userId: user.id,
          error: profileError,
        })
        // --- ROLLBACK LOGIC ---
        await supabaseAdmin.auth.admin.deleteUser(user.id)
        logger.info('Auth user rolled back successfully.', { userId: user.id })
        throw new Error(STYLIST_MESSAGES.SERVER.CREATE_PROFILE_ERROR)
      }
    },

    /**
     * Ordonează actualizarea unui stilist.
     */
    async updateStylist(payload: UpdateStylistPayload) {
      const { id, ...dataToUpdate } = payload
      await _ensureUniqueness(dataToUpdate, id)
      logger.info('Attempting to update stylist...', { stylistId: id })

      await repository.update(id, dataToUpdate)

      logger.info('Stylist updated successfully.', { stylistId: id })
      return { success: true, message: STYLIST_MESSAGES.SERVER.UPDATE_SUCCESS }
    },

    /**
     * Ordonează ștergerea unui stilist.
     * Ștergerea din `public.stylists` se va face automat prin `ON DELETE CASCADE`.
     */
    async deleteStylist(stylistId: string) {
      logger.info('Attempting to delete stylist account...', { stylistId })

      const { error } = await supabaseAdmin.auth.admin.deleteUser(stylistId)

      if (error) {
        // Ignorăm eroarea dacă utilizatorul nu a fost găsit (poate a fost șters deja)
        if (error.name === 'NotFoundError') {
          logger.warn('Auth user not found during deletion, might have been already deleted.', { stylistId })
        } else {
          logger.error('Failed to delete auth user for stylist.', { stylistId, error })
          throw new Error(STYLIST_MESSAGES.SERVER.DELETE_ERROR)
        }
      }

      logger.info('Stylist account deleted successfully.', { stylistId })
      return { success: true, message: STYLIST_MESSAGES.SERVER.DELETE_SUCCESS }
    },
  }
}

// src/core/domains/stylists/stylist.service.ts

import type { SupabaseClient } from '@supabase/supabase-js'

import { APP_ROUTES } from '@/lib/constants'
import { DatabaseError, UniquenessError } from '@/lib/errors'
import { createLogger } from '@/lib/logger'

import { STYLIST_MESSAGES } from './stylist.constants'
import type { StylistRepository } from './stylist.repository'
import type { CreateStylistPayload, UpdateStylistPayload } from './stylist.types'

export function createStylistService(repository: StylistRepository, supabaseAdmin: SupabaseClient) {
  const logger = createLogger('StylistService')

  /**
   * Verifică proactiv unicitatea pentru email și telefon.
   */
  async function _ensureUniqueness(data: { email: string; phone?: string | null }, idToExclude?: string) {
    const errors: { field: string; message: string }[] = []

    const [existingByEmail, existingByPhone] = await Promise.all([
      repository.findByEmail(data.email),
      data.phone ? repository.findByPhone(data.phone) : Promise.resolve(null),
    ])

    if (existingByEmail && existingByEmail.id !== idToExclude) {
      errors.push({ field: 'email', message: STYLIST_MESSAGES.VALIDATION.INVALID_EMAIL })
    }
    if (existingByPhone && existingByPhone.id !== idToExclude) {
      errors.push({ field: 'phone', message: 'Numărul de telefon este deja folosit.' })
    }

    if (errors.length > 0) {
      throw new UniquenessError('Uniqueness validation failed', errors)
    }
  }

  return {
    getAllStylists: () => repository.findAll(),

    async createStylist(payload: CreateStylistPayload) {
      await _ensureUniqueness(payload)

      logger.info('Inviting auth user for new stylist...', { email: payload.email })
      const {
        data: { user },
        error: inviteError,
      } = await supabaseAdmin.auth.admin.inviteUserByEmail(payload.email, {
        redirectTo: APP_ROUTES.AUTH_CONFIRM, // asigură-te că această constantă este definită ca URL complet (ex: http://localhost:3000/auth/confirm)
      })

      if (inviteError || !user) {
        logger.error('Failed to create auth user.', { error: inviteError })
        throw new DatabaseError(STYLIST_MESSAGES.SERVER.CREATE_AUTH_ERROR, { cause: inviteError })
      }

      try {
        const newProfile = await repository.create({ ...payload, id: user.id, email: user.email! })
        logger.info('Stylist profile created successfully.', { stylistId: newProfile.id })
        return { success: true, message: STYLIST_MESSAGES.SERVER.CREATE_SUCCESS, data: newProfile }
      } catch (profileError) {
        logger.error('Failed to create stylist profile. Initiating auth user rollback...', {
          userId: user.id,
          error: profileError,
        })
        await supabaseAdmin.auth.admin.deleteUser(user.id)
        throw new DatabaseError(STYLIST_MESSAGES.SERVER.CREATE_PROFILE_ERROR, { cause: profileError })
      }
    },

    async updateStylist(payload: UpdateStylistPayload) {
      const { id, ...data } = payload
      await _ensureUniqueness(data, id)

      const updatedStylist = await repository.update(id, data)
      logger.info('Stylist updated successfully.', { stylistId: id })
      return { success: true, message: STYLIST_MESSAGES.SERVER.UPDATE_SUCCESS, data: updatedStylist }
    },

    async deleteStylist(stylistId: string) {
      logger.info('Attempting to delete stylist account and profile...', { stylistId })
      const { error } = await supabaseAdmin.auth.admin.deleteUser(stylistId)

      if (error && error.name !== 'NotFoundError') {
        logger.error('Failed to delete auth user.', { stylistId, error })
        throw new DatabaseError(STYLIST_MESSAGES.SERVER.DELETE_ERROR, { cause: error })
      }

      logger.info('Stylist account deleted successfully (profile cascade-deleted).', { stylistId })
      return { success: true, message: STYLIST_MESSAGES.SERVER.DELETE_SUCCESS }
    },
  }
}

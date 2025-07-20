// src/core/domains/appointments/appointment.service.ts

import { DatabaseError, NotFoundError } from '@/lib/errors'
import { createLogger } from '@/lib/logger'

import {
  APPOINTMENT_ERROR_MESSAGES,
  APPOINTMENT_SUCCESS_MESSAGES,
  APPOINTMENT_VALIDATION_MESSAGES,
} from './appointment.constants'
import type { AppointmentRepository } from './appointment.repository'
import type {
  AppointmentFilters,
  AppointmentService,
  AppointmentStatus,
  CreateAppointmentData,
  CreateAppointmentPayload,
  UpdateAppointmentData,
  UpdateAppointmentPayload,
} from './appointment.types'

/**
 * Business logic pentru gestionarea programărilor
 * Folosește Dependency Injection pattern și validatori centralizați
 */
export function createAppointmentService(repository: AppointmentRepository): AppointmentService {
  const logger = createLogger('AppointmentService')

  /**
   * Verifică disponibilitatea unui stilist într-un interval de timp
   */
  async function _checkAvailability(
    stylistId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string,
  ): Promise<boolean> {
    logger.debug('Se verifică disponibilitatea stilistului', {
      stylistId,
      startTime,
      endTime,
      excludeAppointmentId,
    })

    // Obține programările existente pentru stilist în intervalul specificat
    const existingAppointments = await repository.findByStylistAndDateRange(stylistId, startTime, endTime)

    // Filtrează programarea curentă dacă se exclude
    const conflictingAppointments = excludeAppointmentId
      ? existingAppointments.filter((app) => app.id !== excludeAppointmentId)
      : existingAppointments

    // Verifică conflictele
    const hasConflict = conflictingAppointments.some((app) => {
      // Un conflict există dacă intervalele se suprapun
      return (
        (app.startTime < endTime && app.endTime > startTime) || (startTime < app.endTime && endTime > app.startTime)
      )
    })

    const isAvailable = !hasConflict

    logger.debug('Rezultatul verificării disponibilității', {
      stylistId,
      startTime,
      endTime,
      isAvailable,
      conflictingAppointmentsCount: conflictingAppointments.length,
    })

    return isAvailable
  }

  return {
    /**
     * Obține toate programările
     */
    getAllAppointments: () => repository.findAll(),

    /**
     * Obține o programare după ID
     */
    async getAppointmentById(id: string) {
      if (!id?.trim()) {
        throw new Error(APPOINTMENT_VALIDATION_MESSAGES.ID_REQUIRED)
      }

      const appointment = await repository.findById(id)
      if (!appointment) {
        throw new NotFoundError(APPOINTMENT_ERROR_MESSAGES.NOT_FOUND)
      }
      return appointment
    },

    /**
     * Obține programările pentru un client
     */
    async getAppointmentsByClient(email: string) {
      return repository.findByClientEmail(email)
    },

    /**
     * Obține programările pentru un stilist
     */
    async getAppointmentsByStylist(stylistId: string) {
      return repository.findByStylistId(stylistId)
    },

    /**
     * Obține programările pentru un serviciu
     */
    async getAppointmentsByService(serviceId: string) {
      return repository.findByServiceId(serviceId)
    },

    /**
     * Obține programările după status
     */
    async getAppointmentsByStatus(status: AppointmentStatus) {
      return repository.findByStatus(status)
    },

    /**
     * Obține programările într-un interval de date
     */
    async getAppointmentsByDateRange(startDate: Date, endDate: Date) {
      return repository.findByDateRange(startDate, endDate)
    },

    /**
     * Obține programările cu detalii extinse
     */
    async getAppointmentsWithDetails(filters?: AppointmentFilters) {
      return repository.findWithDetails(filters)
    },

    /**
     * Creează o nouă programare
     */
    async createAppointment(payload: CreateAppointmentPayload) {
      logger.info('Se creează o nouă programare', {
        clientEmail: payload.clientEmail,
        serviceId: payload.serviceId,
        stylistId: payload.stylistId,
        startTime: payload.startTime,
      })

      // Verifică disponibilitatea
      const isAvailable = await _checkAvailability(
        payload.stylistId,
        new Date(payload.startTime),
        new Date(payload.endTime),
      )

      if (!isAvailable) {
        logger.warn('Conflict de programare detectat', {
          stylistId: payload.stylistId,
          startTime: payload.startTime,
          endTime: payload.endTime,
        })
        return {
          success: false,
          message: APPOINTMENT_ERROR_MESSAGES.TIME_CONFLICT,
          data: null as any,
        }
      }

      try {
        const appointmentData: CreateAppointmentData = {
          clientEmail: payload.clientEmail,
          clientName: payload.clientName,
          clientPhone: payload.clientPhone,
          clientNotes: payload.clientNotes,
          serviceId: payload.serviceId,
          stylistId: payload.stylistId,
          startTime: new Date(payload.startTime),
          endTime: new Date(payload.endTime),
          status: 'waiting',
        }

        const appointment = await repository.create(appointmentData)
        logger.info('Programarea a fost creată cu succes', { appointmentId: appointment.id })
        return { success: true, message: APPOINTMENT_SUCCESS_MESSAGES.CREATED, data: appointment }
      } catch (error: any) {
        logger.error('Eroare la crearea programării', { payload, error })
        throw new DatabaseError(APPOINTMENT_ERROR_MESSAGES.CREATE_FAILED, { cause: error })
      }
    },

    /**
     * Actualizează o programare existentă
     */
    async updateAppointment(payload: UpdateAppointmentPayload) {
      const { id, ...data } = payload

      if (!id?.trim()) {
        throw new Error(APPOINTMENT_VALIDATION_MESSAGES.ID_REQUIRED)
      }

      logger.info('Se actualizează programarea', { appointmentId: id })

      // Verifică dacă programarea există
      const existingAppointment = await repository.findById(id)
      if (!existingAppointment) {
        throw new NotFoundError(APPOINTMENT_ERROR_MESSAGES.NOT_FOUND)
      }

      // Verifică disponibilitatea dacă se schimbă timpul sau stilistul
      if (data.startTime || data.endTime || data.stylistId) {
        const startTime = data.startTime ? new Date(data.startTime) : existingAppointment.startTime
        const endTime = data.endTime ? new Date(data.endTime) : existingAppointment.endTime
        const stylistId = data.stylistId || existingAppointment.stylistId

        const isAvailable = await _checkAvailability(stylistId, startTime, endTime, id)

        if (!isAvailable) {
          logger.warn('Conflict de programare detectat la actualizare', {
            appointmentId: id,
            stylistId,
            startTime,
            endTime,
          })
          return {
            success: false,
            message: APPOINTMENT_ERROR_MESSAGES.TIME_CONFLICT,
            data: null as any,
          }
        }
      }

      try {
        const updateData: UpdateAppointmentData = {}

        if (data.clientEmail !== undefined) updateData.clientEmail = data.clientEmail
        if (data.clientName !== undefined) updateData.clientName = data.clientName
        if (data.clientPhone !== undefined) updateData.clientPhone = data.clientPhone
        if (data.clientNotes !== undefined) updateData.clientNotes = data.clientNotes
        if (data.serviceId !== undefined) updateData.serviceId = data.serviceId
        if (data.stylistId !== undefined) updateData.stylistId = data.stylistId
        if (data.startTime !== undefined) updateData.startTime = new Date(data.startTime)
        if (data.endTime !== undefined) updateData.endTime = new Date(data.endTime)
        if (data.status !== undefined) updateData.status = data.status

        const appointment = await repository.update(id, updateData)
        logger.info('Programarea a fost actualizată cu succes', { appointmentId: appointment.id })
        return { success: true, message: APPOINTMENT_SUCCESS_MESSAGES.UPDATED, data: appointment }
      } catch (error: any) {
        logger.error('Eroare la actualizarea programării', { payload, error })
        throw new DatabaseError(APPOINTMENT_ERROR_MESSAGES.UPDATE_FAILED, { cause: error })
      }
    },

    /**
     * Șterge o programare
     */
    async deleteAppointment(appointmentId: string) {
      if (!appointmentId?.trim()) {
        throw new Error(APPOINTMENT_VALIDATION_MESSAGES.ID_REQUIRED)
      }

      logger.info('Se șterge programarea', { appointmentId })

      // Verifică dacă programarea există
      const existingAppointment = await repository.findById(appointmentId)
      if (!existingAppointment) {
        throw new NotFoundError(APPOINTMENT_ERROR_MESSAGES.NOT_FOUND)
      }

      try {
        await repository.delete(appointmentId)
        logger.info('Programarea a fost ștearsă cu succes', { appointmentId })
        return { success: true, message: APPOINTMENT_SUCCESS_MESSAGES.DELETED }
      } catch (error: any) {
        logger.error('Eroare la ștergerea programării', { appointmentId, error })
        throw new DatabaseError(APPOINTMENT_ERROR_MESSAGES.DELETE_FAILED, { cause: error })
      }
    },

    /**
     * Actualizează statusul unei programări
     */
    async updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
      if (!appointmentId?.trim()) {
        throw new Error(APPOINTMENT_VALIDATION_MESSAGES.ID_REQUIRED)
      }

      logger.info('Se actualizează statusul programării', { appointmentId, status })

      // Verifică dacă programarea există
      const existingAppointment = await repository.findById(appointmentId)
      if (!existingAppointment) {
        throw new NotFoundError(APPOINTMENT_ERROR_MESSAGES.NOT_FOUND)
      }

      try {
        const appointment = await repository.updateStatus(appointmentId, status)
        logger.info('Statusul programării a fost actualizat cu succes', { appointmentId, status })
        return { success: true, message: APPOINTMENT_SUCCESS_MESSAGES.STATUS_UPDATED, data: appointment }
      } catch (error: any) {
        logger.error('Eroare la actualizarea statusului programării', { appointmentId, status, error })
        throw new DatabaseError(APPOINTMENT_ERROR_MESSAGES.STATUS_UPDATE_FAILED, { cause: error })
      }
    },

    /**
     * Validează datele pentru programare
     */
    async validateAppointmentData(data: CreateAppointmentData | UpdateAppointmentData): Promise<void> {
      // Validarea de bază este făcută de validatori
      // Aici putem adăuga validări de business logic suplimentare

      if ('startTime' in data && 'endTime' in data && data.startTime && data.endTime) {
        if (data.endTime <= data.startTime) {
          throw new Error(APPOINTMENT_VALIDATION_MESSAGES.END_TIME_BEFORE_START)
        }
      }

      // Verificări suplimentare pot fi adăugate aici
      // De exemplu: verificarea dacă stilistul oferă serviciul respectiv
    },

    /**
     * Verifică disponibilitatea unui stilist într-un interval de timp
     */
    async checkAvailability(
      stylistId: string,
      startTime: Date,
      endTime: Date,
      excludeAppointmentId?: string,
    ): Promise<boolean> {
      return _checkAvailability(stylistId, startTime, endTime, excludeAppointmentId)
    },
  }
}

export type { AppointmentService }

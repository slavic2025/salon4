// src/core/domains/appointments/appointment.validators.ts

import { z } from 'zod'

import { APPOINTMENT_VALIDATION_MESSAGES } from './appointment.constants'

// --- BASE VALIDATORS ---

/**
 * Validator pentru email-ul clientului
 */
const clientEmailValidator = z
  .string()
  .min(1, APPOINTMENT_VALIDATION_MESSAGES.EMAIL_REQUIRED)
  .email(APPOINTMENT_VALIDATION_MESSAGES.EMAIL_INVALID)
  .max(255, APPOINTMENT_VALIDATION_MESSAGES.EMAIL_MAX_LENGTH)

/**
 * Validator pentru numele clientului
 */
const clientNameValidator = z
  .string()
  .min(1, APPOINTMENT_VALIDATION_MESSAGES.CLIENT_NAME_REQUIRED)
  .min(2, APPOINTMENT_VALIDATION_MESSAGES.CLIENT_NAME_MIN_LENGTH)
  .max(100, APPOINTMENT_VALIDATION_MESSAGES.CLIENT_NAME_MAX_LENGTH)
  .regex(/^[a-zA-ZăâîșțĂÂÎȘȚ\s]+$/, APPOINTMENT_VALIDATION_MESSAGES.CLIENT_NAME_INVALID_FORMAT)

/**
 * Validator pentru telefonul clientului
 */
const clientPhoneValidator = z
  .string()
  .min(1, APPOINTMENT_VALIDATION_MESSAGES.CLIENT_PHONE_REQUIRED)
  .regex(/^(\+373|373|0)[0-9]{8}$/, APPOINTMENT_VALIDATION_MESSAGES.CLIENT_PHONE_INVALID_FORMAT)

/**
 * Validator pentru notele clientului
 */
const clientNotesValidator = z.string().max(500, APPOINTMENT_VALIDATION_MESSAGES.CLIENT_NOTES_MAX_LENGTH).optional()

/**
 * Validator pentru ID-ul serviciului
 */
const serviceIdValidator = z
  .string()
  .min(1, APPOINTMENT_VALIDATION_MESSAGES.SERVICE_ID_REQUIRED)
  .uuid(APPOINTMENT_VALIDATION_MESSAGES.SERVICE_ID_INVALID)

/**
 * Validator pentru ID-ul stilistului
 */
const stylistIdValidator = z
  .string()
  .min(1, APPOINTMENT_VALIDATION_MESSAGES.STYLIST_ID_REQUIRED)
  .uuid(APPOINTMENT_VALIDATION_MESSAGES.STYLIST_ID_INVALID)

/**
 * Validator pentru timpul de început
 */
const startTimeValidator = z
  .string()
  .min(1, APPOINTMENT_VALIDATION_MESSAGES.START_TIME_REQUIRED)
  .refine((value) => !isNaN(Date.parse(value)), APPOINTMENT_VALIDATION_MESSAGES.START_TIME_INVALID)
  .refine((value) => new Date(value) > new Date(), APPOINTMENT_VALIDATION_MESSAGES.START_TIME_PAST)

/**
 * Validator pentru timpul de sfârșit
 */
const endTimeValidator = z
  .string()
  .min(1, APPOINTMENT_VALIDATION_MESSAGES.END_TIME_REQUIRED)
  .refine((value) => !isNaN(Date.parse(value)), APPOINTMENT_VALIDATION_MESSAGES.END_TIME_INVALID)

/**
 * Validator pentru statusul programării
 */
const statusValidator = z.enum(['waiting', 'confirmed', 'refused', 'cancelled', 'completed', 'no_show'], {
  errorMap: () => ({ message: APPOINTMENT_VALIDATION_MESSAGES.STATUS_INVALID }),
})

/**
 * Validator pentru ID-ul programării
 */
const appointmentIdValidator = z
  .string()
  .min(1, APPOINTMENT_VALIDATION_MESSAGES.ID_REQUIRED)
  .uuid(APPOINTMENT_VALIDATION_MESSAGES.ID_INVALID)

// --- FORM VALIDATORS ---

/**
 * Validator pentru formularul de creare programare
 */
export const CreateAppointmentFormValidator = z.object({
  clientEmail: clientEmailValidator,
  clientName: clientNameValidator,
  clientPhone: clientPhoneValidator,
  clientNotes: clientNotesValidator,
  serviceId: serviceIdValidator,
  stylistId: stylistIdValidator,
  startTime: startTimeValidator,
  endTime: endTimeValidator,
})

/**
 * Validator pentru formularul de actualizare programare
 */
export const UpdateAppointmentFormValidator = z.object({
  clientEmail: clientEmailValidator.optional(),
  clientName: clientNameValidator.optional(),
  clientPhone: clientPhoneValidator.optional(),
  clientNotes: clientNotesValidator,
  serviceId: serviceIdValidator.optional(),
  stylistId: stylistIdValidator.optional(),
  startTime: startTimeValidator.optional(),
  endTime: endTimeValidator.optional(),
  status: statusValidator.optional(),
})

// --- ACTION VALIDATORS ---

/**
 * Validator pentru acțiunea de creare programare
 */
export const CreateAppointmentActionSchema = z
  .object({
    clientEmail: clientEmailValidator,
    clientName: clientNameValidator,
    clientPhone: clientPhoneValidator,
    clientNotes: clientNotesValidator,
    serviceId: serviceIdValidator,
    stylistId: stylistIdValidator,
    startTime: startTimeValidator,
    endTime: endTimeValidator,
  })
  .refine(
    (data) => {
      const startTime = new Date(data.startTime)
      const endTime = new Date(data.endTime)
      return endTime > startTime
    },
    {
      message: APPOINTMENT_VALIDATION_MESSAGES.END_TIME_BEFORE_START,
      path: ['endTime'],
    },
  )

/**
 * Validator pentru acțiunea de actualizare programare
 */
export const UpdateAppointmentActionSchema = z
  .object({
    id: appointmentIdValidator,
    clientEmail: clientEmailValidator.optional(),
    clientName: clientNameValidator.optional(),
    clientPhone: clientPhoneValidator.optional(),
    clientNotes: clientNotesValidator,
    serviceId: serviceIdValidator.optional(),
    stylistId: stylistIdValidator.optional(),
    startTime: startTimeValidator.optional(),
    endTime: endTimeValidator.optional(),
    status: statusValidator.optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        const startTime = new Date(data.startTime)
        const endTime = new Date(data.endTime)
        return endTime > startTime
      }
      return true
    },
    {
      message: APPOINTMENT_VALIDATION_MESSAGES.END_TIME_BEFORE_START,
      path: ['endTime'],
    },
  )

/**
 * Validator pentru acțiunea de ștergere programare
 */
export const DeleteAppointmentActionSchema = z.object({
  id: appointmentIdValidator,
})

/**
 * Validator pentru acțiunea de actualizare status programare
 */
export const UpdateAppointmentStatusActionSchema = z.object({
  id: appointmentIdValidator,
  status: statusValidator,
})

// --- EXPORT TYPES ---

export type CreateAppointmentFormData = z.infer<typeof CreateAppointmentFormValidator>
export type UpdateAppointmentFormData = z.infer<typeof UpdateAppointmentFormValidator>

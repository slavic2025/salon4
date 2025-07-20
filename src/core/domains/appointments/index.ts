// src/core/domains/appointments/index.ts

// --- TYPES ---
export type {
  Appointment,
  AppointmentData,
  AppointmentFilters,
  AppointmentFormValues,
  AppointmentRepository,
  AppointmentService,
  AppointmentStatus,
  AppointmentWithDetails,
  CreateAppointmentData,
  CreateAppointmentPayload,
  DeleteAppointmentPayload,
  NewAppointment,
  UpdateAppointmentData,
  UpdateAppointmentPayload,
  UpdateAppointmentStatusPayload,
} from './appointment.types'

// --- CONSTANTS ---
export {
  APPOINTMENT_ADMIN_UI_MESSAGES,
  APPOINTMENT_ERROR_MESSAGES,
  APPOINTMENT_FORMATS,
  APPOINTMENT_LIMITS,
  APPOINTMENT_MESSAGES,
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_DESCRIPTIONS,
  APPOINTMENT_STATUS_ICONS,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUSES,
  APPOINTMENT_SUCCESS_MESSAGES,
  APPOINTMENT_VALIDATION_MESSAGES,
} from './appointment.constants'

// --- VALIDATORS ---
export type { CreateAppointmentFormData, UpdateAppointmentFormData } from './appointment.validators'
export {
  CreateAppointmentActionSchema,
  CreateAppointmentFormValidator,
  DeleteAppointmentActionSchema,
  UpdateAppointmentActionSchema,
  UpdateAppointmentFormValidator,
  UpdateAppointmentStatusActionSchema,
} from './appointment.validators'

// --- REPOSITORY ---
export { AppointmentRepositoryImpl, createAppointmentRepository } from './appointment.repository'

// --- SERVICE ---
export { AppointmentServiceImpl, createAppointmentService } from './appointment.service'

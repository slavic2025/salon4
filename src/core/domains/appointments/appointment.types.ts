// src/core/domains/appointments/appointment.types.ts

import { z } from 'zod'

import { appointments } from '@/db/schema/appointments'

// --- DATABASE TYPES ---

/**
 * Tip pentru tabela appointments din DB
 */
export type Appointment = typeof appointments.$inferSelect
export type NewAppointment = typeof appointments.$inferInsert

// --- ENUM TYPES ---

/**
 * Tipuri pentru enum-uri
 */
export type AppointmentStatus = 'waiting' | 'confirmed' | 'refused' | 'cancelled' | 'completed' | 'no_show'

// --- BUSINESS TYPES ---

/**
 * Date de bază pentru appointment (fără ID și timestamps)
 */
export interface AppointmentData {
  clientEmail: string
  clientName: string
  clientPhone: string
  clientNotes?: string | null
  serviceId: string
  stylistId: string
  startTime: Date
  endTime: Date
  status: AppointmentStatus
}

/**
 * Date pentru creare appointment
 */
export interface CreateAppointmentData extends AppointmentData {}

/**
 * Date pentru actualizare appointment (toate câmpurile opționale)
 */
export interface UpdateAppointmentData extends Partial<AppointmentData> {}

/**
 * Filtru pentru căutarea programărilor
 */
export interface AppointmentFilters {
  status?: AppointmentStatus
  stylistId?: string
  serviceId?: string
  clientEmail?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

/**
 * Date pentru programări cu informații extinse
 */
export interface AppointmentWithDetails extends Appointment {
  service?: {
    id: string
    name: string
    price: string
    duration: number
  } | null
  stylist?: {
    id: string
    fullName: string
    email: string
  } | null
}

// --- REPOSITORY INTERFACE ---

export interface AppointmentRepository {
  findAll(): Promise<Appointment[]>
  findById(id: string): Promise<Appointment | undefined>
  findByClientEmail(email: string): Promise<Appointment[]>
  findByStylistId(stylistId: string): Promise<Appointment[]>
  findByServiceId(serviceId: string): Promise<Appointment[]>
  findByStatus(status: AppointmentStatus): Promise<Appointment[]>
  findByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]>
  findByStylistAndDateRange(stylistId: string, startDate: Date, endDate: Date): Promise<Appointment[]>
  findByStylistIdsAndDateRange(stylistIds: string[], startDate: Date, endDate: Date): Promise<Appointment[]>
  findWithDetails(filters?: AppointmentFilters): Promise<AppointmentWithDetails[]>
  create(newAppointment: CreateAppointmentData): Promise<Appointment>
  update(id: string, data: UpdateAppointmentData): Promise<Appointment>
  delete(id: string): Promise<void>
  updateStatus(id: string, status: AppointmentStatus): Promise<Appointment>
}

// --- SERVICE INTERFACE ---

export interface AppointmentService {
  getAllAppointments(): Promise<Appointment[]>
  getAppointmentById(id: string): Promise<Appointment | null>
  getAppointmentsByClient(email: string): Promise<Appointment[]>
  getAppointmentsByStylist(stylistId: string): Promise<Appointment[]>
  getAppointmentsByStylistIds(stylistIds: string[], startDate: Date, endDate: Date): Promise<Appointment[]>
  getAppointmentsByService(serviceId: string): Promise<Appointment[]>
  getAppointmentsByStatus(status: AppointmentStatus): Promise<Appointment[]>
  getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]>
  getAppointmentsWithDetails(filters?: AppointmentFilters): Promise<AppointmentWithDetails[]>
  createAppointment(payload: CreateAppointmentPayload): Promise<{
    success: boolean
    message: string
    data: Appointment
  }>
  updateAppointment(payload: UpdateAppointmentPayload): Promise<{
    success: boolean
    message: string
    data: Appointment
  }>
  deleteAppointment(appointmentId: string): Promise<{
    success: boolean
    message: string
  }>
  updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus,
  ): Promise<{
    success: boolean
    message: string
    data: Appointment
  }>
  validateAppointmentData(data: CreateAppointmentData | UpdateAppointmentData): Promise<void>
  checkAvailability(stylistId: string, startTime: Date, endTime: Date, excludeAppointmentId?: string): Promise<boolean>
}

// --- RE-EXPORT VALIDATORS ---
// Re-exportăm validatori din validators.ts pentru a păstra compatibilitatea

import {
  CreateAppointmentActionSchema,
  CreateAppointmentFormValidator,
  DeleteAppointmentActionSchema,
  UpdateAppointmentActionSchema,
  UpdateAppointmentStatusActionSchema,
} from './appointment.validators'

export type { CreateAppointmentFormData, UpdateAppointmentFormData } from './appointment.validators'
export {
  CreateAppointmentActionSchema,
  CreateAppointmentFormValidator,
  DeleteAppointmentActionSchema,
  UpdateAppointmentActionSchema,
  UpdateAppointmentFormValidator,
  UpdateAppointmentStatusActionSchema,
} from './appointment.validators'

// --- ACTION PAYLOAD TYPES ---
// Derivate din validatori pentru type safety

export type CreateAppointmentPayload = z.infer<typeof CreateAppointmentActionSchema>
export type UpdateAppointmentPayload = z.infer<typeof UpdateAppointmentActionSchema>
export type DeleteAppointmentPayload = z.infer<typeof DeleteAppointmentActionSchema>
export type UpdateAppointmentStatusPayload = z.infer<typeof UpdateAppointmentStatusActionSchema>

// --- FORM TYPES ---
// Pentru compatibilitate cu UI

export type AppointmentFormValues = z.infer<typeof CreateAppointmentFormValidator>

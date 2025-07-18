// src/core/domains/work-schedule/workSchedule.types.ts

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { workSchedules } from '@/db/schema/work-schedules'

// --- DATABASE TYPES ---

/**
 * Tipuri de bază generate din Schema Drizzle
 */
export const selectWorkScheduleSchema = createSelectSchema(workSchedules)
export const insertWorkScheduleSchema = createInsertSchema(workSchedules)

export type WorkSchedule = typeof workSchedules.$inferSelect
export type NewWorkSchedule = typeof workSchedules.$inferInsert

// --- BUSINESS TYPES ---

/**
 * Tipuri pentru ziua săptămânii
 */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

/**
 * Date de bază pentru work schedule (fără ID și timestamps)
 */
export interface WorkScheduleData {
  stylistId: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
}

/**
 * Date pentru creare work schedule
 */
export interface CreateWorkScheduleData extends WorkScheduleData {}

/**
 * Date pentru actualizare work schedule (toate câmpurile opționale)
 */
export interface UpdateWorkScheduleData extends Partial<WorkScheduleData> {}

// --- REPOSITORY INTERFACE ---

export interface WorkScheduleRepository {
  findAll(): Promise<WorkSchedule[]>
  findById(id: string): Promise<WorkSchedule | undefined>
  findByStylistId(stylistId: string): Promise<WorkSchedule[]>
  findByStylistAndDay(stylistId: string, dayOfWeek: DayOfWeek): Promise<WorkSchedule[]>
  checkTimeOverlap(
    stylistId: string,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    excludeId?: string,
  ): Promise<WorkSchedule[]>
  create(newSchedule: CreateWorkScheduleData): Promise<WorkSchedule>
  update(id: string, data: Partial<CreateWorkScheduleData>): Promise<WorkSchedule>
  delete(id: string): Promise<void>
  deleteByStylistId(stylistId: string): Promise<void>
  findByMultipleStylists(stylistIds: string[]): Promise<WorkSchedule[]>
}

// --- SERVICE INTERFACE ---

export interface WorkScheduleService {
  getAllSchedules(): Promise<WorkSchedule[]>
  getStylistSchedule(stylistId: string): Promise<StylistWeeklySchedule>
  getScheduleForDay(stylistId: string, dayOfWeek: DayOfWeek): Promise<WorkSchedule[]>
  getScheduleById(id: string): Promise<WorkSchedule>
  createSchedule(payload: CreateWorkSchedulePayload): Promise<{
    success: boolean
    message: string
    data: WorkSchedule
  }>
  updateSchedule(payload: UpdateWorkSchedulePayload): Promise<{
    success: boolean
    message: string
    data: WorkSchedule
  }>
  deleteSchedule(scheduleId: string): Promise<{
    success: boolean
    message: string
  }>
  deleteAllStylistSchedules(stylistId: string): Promise<{
    success: boolean
    message: string
  }>
  getMultipleStylists(stylistIds: string[]): Promise<StylistWeeklySchedule[]>
  isStylistAvailable(stylistId: string, dayOfWeek: DayOfWeek, startTime: string, endTime: string): Promise<boolean>
}

// --- DISPLAY TYPES ---

/**
 * Tip pentru programul grupat pe zile
 */
export type WorkSchedulesByDay = {
  [key in DayOfWeek]?: WorkSchedule[]
}

/**
 * Tip pentru intervalul de timp
 */
export type TimeInterval = {
  start: string
  end: string
}

/**
 * Tip pentru programul unui stilist organizat pe zile
 */
export type StylistWeeklySchedule = {
  stylistId: string
  stylistName?: string
  schedule: WorkSchedulesByDay
}

// --- RE-EXPORT VALIDATORS ---
// Re-exportăm validatori din validators.ts pentru a păstra compatibilitatea

import {
  CheckOverlapSchema,
  CreateWorkScheduleActionSchema,
  DeleteWorkScheduleActionSchema,
  UpdateWorkScheduleActionSchema,
} from './workSchedule.validators'

export type { CreateWorkScheduleFormData, UpdateWorkScheduleFormData } from './workSchedule.validators'
export {
  CheckOverlapSchema,
  CreateWorkScheduleActionSchema,
  CreateWorkScheduleFormValidator,
  DeleteWorkScheduleActionSchema,
  UpdateWorkScheduleActionSchema,
  UpdateWorkScheduleFormValidator,
} from './workSchedule.validators'

// --- ACTION PAYLOAD TYPES ---
// Derivate din validatori pentru type safety

export type CreateWorkSchedulePayload = z.infer<typeof CreateWorkScheduleActionSchema>
export type UpdateWorkSchedulePayload = z.infer<typeof UpdateWorkScheduleActionSchema>
export type DeleteWorkSchedulePayload = z.infer<typeof DeleteWorkScheduleActionSchema>
export type CheckOverlapPayload = z.infer<typeof CheckOverlapSchema>

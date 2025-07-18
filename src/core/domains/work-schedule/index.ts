// src/core/domains/work-schedule/index.ts

// Types & Interfaces
export type {
  CheckOverlapPayload,
  CreateWorkScheduleData,
  CreateWorkSchedulePayload,
  DayOfWeek,
  DeleteWorkSchedulePayload,
  NewWorkSchedule,
  StylistWeeklySchedule,
  TimeInterval,
  UpdateWorkScheduleData,
  UpdateWorkSchedulePayload,
  WorkSchedule,
  WorkScheduleData,
  WorkScheduleRepository,
  WorkSchedulesByDay,
  WorkScheduleService,
} from './workSchedule.types'

// Constants
export { DAY_NAMES, DAYS_OF_WEEK, WORK_SCHEDULE_MESSAGES } from './workSchedule.constants'

// Validators
export type {
  CheckOverlapData,
  CreateWorkScheduleFormData,
  UpdateWorkScheduleFormData,
  WorkScheduleFiltersData,
} from './workSchedule.validators'
export {
  CheckOverlapSchema,
  CreateWorkScheduleActionSchema,
  CreateWorkScheduleFormValidator,
  DeleteWorkScheduleActionSchema,
  formatValidationErrors,
  UpdateWorkScheduleActionSchema,
  UpdateWorkScheduleFormValidator,
  validateTimeRange,
  validateWorkScheduleData,
  WorkScheduleFiltersValidator,
} from './workSchedule.validators'

// Repository & Service Factory Functions
export { createWorkScheduleRepository } from './workSchedule.repository'
export { createWorkScheduleService } from './workSchedule.service'

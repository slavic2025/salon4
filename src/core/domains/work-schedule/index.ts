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
export { convertJsDayToAppDay, DAY_NAMES, DAYS_OF_WEEK, WORK_SCHEDULE_MESSAGES } from './workSchedule.constants'

// Validators
export {
  CreateWorkScheduleFormValidator,
  formatValidationErrors,
  UpdateWorkScheduleFormValidator,
  validateTimeRange,
} from './workSchedule.validators'

// Repository & Service
export { createWorkScheduleRepository } from './workSchedule.repository'
export { createWorkScheduleService } from './workSchedule.service'

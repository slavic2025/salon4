// src/core/domains/unavailability/index.ts

// Types & Interfaces
export type {
  CreateUnavailabilityData,
  CreateUnavailabilityPayload,
  NewUnavailability,
  Unavailability,
  UnavailabilityCause,
  UnavailabilityData,
  UnavailabilityFilters,
  UnavailabilityFormData,
  UnavailabilityRepository,
  UnavailabilityService,
  UnavailabilityWithStylist,
  UpdateUnavailabilityData,
  UpdateUnavailabilityPayload,
} from './unavailability.types'
export {
  CreateUnavailabilityActionSchema,
  UnavailabilityFormSchema,
  UpdateUnavailabilityActionSchema,
} from './unavailability.types'

// Constants
export {
  UNAVAILABILITY_CAUSE_DESCRIPTIONS,
  UNAVAILABILITY_CAUSE_LABELS,
  UNAVAILABILITY_CAUSES,
  UNAVAILABILITY_COLORS,
  UNAVAILABILITY_ERROR_MESSAGES,
  UNAVAILABILITY_FORMATS,
  UNAVAILABILITY_ICONS,
  UNAVAILABILITY_LIMITS,
  UNAVAILABILITY_SUCCESS_MESSAGES,
  UNAVAILABILITY_VALIDATION_MESSAGES,
} from './unavailability.constants'

// Validators
export type {
  BulkUnavailabilityData,
  ConflictCheckData,
  CreateUnavailabilityFormData,
  UnavailabilityFiltersData,
  UpdateUnavailabilityFormData,
} from './unavailability.validators'
export {
  BulkUnavailabilityValidator,
  CauseValidator,
  ConflictCheckValidator,
  CreateUnavailabilityFormValidator,
  DateValidator,
  DescriptionValidator,
  formatValidationErrors,
  TimeValidator,
  UnavailabilityFiltersValidator,
  UpdateUnavailabilityFormValidator,
  UuidValidator,
  validateFutureDate,
  validateTimeRange,
} from './unavailability.validators'

// Repository & Service Factory Functions
export { createUnavailabilityRepository } from './unavailability.repository'
export { createUnavailabilityService } from './unavailability.service'

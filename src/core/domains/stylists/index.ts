// src/core/domains/stylists/index.ts

// Types & Interfaces
export type {
  CreateStylistData,
  CreateStylistPayload,
  DeleteStylistPayload,
  NewStylist,
  Stylist,
  StylistData,
  StylistFilters,
  StylistRepository,
  StylistService,
  UpdateStylistData,
  UpdateStylistPayload,
} from './stylist.types'

// Constants
export {
  STYLIST_ERROR_MESSAGES,
  STYLIST_LIMITS,
  STYLIST_MESSAGES,
  STYLIST_SUCCESS_MESSAGES,
  STYLIST_UI_MESSAGES,
  STYLIST_VALIDATION_MESSAGES,
} from './stylist.constants'

// Validators
export type { StylistFiltersData, StylistFormData, UpdateStylistFormData } from './stylist.validators'
export {
  CreateStylistActionSchema,
  DeleteStylistActionSchema,
  formatValidationErrors,
  StylistFormValidator,
  UpdateStylistActionSchema,
  UpdateStylistFormValidator,
  validateStylistData,
  validateUpdateStylistData,
} from './stylist.validators'

// Repository & Service Factory Functions
export { createStylistRepository } from './stylist.repository'
export { createStylistService } from './stylist.service'

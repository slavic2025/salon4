// src/core/domains/services/index.ts

// Types & Interfaces
export type {
  CreateServiceData,
  CreateServicePayload,
  DeleteServicePayload,
  NewService,
  Service,
  ServiceCategory,
  ServiceData,
  ServiceFilters,
  ServiceFormValues,
  ServiceRepository,
  ServiceService,
  UpdateServiceData,
  UpdateServicePayload,
} from './service.types'

// Constants
export {
  SERVICE_ADMIN_UI_MESSAGES,
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_COLORS,
  SERVICE_CATEGORY_DESCRIPTIONS,
  SERVICE_CATEGORY_ICONS,
  SERVICE_CATEGORY_LABELS,
  SERVICE_ERROR_MESSAGES,
  SERVICE_FORMATS,
  SERVICE_LIMITS,
  SERVICE_MESSAGES,
  SERVICE_SUCCESS_MESSAGES,
  SERVICE_VALIDATION_MESSAGES,
} from './service.constants'

// Validators
export type {
  BulkServiceData,
  CreateServiceFormData,
  ServiceFiltersData,
  UpdateServiceFormData,
} from './service.validators'
export {
  BulkServiceValidator,
  CategoryValidator,
  CreateServiceActionSchema,
  CreateServiceFormValidator,
  DeleteServiceActionSchema,
  DescriptionValidator,
  DurationValidator,
  formatValidationErrors,
  IsActiveValidator,
  NameValidator,
  PriceValidator,
  ServiceFiltersValidator,
  UpdateServiceActionSchema,
  UpdateServiceFormValidator,
  UuidValidator,
  validateDuration,
  validatePrice,
  validateServiceData,
  validateServiceName,
  validateUpdateServiceData,
} from './service.validators'

// Repository & Service Factory Functions
export { createServiceRepository } from './service.repository'
export { createServiceService } from './service.service'

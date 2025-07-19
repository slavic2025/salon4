// src/core/domains/auth/index.ts

// Types & Interfaces
export type {
  AuthRepository,
  AuthResult,
  AuthService,
  SetPasswordData,
  SetPasswordPayload,
  SetPasswordWithTokenData,
  SetPasswordWithTokenPayload,
  SignInData,
  SignInPayload,
} from './auth.types'

// Constants
export {
  AUTH_ERROR_MESSAGES,
  AUTH_LIMITS,
  AUTH_LOG_MESSAGES,
  AUTH_MESSAGES,
  AUTH_SERVER_MESSAGES,
  AUTH_SUCCESS_MESSAGES,
  AUTH_UI_MESSAGES,
  AUTH_VALIDATION_MESSAGES,
  ROLE_DASHBOARD_MAP,
} from './auth.constants'

// Validators
export type {
  SetPasswordActionData,
  SetPasswordFormData,
  SetPasswordWithTokenActionData,
  SignInActionData,
  SignInFormData,
} from './auth.validators'
export {
  formatValidationErrors,
  SetPasswordActionValidator,
  SetPasswordFormValidator,
  SetPasswordWithTokenActionValidator,
  SignInActionValidator,
  SignInFormValidator,
  validateSetPasswordData,
  validateSignInData,
} from './auth.validators'

// Repository & Service Factory Functions
export { createAuthRepository } from './auth.repository'
export { createAuthService } from './auth.service'

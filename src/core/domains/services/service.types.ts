// src/core/domains/services/service.types.ts

import { z } from 'zod'

import { services } from '@/db/schema/services'

// --- DATABASE TYPES ---

/**
 * Tip pentru tabela services din DB
 */
export type Service = typeof services.$inferSelect
export type NewService = typeof services.$inferInsert

// --- ENUM TYPES ---

/**
 * Tipuri pentru enum-uri
 */
export type ServiceCategory = 'haircut' | 'coloring' | 'styling' | 'treatment' | 'other'

// --- BUSINESS TYPES ---

/**
 * Date de bază pentru service (fără ID și timestamps)
 */
export interface ServiceData {
  name: string
  description: string
  price: string
  duration: number
  category: ServiceCategory
  isActive: boolean
}

/**
 * Date pentru creare service
 */
export interface CreateServiceData extends ServiceData {}

/**
 * Date pentru actualizare service (toate câmpurile opționale)
 */
export interface UpdateServiceData extends Partial<ServiceData> {}

/**
 * Filtru pentru căutarea serviciilor
 */
export interface ServiceFilters {
  category?: ServiceCategory
  isActive?: boolean
  search?: string
  limit?: number
  offset?: number
}

// --- REPOSITORY INTERFACE ---

export interface ServiceRepository {
  findAll(): Promise<Service[]>
  findById(id: string): Promise<Service | undefined>
  findByName(name: string): Promise<Service | undefined>
  findByCategory(category: ServiceCategory): Promise<Service[]>
  findActive(): Promise<Service[]>
  create(newService: CreateServiceData): Promise<Service>
  update(id: string, data: UpdateServiceData): Promise<Service>
  delete(id: string): Promise<void>
}

// --- SERVICE INTERFACE ---

export interface ServiceService {
  getAllServices(): Promise<Service[]>
  getServiceById(id: string): Promise<Service | null>
  getServicesByCategory(category: ServiceCategory): Promise<Service[]>
  getActiveServices(): Promise<Service[]>
  createService(payload: CreateServicePayload): Promise<{
    success: boolean
    message: string
    data: Service
  }>
  updateService(payload: UpdateServicePayload): Promise<{
    success: boolean
    message: string
    data: Service
  }>
  deleteService(serviceId: string): Promise<{
    success: boolean
    message: string
  }>
  validateServiceData(data: CreateServiceData | UpdateServiceData): Promise<void>
}

// --- RE-EXPORT VALIDATORS ---
// Re-exportăm validatori din validators.ts pentru a păstra compatibilitatea

import {
  CreateServiceActionSchema,
  CreateServiceFormValidator,
  DeleteServiceActionSchema,
  UpdateServiceActionSchema,
} from './service.validators'

export type { CreateServiceFormData, UpdateServiceFormData } from './service.validators'
export {
  CreateServiceActionSchema,
  CreateServiceFormValidator,
  DeleteServiceActionSchema,
  UpdateServiceActionSchema,
  UpdateServiceFormValidator,
} from './service.validators'

// --- ACTION PAYLOAD TYPES ---
// Derivate din validatori pentru type safety

export type CreateServicePayload = z.infer<typeof CreateServiceActionSchema>
export type UpdateServicePayload = z.infer<typeof UpdateServiceActionSchema>
export type DeleteServicePayload = z.infer<typeof DeleteServiceActionSchema>

// --- FORM TYPES ---
// Pentru compatibilitate cu UI

export type ServiceFormValues = z.infer<typeof CreateServiceFormValidator>

// src/core/domains/appointments/appointment.repository.ts

import { and, asc, desc, eq, gte, lte } from 'drizzle-orm'

import { type DbClient } from '@/db'
import { appointments } from '@/db/schema/_schema'

import type {
  Appointment,
  AppointmentFilters,
  AppointmentRepository,
  AppointmentStatus,
  AppointmentWithDetails,
  CreateAppointmentData,
  UpdateAppointmentData,
} from './appointment.types'

/**
 * Repository pentru gestionarea programărilor cu Drizzle ORM
 * Folosește Dependency Injection pattern
 */
export function createAppointmentRepository(db: DbClient): AppointmentRepository {
  const TABLE = appointments

  const defaultOrderBy = {
    orderBy: [desc(appointments.createdAt)],
  }

  return {
    /**
     * Găsește toate programările
     */
    async findAll(): Promise<Appointment[]> {
      return db.query.appointments.findMany(defaultOrderBy)
    },

    /**
     * Găsește o programare după ID
     */
    async findById(id: string): Promise<Appointment | undefined> {
      return db.query.appointments.findFirst({
        where: eq(TABLE.id, id),
      })
    },

    /**
     * Găsește programările după email-ul clientului
     */
    async findByClientEmail(email: string): Promise<Appointment[]> {
      return db.query.appointments.findMany({
        where: eq(TABLE.clientEmail, email),
        orderBy: [desc(appointments.startTime)],
      })
    },

    /**
     * Găsește programările după ID-ul stilistului
     */
    async findByStylistId(stylistId: string): Promise<Appointment[]> {
      return db.query.appointments.findMany({
        where: eq(TABLE.stylistId, stylistId),
        orderBy: [desc(appointments.startTime)],
      })
    },

    /**
     * Găsește programările după ID-ul serviciului
     */
    async findByServiceId(serviceId: string): Promise<Appointment[]> {
      return db.query.appointments.findMany({
        where: eq(TABLE.serviceId, serviceId),
        orderBy: [desc(appointments.startTime)],
      })
    },

    /**
     * Găsește programările după status
     */
    async findByStatus(status: AppointmentStatus): Promise<Appointment[]> {
      return db.query.appointments.findMany({
        where: eq(TABLE.status, status),
        orderBy: [desc(appointments.startTime)],
      })
    },

    /**
     * Găsește programările într-un interval de date
     */
    async findByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
      return db.query.appointments.findMany({
        where: and(gte(TABLE.startTime, startDate), lte(TABLE.startTime, endDate)),
        orderBy: [asc(appointments.startTime)],
      })
    },

    /**
     * Găsește programările pentru un stilist într-un interval de date
     */
    async findByStylistAndDateRange(stylistId: string, startDate: Date, endDate: Date): Promise<Appointment[]> {
      return db.query.appointments.findMany({
        where: and(eq(TABLE.stylistId, stylistId), gte(TABLE.startTime, startDate), lte(TABLE.startTime, endDate)),
        orderBy: [asc(appointments.startTime)],
      })
    },

    /**
     * Găsește programările cu detalii extinse (serviciu și stilist)
     */
    async findWithDetails(filters?: AppointmentFilters): Promise<AppointmentWithDetails[]> {
      const conditions = []

      if (filters?.status) {
        conditions.push(eq(TABLE.status, filters.status))
      }

      if (filters?.stylistId) {
        conditions.push(eq(TABLE.stylistId, filters.stylistId))
      }

      if (filters?.serviceId) {
        conditions.push(eq(TABLE.serviceId, filters.serviceId))
      }

      if (filters?.clientEmail) {
        conditions.push(eq(TABLE.clientEmail, filters.clientEmail))
      }

      if (filters?.startDate && filters?.endDate) {
        conditions.push(and(gte(TABLE.startTime, filters.startDate), lte(TABLE.startTime, filters.endDate)))
      }

      return db.query.appointments.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        with: {
          service: {
            columns: {
              id: true,
              name: true,
              price: true,
              duration: true,
            },
          },
          stylist: {
            columns: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        limit: filters?.limit,
        offset: filters?.offset,
        orderBy: [desc(appointments.startTime)],
      })
    },

    /**
     * Creează o nouă programare
     */
    async create(newAppointment: CreateAppointmentData): Promise<Appointment> {
      const [appointment] = await db.insert(TABLE).values(newAppointment).returning()
      return appointment
    },

    /**
     * Actualizează o programare existentă
     */
    async update(id: string, data: UpdateAppointmentData): Promise<Appointment> {
      const [appointment] = await db
        .update(TABLE)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(TABLE.id, id))
        .returning()
      return appointment
    },

    /**
     * Șterge o programare
     */
    async delete(id: string): Promise<void> {
      await db.delete(TABLE).where(eq(TABLE.id, id))
    },

    /**
     * Actualizează doar statusul unei programări
     */
    async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
      const [appointment] = await db
        .update(TABLE)
        .set({ status, updatedAt: new Date() })
        .where(eq(TABLE.id, id))
        .returning()
      return appointment
    },
  }
}

export type { AppointmentRepository }

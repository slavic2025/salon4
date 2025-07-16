// src/core/domains/work-schedule/workSchedule.service.ts

import { DatabaseError, NotFoundError, UniquenessError } from '@/lib/errors'
import { createLogger } from '@/lib/logger'

import { DAY_NAMES, WORK_SCHEDULE_MESSAGES } from './workSchedule.constants'
import type { WorkScheduleRepository } from './workSchedule.repository'
import type {
  CreateWorkSchedulePayload,
  DayOfWeek,
  StylistWeeklySchedule,
  UpdateWorkSchedulePayload,
  WorkSchedule,
  WorkSchedulesByDay,
} from './workSchedule.types'

export function createWorkScheduleService(repository: WorkScheduleRepository) {
  const logger = createLogger('WorkScheduleService')

  /**
   * Verifică proactiv suprapunerile de timp pentru un stilist
   */
  async function _ensureNoTimeOverlap(
    stylistId: string,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    excludeId?: string,
  ) {
    const overlapping = await repository.checkTimeOverlap(stylistId, dayOfWeek, startTime, endTime, excludeId)

    if (overlapping.length > 0) {
      const dayName = DAY_NAMES[dayOfWeek as DayOfWeek]
      const overlapInfo = overlapping.map((s) => `${s.startTime}-${s.endTime}`).join(', ')

      logger.warn('Time overlap detected.', {
        stylistId,
        dayOfWeek,
        startTime,
        endTime,
        overlapping: overlapInfo,
      })

      throw new UniquenessError(WORK_SCHEDULE_MESSAGES.ERROR.OVERLAP_EXISTS, [
        {
          field: 'timeInterval',
          message: `${WORK_SCHEDULE_MESSAGES.VALIDATION.TIME_OVERLAP} în ziua de ${dayName}: ${overlapInfo}`,
        },
      ])
    }
  }

  /**
   * Organizează programele pe zile pentru afișare
   */
  function _organizeSchedulesByDay(schedules: WorkSchedule[]): WorkSchedulesByDay {
    const organized: WorkSchedulesByDay = {}

    for (const schedule of schedules) {
      const day = schedule.dayOfWeek as DayOfWeek
      if (!organized[day]) {
        organized[day] = []
      }
      organized[day].push(schedule)
    }

    return organized
  }

  return {
    /**
     * Obține toate programele (pentru admin)
     */
    getAllSchedules: () => repository.findAll(),

    /**
     * Obține programul unui stilist organizat pe zile
     */
    async getStylistSchedule(stylistId: string): Promise<StylistWeeklySchedule> {
      const schedules = await repository.findByStylistId(stylistId)
      const organizedSchedule = _organizeSchedulesByDay(schedules)

      return {
        stylistId,
        schedule: organizedSchedule,
      }
    },

    /**
     * Obține programele pentru o anumită zi
     */
    async getScheduleForDay(stylistId: string, dayOfWeek: DayOfWeek): Promise<WorkSchedule[]> {
      return repository.findByStylistAndDay(stylistId, dayOfWeek)
    },

    /**
     * Obține un interval specific
     */
    async getScheduleById(id: string): Promise<WorkSchedule> {
      const schedule = await repository.findById(id)
      if (!schedule) {
        throw new NotFoundError(WORK_SCHEDULE_MESSAGES.ERROR.NOT_FOUND)
      }
      return schedule
    },

    /**
     * Creează un nou interval de program
     */
    async createSchedule(payload: CreateWorkSchedulePayload) {
      const { stylistId, dayOfWeek, startTime, endTime } = payload

      // Verificăm suprapunerile
      await _ensureNoTimeOverlap(stylistId, dayOfWeek as DayOfWeek, startTime, endTime)

      try {
        const newSchedule = await repository.create(payload)
        logger.info('Schedule created successfully.', {
          scheduleId: newSchedule.id,
          stylistId,
          day: DAY_NAMES[dayOfWeek as DayOfWeek],
          timeRange: `${startTime}-${endTime}`,
        })

        return {
          success: true,
          message: WORK_SCHEDULE_MESSAGES.SUCCESS.CREATED,
          data: newSchedule,
        }
      } catch (error: any) {
        if (error instanceof UniquenessError) throw error
        logger.error('Failed to create schedule.', { error })
        throw new DatabaseError(WORK_SCHEDULE_MESSAGES.ERROR.CREATE_FAILED, { cause: error })
      }
    },

    /**
     * Actualizează un interval de program
     */
    async updateSchedule(payload: UpdateWorkSchedulePayload) {
      const { id, stylistId, dayOfWeek, startTime, endTime } = payload

      // Verificăm că intervalul există
      await this.getScheduleById(id)

      // Verificăm suprapunerile (excludem intervalul curent)
      await _ensureNoTimeOverlap(stylistId, dayOfWeek as DayOfWeek, startTime, endTime, id)

      try {
        const updatedSchedule = await repository.update(id, {
          stylistId,
          dayOfWeek,
          startTime,
          endTime,
        })

        logger.info('Schedule updated successfully.', {
          scheduleId: id,
          stylistId,
          day: DAY_NAMES[dayOfWeek as DayOfWeek],
          timeRange: `${startTime}-${endTime}`,
        })

        return {
          success: true,
          message: WORK_SCHEDULE_MESSAGES.SUCCESS.UPDATED,
          data: updatedSchedule,
        }
      } catch (error: any) {
        if (error instanceof UniquenessError) throw error
        logger.error('Failed to update schedule.', { error })
        throw new DatabaseError(WORK_SCHEDULE_MESSAGES.ERROR.UPDATE_FAILED, { cause: error })
      }
    },

    /**
     * Șterge un interval de program
     */
    async deleteSchedule(scheduleId: string) {
      // Verificăm că intervalul există
      const schedule = await this.getScheduleById(scheduleId)

      logger.info('Attempting to delete schedule...', {
        scheduleId,
        stylistId: schedule.stylistId,
        day: DAY_NAMES[schedule.dayOfWeek as DayOfWeek],
        timeRange: `${schedule.startTime}-${schedule.endTime}`,
      })

      try {
        await repository.delete(scheduleId)
        logger.info('Schedule deleted successfully.', { scheduleId })

        return {
          success: true,
          message: WORK_SCHEDULE_MESSAGES.SUCCESS.DELETED,
        }
      } catch (error: any) {
        logger.error('Failed to delete schedule.', { error })
        throw new DatabaseError(WORK_SCHEDULE_MESSAGES.ERROR.DELETE_FAILED, { cause: error })
      }
    },

    /**
     * Șterge toate programele unui stilist (util la ștergerea stilistului)
     */
    async deleteAllStylistSchedules(stylistId: string) {
      logger.info('Deleting all schedules for stylist...', { stylistId })

      try {
        await repository.deleteByStylistId(stylistId)
        logger.info('All stylist schedules deleted successfully.', { stylistId })

        return {
          success: true,
          message: 'Toate programele stilistului au fost șterse cu succes.',
        }
      } catch (error: any) {
        logger.error('Failed to delete stylist schedules.', { error })
        throw new DatabaseError('Nu s-au putut șterge programele stilistului.', { cause: error })
      }
    },

    /**
     * Obține programele pentru mai mulți stiliști (pentru admin)
     */
    async getMultipleStylists(stylistIds: string[]): Promise<StylistWeeklySchedule[]> {
      if (stylistIds.length === 0) return []

      const allSchedules = await repository.findByMultipleStylists(stylistIds)

      // Grupăm pe stiliști
      const schedulesByStylist: Record<string, WorkSchedule[]> = {}

      for (const schedule of allSchedules) {
        if (!schedulesByStylist[schedule.stylistId]) {
          schedulesByStylist[schedule.stylistId] = []
        }
        schedulesByStylist[schedule.stylistId].push(schedule)
      }

      // Convertim în format organizat
      return stylistIds.map((stylistId) => ({
        stylistId,
        schedule: _organizeSchedulesByDay(schedulesByStylist[stylistId] || []),
      }))
    },

    /**
     * Verifică dacă un stilist este disponibil într-un anumit interval
     */
    async isStylistAvailable(
      stylistId: string,
      dayOfWeek: DayOfWeek,
      startTime: string,
      endTime: string,
    ): Promise<boolean> {
      const daySchedules = await repository.findByStylistAndDay(stylistId, dayOfWeek)

      // Verificăm dacă intervalul cerut se încadrează în programul stilistului
      return daySchedules.some((schedule) => schedule.startTime <= startTime && schedule.endTime >= endTime)
    },
  }
}

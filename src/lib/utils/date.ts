// src/lib/utils/date.ts
import { addDays, addMinutes, formatISO, isAfter, isBefore, isEqual, isSameDay, parseISO, set } from 'date-fns'
import { fromZonedTime,toZonedTime } from 'date-fns-tz'

// Timezone-ul salonului - poate fi configurat din environment variables
const SALON_TIMEZONE = process.env.SALON_TIMEZONE || 'Europe/Bucharest'

/**
 * Convertește o dată UTC în timezone-ul salonului
 */
export function toSalonTimezone(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return toZonedTime(dateObj, SALON_TIMEZONE)
}

/**
 * Convertește o dată din timezone-ul salonului în UTC
 */
export function fromSalonTimezone(date: Date): Date {
  return fromZonedTime(date, SALON_TIMEZONE)
}

/**
 * Parsează o oră (HH:MM) și o aplică pe o dată de bază
 */
export function parseTime(time: string, baseDate: Date): Date {
  const [hours, minutes] = time.split(':').map(Number)
  return set(baseDate, { hours, minutes, seconds: 0, milliseconds: 0 })
}

/**
 * Adaugă minute la o dată
 */
export function addMinutesToDate(date: Date, minutes: number): Date {
  return addMinutes(date, minutes)
}

/**
 * Verifică dacă o dată este înainte de alta
 */
export function isDateBefore(date1: Date, date2: Date): boolean {
  return isBefore(date1, date2)
}

/**
 * Verifică dacă o dată este după alta
 */
export function isDateAfter(date1: Date, date2: Date): boolean {
  return isAfter(date1, date2)
}

/**
 * Verifică dacă două date sunt egale
 */
export function isDateEqual(date1: Date, date2: Date): boolean {
  return isEqual(date1, date2)
}

/**
 * Verifică dacă două date sunt în aceeași zi
 */
export function isSameDate(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2)
}

/**
 * Adaugă zile la o dată
 */
export function addDaysToDate(date: Date, days: number): Date {
  return addDays(date, days)
}

/**
 * Formatează o dată în format ISO
 */
export function formatDateToISO(date: Date): string {
  return formatISO(date)
}

/**
 * Parsează o dată din format ISO
 */
export function parseDateFromISO(dateString: string): Date {
  return parseISO(dateString)
}

/**
 * Generează cheia pentru un slot (start|end)
 */
export function generateSlotKey(start: Date, end: Date): string {
  return `${formatISO(start)}|${formatISO(end)}`
}

/**
 * Extrage ziua din o dată (YYYY-MM-DD)
 */
export function extractDayFromDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatISO(dateObj, { representation: 'date' })
}

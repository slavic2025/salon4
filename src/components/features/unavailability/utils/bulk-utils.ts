// src/components/features/unavailability/utils/bulk-utils.ts

/**
 * Opțiuni pentru generarea bulk unavailabilities
 */
export interface GenerateBulkUnavailabilitiesOptions {
  startDate: string // Format YYYY-MM-DD
  endDate: string // Format YYYY-MM-DD
  includeWeekends: boolean
}

/**
 * Generează o listă de date între startDate și endDate
 * Cu opțiunea de a exclude weekends
 */
export function generateBulkUnavailabilities({
  startDate,
  endDate,
  includeWeekends,
}: GenerateBulkUnavailabilitiesOptions): string[] {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const dates: string[] = []

  // Verificăm că datele sunt valide
  if (start > end) {
    return []
  }

  // Iterăm prin toate zilele din interval
  const currentDate = new Date(start)
  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay() // 0 = Sunday, 6 = Saturday

    // Includem ziua dacă:
    // - includeWeekends este true, SAU
    // - ziua nu este weekend (Luni-Vineri: 1-5)
    if (includeWeekends || (dayOfWeek >= 1 && dayOfWeek <= 5)) {
      dates.push(formatDateToISO(currentDate))
    }

    // Trecem la următoarea zi
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

/**
 * Formatează o dată în format ISO (YYYY-MM-DD)
 */
function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Verifică dacă o dată este weekend
 */
export function isWeekend(date: string): boolean {
  const dayOfWeek = new Date(date).getDay()
  return dayOfWeek === 0 || dayOfWeek === 6 // Sunday or Saturday
}

/**
 * Obține numele zilei săptămânii în română
 */
export function getDayNameRo(date: string): string {
  const dayNames = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă']
  const dayOfWeek = new Date(date).getDay()
  return dayNames[dayOfWeek]
}

/**
 * Calculează numărul de zile lucrătoare dintr-un interval
 */
export function getWorkingDaysCount(startDate: string, endDate: string): number {
  const dates = generateBulkUnavailabilities({
    startDate,
    endDate,
    includeWeekends: false,
  })
  return dates.length
}

/**
 * Calculează numărul total de zile dintr-un interval
 */
export function getTotalDaysCount(startDate: string, endDate: string): number {
  const dates = generateBulkUnavailabilities({
    startDate,
    endDate,
    includeWeekends: true,
  })
  return dates.length
}

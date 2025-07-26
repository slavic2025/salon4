#!/usr/bin/env tsx

import { createAppointmentRepository } from '@/core/domains/appointments/appointment.repository'
import { createAppointmentService } from '@/core/domains/appointments/appointment.service'
import { generateAvailableSlotsForMultipleStylists } from '@/core/domains/appointments/appointment.utils'
import { createServiceRepository } from '@/core/domains/services/service.repository'
import { createServiceService } from '@/core/domains/services/service.service'
import { createStylistServiceLinkRepository } from '@/core/domains/stylist-services/stylist-service.repository'
import { createStylistServiceLinkService } from '@/core/domains/stylist-services/stylist-service.service'
import { createStylistRepository } from '@/core/domains/stylists/stylist.repository'
import { createStylistService } from '@/core/domains/stylists/stylist.service'
import { createUnavailabilityRepository } from '@/core/domains/unavailability/unavailability.repository'
import { createUnavailabilityService } from '@/core/domains/unavailability/unavailability.service'
import { createWorkScheduleRepository } from '@/core/domains/work-schedule/workSchedule.repository'
import { createWorkScheduleService } from '@/core/domains/work-schedule/workSchedule.service'
import { db } from '@/db'
import { createAdminClient } from '@/lib/supabase/admin'

const serviceService = createServiceService(createServiceRepository(db))
const stylistService = createStylistService(createStylistRepository(db), createAdminClient())
const stylistServiceLinkService = createStylistServiceLinkService(createStylistServiceLinkRepository(db))
const workScheduleService = createWorkScheduleService(createWorkScheduleRepository(db))
const appointmentService = createAppointmentService(createAppointmentRepository(db))
const unavailabilityService = createUnavailabilityService(createUnavailabilityRepository(db))

async function testSlots() {
  console.log('🧪 Testez generarea sloturilor...')

  try {
    // 1. Obțin serviciile
    const services = await serviceService.getActiveServices()
    if (services.length === 0) {
      console.log('❌ Nu există servicii active')
      return
    }
    const service = services[0]
    console.log(`📋 Folosesc serviciul: ${service.name} (${service.duration} min)`)

    // 2. Obțin stiliștii pentru serviciu
    const stylistLinks = await stylistServiceLinkService.getLinksByServiceId(service.id)
    if (stylistLinks.length === 0) {
      console.log('❌ Nu există stiliști pentru acest serviciu')
      return
    }
    const stylistIds = stylistLinks.map((link) => link.stylistId)
    console.log(`👩‍🎨 Stiliști pentru serviciu: ${stylistIds.length}`)

    // 3. Obțin programele
    const schedules = await workScheduleService.getMultipleStylists(stylistIds)
    console.log(`📅 Programe găsite: ${schedules.length}`)

    // 4. Obțin programările (goale pentru test)
    const from = new Date()
    const to = new Date()
    to.setDate(from.getDate() + 7)
    const appointments = await appointmentService.getAppointmentsByStylistIds(stylistIds, from, to)
    console.log(`📋 Programări găsite: ${appointments.length}`)

    // 5. Obțin indisponibilitățile (goale pentru test)
    const unavailabilities = await unavailabilityService.getUnavailabilitiesByStylistIds(
      stylistIds,
      from.toISOString().slice(0, 10),
      to.toISOString().slice(0, 10),
    )
    console.log(`🚫 Indisponibilități găsite: ${unavailabilities.length}`)

    // 6. Generez sloturile
    console.log('\n🔧 Generez sloturile...')
    const slots = generateAvailableSlotsForMultipleStylists({
      schedules,
      appointments,
      unavailabilities,
      serviceDuration: service.duration,
      fromDate: from.toISOString().slice(0, 10),
      days: 7,
    })

    console.log(`\n📊 Rezultate:`)
    console.log(`- Total sloturi: ${slots.length}`)
    console.log(`- Sloturi disponibile: ${slots.filter((s) => s.available).length}`)
    console.log(`- Sloturi indisponibile: ${slots.filter((s) => !s.available).length}`)

    if (slots.length > 0) {
      console.log('\n📅 Primele 5 sloturi:')
      slots.slice(0, 5).forEach((slot, index) => {
        const start = new Date(slot.start)
        const end = new Date(slot.end)
        console.log(
          `  ${index + 1}. ${start.toLocaleDateString('ro-RO')} ${start.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })} (${slot.available ? '✅ Disponibil' : '❌ Indisponibil'})`,
        )
      })
    }
  } catch (error) {
    console.error('❌ Eroare la testarea sloturilor:', error)
  }
}

testSlots()
  .then(() => {
    console.log('\n✅ Test finalizat!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })

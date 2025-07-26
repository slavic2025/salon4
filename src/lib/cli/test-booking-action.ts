#!/usr/bin/env tsx

import { createServiceRepository } from '@/core/domains/services/service.repository'
import { createServiceService } from '@/core/domains/services/service.service'
import { db } from '@/db'
import { getAvailableSlotsPublicAction } from '@/features/appointments/actions'

const serviceService = createServiceService(createServiceRepository(db))

async function testBookingAction() {
  console.log('🧪 Testez acțiunea de booking...')

  try {
    // Obțin serviciile active din baza de date
    const services = await serviceService.getActiveServices()
    if (!services || services.length === 0) {
      console.log('❌ Nu există servicii disponibile')
      return
    }

    const serviceId = services[0].id
    console.log(`📋 Folosesc serviciul: ${services[0].name} (${serviceId})`)

    // Testez acțiunea de booking
    const fromDate = new Date().toISOString().slice(0, 10) // Astăzi
    console.log(`📅 Data de început: ${fromDate}`)

    const slots = await getAvailableSlotsPublicAction({
      stylistId: '', // Gol pentru a obține toți stiliștii
      serviceId: serviceId,
      fromDate: fromDate,
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
    console.error('❌ Eroare la testarea acțiunii de booking:', error)
  }
}

testBookingAction()
  .then(() => {
    console.log('\n✅ Test finalizat!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })

#!/usr/bin/env tsx

import { db } from '@/db'

async function checkWorkSchedules() {
  console.log('🔍 Verific datele din baza de date...')

  try {
    // 1. Verific stiliștii
    console.log('\n📋 Stiliști:')
    const allStylists = await db.query.stylists.findMany()
    console.log(`Total stiliști: ${allStylists.length}`)
    allStylists.forEach((stylist) => {
      console.log(`  - ${stylist.fullName} (${stylist.id})`)
    })

    // 2. Verific serviciile
    console.log('\n📋 Servicii:')
    const allServices = await db.query.services.findMany()
    console.log(`Total servicii: ${allServices.length}`)
    allServices.forEach((service) => {
      console.log(`  - ${service.name} (${service.id}) - ${service.duration} min`)
    })

    // 3. Verific legăturile stilist-serviciu
    console.log('\n📋 Legături stilist-serviciu:')
    const allLinks = await db.query.stylistsToServices.findMany()
    console.log(`Total legături: ${allLinks.length}`)
    allLinks.forEach((link) => {
      const stylist = allStylists.find((s) => s.id === link.stylistId)
      const service = allServices.find((s) => s.id === link.serviceId)
      console.log(`  - ${stylist?.fullName} -> ${service?.name}`)
    })

    // 4. Verific programele de lucru
    console.log('\n📋 Programe de lucru:')
    const allSchedules = await db.query.workSchedules.findMany()
    console.log(`Total programe: ${allSchedules.length}`)

    const schedulesByStylist = new Map()
    allSchedules.forEach((schedule) => {
      if (!schedulesByStylist.has(schedule.stylistId)) {
        schedulesByStylist.set(schedule.stylistId, [])
      }
      schedulesByStylist.get(schedule.stylistId).push(schedule)
    })

    schedulesByStylist.forEach((schedules, stylistId) => {
      const stylist = allStylists.find((s) => s.id === stylistId)
      console.log(`  ${stylist?.fullName} (${stylistId}):`)
      schedules.forEach((schedule) => {
        const dayNames = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică']
        console.log(`    - ${dayNames[schedule.dayOfWeek]}: ${schedule.startTime} - ${schedule.endTime}`)
      })
    })

    // 5. Verific dacă există stiliști cu servicii și programe
    console.log('\n📋 Stiliști cu servicii și programe:')
    const stylistsWithData = allStylists.filter((stylist) => {
      const hasServices = allLinks.some((link) => link.stylistId === stylist.id)
      const hasSchedule = allSchedules.some((schedule) => schedule.stylistId === stylist.id)
      return hasServices && hasSchedule
    })

    console.log(`Stiliști cu servicii și programe: ${stylistsWithData.length}`)
    stylistsWithData.forEach((stylist) => {
      const stylistServices = allLinks.filter((link) => link.stylistId === stylist.id)
      const stylistSchedules = allSchedules.filter((schedule) => schedule.stylistId === stylist.id)
      console.log(`  - ${stylist.fullName}: ${stylistServices.length} servicii, ${stylistSchedules.length} programe`)
    })
  } catch (error) {
    console.error('❌ Eroare la verificarea datelor:', error)
    process.exit(1)
  }
}

checkWorkSchedules()
  .then(() => {
    console.log('\n✅ Verificarea completă!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })

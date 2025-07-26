#!/usr/bin/env tsx

import { createServiceRepository } from '@/core/domains/services/service.repository'
import { createServiceService } from '@/core/domains/services/service.service'
import { createStylistServiceLinkRepository } from '@/core/domains/stylist-services/stylist-service.repository'
import { createStylistServiceLinkService } from '@/core/domains/stylist-services/stylist-service.service'
import { createStylistRepository } from '@/core/domains/stylists/stylist.repository'
import { createStylistService } from '@/core/domains/stylists/stylist.service'
import { createWorkScheduleRepository } from '@/core/domains/work-schedule/workSchedule.repository'
import { createWorkScheduleService } from '@/core/domains/work-schedule/workSchedule.service'
import { db } from '@/db'
import { createAdminClient } from '@/lib/supabase/admin'

const serviceService = createServiceService(createServiceRepository(db))
const stylistService = createStylistService(createStylistRepository(db), createAdminClient())
const stylistServiceLinkService = createStylistServiceLinkService(createStylistServiceLinkRepository(db))
const workScheduleService = createWorkScheduleService(createWorkScheduleRepository(db))

const sampleServices = [
  {
    name: 'Tuns & Coafat',
    description: 'Tuns modern și coafat profesional pentru orice ocazie',
    price: 150.0,
    duration: 60,
    category: 'haircut' as const,
    isActive: true,
  },
  {
    name: 'Vopsit & Balayage',
    description: 'Vopsit profesional și tehnici moderne de colorare',
    price: 300.0,
    duration: 120,
    category: 'coloring' as const,
    isActive: true,
  },
  {
    name: 'Manichiură & Pedichiură',
    description: 'Manichiură și pedichiură cu produse de calitate',
    price: 80.0,
    duration: 45,
    category: 'treatment' as const,
    isActive: true,
  },
]

const sampleStylists = [
  {
    fullName: 'Maria Popescu',
    email: 'maria.popescu@salon.com',
    phone: '0722123456',
    description: 'Specialist în coafuri și vopsit',
    isActive: true,
  },
  {
    fullName: 'Ana Ionescu',
    email: 'ana.ionescu@salon.com',
    phone: '0722123457',
    description: 'Specialist în manichiură și pedichiură',
    isActive: true,
  },
]

async function seedTestData() {
  console.log('🌱 Seeding test data...')

  // 1. Creează serviciile
  console.log('\n📋 Creating services...')
  const createdServices = []
  for (const serviceData of sampleServices) {
    try {
      const result = await serviceService.createService(serviceData)
      if (result.success) {
        console.log(`✅ Created service: ${serviceData.name}`)
        createdServices.push(result.data)
      } else {
        console.log(`❌ Failed to create service: ${serviceData.name} - ${result.message}`)
      }
    } catch (error) {
      console.log(`❌ Error creating service: ${serviceData.name}`, error)
    }
  }

  // 2. Creează stiliștii
  console.log('\n👩‍🎨 Creating stylists...')
  const createdStylists = []
  for (const stylistData of sampleStylists) {
    try {
      const result = await stylistService.createStylist(stylistData)
      if (result.success) {
        console.log(`✅ Created stylist: ${stylistData.fullName}`)
        createdStylists.push(result.data)
      } else {
        console.log(`❌ Failed to create stylist: ${stylistData.fullName} - ${result.message}`)
      }
    } catch (error) {
      console.log(`❌ Error creating stylist: ${stylistData.fullName}`, error)
    }
  }

  // 3. Creează legăturile stilist-serviciu
  console.log('\n🔗 Creating stylist-service links...')
  for (const stylist of createdStylists) {
    for (const service of createdServices) {
      try {
        const result = await stylistServiceLinkService.createLink({
          stylistId: stylist.id,
          serviceId: service.id,
        })
        if (result.success) {
          console.log(`✅ Linked ${stylist.fullName} to ${service.name}`)
        } else {
          console.log(`❌ Failed to link ${stylist.fullName} to ${service.name} - ${result.message}`)
        }
      } catch (error) {
        console.log(`❌ Error linking ${stylist.fullName} to ${service.name}`, error)
      }
    }
  }

  // 4. Creează programele de lucru
  console.log('\n📅 Creating work schedules...')
  for (const stylist of createdStylists) {
    // Program pentru luni-vineri (0-4)
    for (let day = 0; day <= 4; day++) {
      try {
        const result = await workScheduleService.createSchedule({
          stylistId: stylist.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
        })
        if (result.success) {
          console.log(`✅ Created schedule for ${stylist.fullName} - day ${day} (09:00-17:00)`)
        } else {
          console.log(`❌ Failed to create schedule for ${stylist.fullName} - day ${day} - ${result.message}`)
        }
      } catch (error) {
        console.log(`❌ Error creating schedule for ${stylist.fullName} - day ${day}`, error)
      }
    }

    // Program pentru sâmbătă (5)
    try {
      const result = await workScheduleService.createSchedule({
        stylistId: stylist.id,
        dayOfWeek: 5,
        startTime: '10:00',
        endTime: '16:00',
      })
      if (result.success) {
        console.log(`✅ Created schedule for ${stylist.fullName} - Saturday (10:00-16:00)`)
      } else {
        console.log(`❌ Failed to create schedule for ${stylist.fullName} - Saturday - ${result.message}`)
      }
    } catch (error) {
      console.log(`❌ Error creating schedule for ${stylist.fullName} - Saturday`, error)
    }
  }

  console.log('\n🎉 Test data seeding completed!')
  console.log('\n📊 Summary:')
  console.log(`- Services created: ${createdServices.length}`)
  console.log(`- Stylists created: ${createdStylists.length}`)
  console.log(`- Work schedules created: ${createdStylists.length * 6}`) // 6 zile per stilist

  process.exit(0)
}

seedTestData().catch((error) => {
  console.error('💥 Seeding failed:', error)
  process.exit(1)
})

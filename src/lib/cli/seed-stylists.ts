#!/usr/bin/env tsx

import { randomUUID } from 'crypto'
import { sql } from 'drizzle-orm'

import { createServiceRepository } from '@/core/domains/services/service.repository'
import { createStylistServiceLinkRepository } from '@/core/domains/stylist-services/stylist-service.repository'
import { createStylistRepository } from '@/core/domains/stylists/stylist.repository'
import { db } from '@/db'
import { stylistsToServices } from '@/db/schema/stylist-services'
import { workSchedules } from '@/db/schema/work-schedules'

const stylistRepository = createStylistRepository(db)
const serviceRepository = createServiceRepository(db)
const stylistServiceLinkRepository = createStylistServiceLinkRepository(db)

const sampleStylists = [
  {
    fullName: 'Elena Dumitrescu',
    email: 'elena.dumitrescu@salon-test.com',
    phone: '0722123458',
    description: 'Specialist în coafuri moderne și vopsit profesional',
    isActive: true,
  },
  {
    fullName: 'Cristina Marinescu',
    email: 'cristina.marinescu@salon-test.com',
    phone: '0722123459',
    description: 'Expert în manichiură, pedichiură și tratamente faciale',
    isActive: true,
  },
  {
    fullName: 'Andreea Popa',
    email: 'andreea.popa@salon-test.com',
    phone: '0722123460',
    description: 'Specialist în extensii gene și make-up pentru evenimente',
    isActive: true,
  },
]

async function seedStylists() {
  console.log('👩‍🎨 Seeding stylists (direct DB insert, no email)...')

  const createdStylists = []

  for (const stylistData of sampleStylists) {
    try {
      console.log(`\n📋 Creating stylist: ${stylistData.fullName}`)

      // Creez stilistul direct în DB cu SQL raw pentru a ocoli foreign key constraint
      const stylistId = randomUUID()
      const result = await db.execute(sql`
        INSERT INTO stylists (id, full_name, email, phone, description, is_active)
        VALUES (${stylistId}, ${stylistData.fullName}, ${stylistData.email}, ${stylistData.phone}, ${stylistData.description}, ${stylistData.isActive})
        RETURNING id, full_name, email, phone, description, is_active, created_at, updated_at
      `)

      const newStylist = result[0] as any
      console.log(`✅ Created stylist: ${stylistData.fullName}`)
      console.log(`   ID: ${newStylist.id}`)
      console.log(`   Email: ${newStylist.email}`)
      console.log(`   Phone: ${newStylist.phone}`)
      createdStylists.push(newStylist)

      // --- Asociază cu toate serviciile existente ---
      const allServices = await serviceRepository.findAll()
      if (allServices.length === 0) {
        console.log('⚠️  Nu există servicii în baza de date pentru asociere!')
      } else {
        console.log(`🔗 Asociez stilistul cu ${allServices.length} servicii...`)
        for (const service of allServices) {
          try {
            await db.insert(stylistsToServices).values({
              stylistId: newStylist.id,
              serviceId: service.id,
            })
            console.log(`   ✅ Asociat cu serviciul: ${service.name}`)
          } catch (error: any) {
            if (error.message?.includes('duplicate key')) {
              console.log(`   ⚠️  Legătura există deja: ${service.name}`)
            } else {
              console.log(`   ❌ Eroare la asociere cu serviciul: ${service.name}`, error.message)
            }
          }
        }
      }

      // --- Adaugă program de lucru standard luni-vineri ---
      console.log('📅 Adaug program de lucru standard (luni-vineri 09:00-17:00)...')
      for (let day = 0; day <= 4; day++) {
        try {
          await db.insert(workSchedules).values({
            stylistId: newStylist.id,
            dayOfWeek: day,
            startTime: '09:00',
            endTime: '17:00',
          })
          console.log(`   ✅ Program adăugat pentru ziua ${day} (09:00-17:00)`)
        } catch (error: any) {
          if (error.message?.includes('duplicate')) {
            console.log(`   ⚠️  Program deja existent pentru ziua ${day}`)
          } else {
            console.log(`   ❌ Eroare la adăugarea programului pentru ziua ${day}:`, error.message)
          }
        }
      }
    } catch (error: any) {
      if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
        console.log(`⚠️  Stylist already exists: ${stylistData.fullName}`)
      } else {
        console.log(`❌ Error creating stylist: ${stylistData.fullName}`, error.message)
      }
    }
  }

  console.log('\n📊 Summary:')
  console.log(`- Stylists created: ${createdStylists.length}`)
  console.log(`- Total stylists in database: ${(await stylistRepository.findAll()).length}`)

  if (createdStylists.length > 0) {
    console.log('\n📋 Created stylists:')
    createdStylists.forEach((stylist, index) => {
      console.log(`  ${index + 1}. ${stylist.full_name} (${stylist.email})`)
    })
  }

  console.log('\n🎉 Stylists seeding completed!')
  process.exit(0)
}

seedStylists().catch((error) => {
  console.error('💥 Seeding failed:', error)
  process.exit(1)
})

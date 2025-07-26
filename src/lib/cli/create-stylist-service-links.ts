#!/usr/bin/env tsx

import { db } from '@/db'
import { stylistsToServices } from '@/db/schema/stylist-services'

async function createStylistServiceLinks() {
  console.log('🔗 Creez legături stilist-serviciu...')

  try {
    // 1. Obțin stilistul existent
    const stylists = await db.query.stylists.findMany()
    if (stylists.length === 0) {
      console.log('❌ Nu există stiliști în baza de date')
      return
    }
    const stylist = stylists[0]
    console.log(`📋 Folosesc stilistul: ${stylist.fullName} (${stylist.id})`)

    // 2. Obțin serviciile existente
    const services = await db.query.services.findMany()
    if (services.length === 0) {
      console.log('❌ Nu există servicii în baza de date')
      return
    }
    console.log(`📋 Găsite ${services.length} servicii`)

    // 3. Creez legăturile pentru toate serviciile
    console.log('\n🔗 Creez legături...')
    for (const service of services) {
      try {
        await db.insert(stylistsToServices).values({
          stylistId: stylist.id,
          serviceId: service.id,
        })
        console.log(`✅ ${stylist.fullName} -> ${service.name}`)
      } catch (error: any) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️  Legătura există deja: ${stylist.fullName} -> ${service.name}`)
        } else {
          console.log(`❌ Eroare la crearea legăturii: ${stylist.fullName} -> ${service.name}`, error.message)
        }
      }
    }

    // 4. Verific rezultatul
    console.log('\n📋 Verific rezultatul...')
    const links = await db.query.stylistsToServices.findMany()
    console.log(`Total legături create: ${links.length}`)
  } catch (error) {
    console.error('❌ Eroare:', error)
    process.exit(1)
  }
}

createStylistServiceLinks()
  .then(() => {
    console.log('\n✅ Script finalizat cu succes!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })

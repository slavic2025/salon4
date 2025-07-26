#!/usr/bin/env tsx

import { createServiceRepository } from '@/core/domains/services/service.repository'
import { createServiceService } from '@/core/domains/services/service.service'
import { db } from '@/db'

const serviceService = createServiceService(createServiceRepository(db))

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
  {
    name: 'Tratamente Faciale',
    description: 'Tratamente anti-aging și de hidratare profundă',
    price: 200.0,
    duration: 90,
    category: 'treatment' as const,
    isActive: true,
  },
  {
    name: 'Extensii Gene',
    description: 'Extensii de gene naturale și durabile',
    price: 250.0,
    duration: 120,
    category: 'other' as const,
    isActive: true,
  },
  {
    name: 'Make-up Profesional',
    description: 'Make-up pentru evenimente speciale și zilnic',
    price: 180.0,
    duration: 60,
    category: 'styling' as const,
    isActive: true,
  },
]

async function seedServices() {
  console.log('🌱 Seeding services...')

  for (const serviceData of sampleServices) {
    try {
      const result = await serviceService.createService(serviceData)
      if (result.success) {
        console.log(`✅ Created service: ${serviceData.name}`)
      } else {
        console.log(`❌ Failed to create service: ${serviceData.name} - ${result.message}`)
      }
    } catch (error) {
      console.log(`❌ Error creating service: ${serviceData.name}`, error)
    }
  }

  console.log('🎉 Services seeding completed!')
  process.exit(0)
}

seedServices().catch((error) => {
  console.error('💥 Seeding failed:', error)
  process.exit(1)
})

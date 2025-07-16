#!/usr/bin/env tsx

import { sql } from 'drizzle-orm'

import { db } from '@/db'

/**
 * Script simplu pentru testarea conexiunii la baza de date
 */
async function testDatabaseConnection() {
  console.log('🔍 Testez conexiunea la baza de date...')

  try {
    // Test 1: Verifică versiunea PostgreSQL
    console.log('\n📋 Test 1: Versiunea PostgreSQL')
    const versionResult = await db.execute(sql`SELECT version()`)
    const version = versionResult[0]?.version as string
    console.log('✅ Versiune:', version ? version.substring(0, 50) + '...' : 'N/A')

    // Test 2: Verifică timestamp-ul curent
    console.log('\n📋 Test 2: Timestamp curent')
    const timeResult = await db.execute(sql`SELECT NOW() as current_time`)
    console.log('✅ Timpul curent:', timeResult[0]?.current_time)

    // Test 3: Listează tabelele din schema public
    console.log('\n📋 Test 3: Tabelele existente în schema public')
    const tablesResult = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `)

    if (tablesResult.length > 0) {
      console.log('✅ Tabele găsite:')
      tablesResult.forEach((table: any) => {
        console.log(`   - ${table.table_name}`)
      })
    } else {
      console.log('⚠️  Nu s-au găsit tabele în schema public')
    }

    // Test 4: Verifică dacă tabela work_schedules există
    console.log('\n📋 Test 4: Verifică tabela work_schedules')
    const workScheduleTableResult = await db.execute(sql`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'work_schedules' 
          AND table_schema = 'public'
      ) as table_exists
    `)

    const workScheduleExists = workScheduleTableResult[0]?.table_exists
    if (workScheduleExists) {
      console.log('✅ Tabela work_schedules există')

      // Verifică structura tabelei
      const columnsResult = await db.execute(sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'work_schedules' 
          AND table_schema = 'public'
        ORDER BY ordinal_position
      `)

      console.log('   Coloane:')
      columnsResult.forEach((col: any) => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`)
      })
    } else {
      console.log('❌ Tabela work_schedules NU există')
    }

    // Test 5: Verifică tabela stylists
    console.log('\n📋 Test 5: Verifică tabela stylists')
    const stylistsTableResult = await db.execute(sql`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'stylists' 
          AND table_schema = 'public'
      ) as table_exists
    `)

    const stylistsExists = stylistsTableResult[0]?.table_exists
    if (stylistsExists) {
      console.log('✅ Tabela stylists există')

      // Numără înregistrările
      const countResult = await db.execute(sql`SELECT COUNT(*) as count FROM stylists`)
      console.log(`   Numărul de stilisti: ${countResult[0]?.count}`)
    } else {
      console.log('❌ Tabela stylists NU există')
    }

    console.log('\n🎉 Testarea conexiunii a fost completă cu succes!')
  } catch (error) {
    console.error('❌ Eroare la testarea conexiunii:', error)
    process.exit(1)
  }
}

// Rulează testul
testDatabaseConnection()
  .then(() => {
    console.log('\n✅ Script finalizat cu succes')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })

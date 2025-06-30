// src/lib/cli/test-db-connection.ts
// Pas 2: Importăm instanța `db` gata configurată
import { db } from '@/db'

import { createLogger } from '../logger'

const logger = createLogger('CLI:test-db')

/**
 * Funcția principală care execută o interogare simplă de test.
 */
async function testConnection() {
  logger.info('Attempting to connect to the database and run a test query...')

  try {
    // Pas 3: Executăm cea mai simplă interogare posibilă
    const result = await db.query.admins.findFirst()

    // Dacă ajungem aici, conexiunea a funcționat
    logger.info('✅ Database query successful!')

    if (result) {
      logger.info('Found at least one record in "admins" table:', result)
    } else {
      logger.info('"admins" table is empty, but the connection was successful.')
    }
  } catch (error) {
    // Dacă apare o eroare, o vom vedea aici în detaliu
    logger.error('Database query failed.', { error })
    process.exit(1)
  }
}

// Apelăm funcția
void testConnection()

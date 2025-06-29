// src/db/index.ts

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import 'dotenv/config'
import * as schema from './schema/_schema'

const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })
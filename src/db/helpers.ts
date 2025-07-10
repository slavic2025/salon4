// src/db/helpers.ts
import { type Column } from 'drizzle-orm'

// O funcție care returnează o opțiune de sortare tipată, reutilizabilă.
export function defaultOrderBy<T extends Column>(table: T, order: 'asc' | 'desc' = 'desc') {
  return {
    orderBy: (t: any, { asc, desc }: any) => [order === 'desc' ? desc(t[table.name]) : asc(t[table.name])],
  } as const
}

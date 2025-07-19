# Server Actions Pattern Unificat

## 📋 Prezentare Generală

Toate fișierele `actions.ts` din directorul `@/features` urmează acum un pattern unificat și consistent, aliniat cu regulile din `.cursorrules` și principiile de Clean Code.

## 🏗️ Pattern-ul Unificat

### Structura Standard

```typescript
// src/features/[domain]/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Imports specifice domeniului
import { ... } from '@/core/domains/[domain]'
import { db } from '@/db'
import { APP_ROUTES } from '@/lib/constants'
import { UniquenessError } from '@/lib/errors'
import { ensureUserIsAdmin, ensureUserIsStylist } from '@/lib/route-protection'
import { executeSafeAction } from '@/lib/safe-action'

/**
 * Instanțiem serviciul o singură dată la nivel de modul.
 * Acest lucru este eficient și simplifică corpul acțiunilor.
 */
const domainService = createDomainService(createDomainRepository(db))

/**
 * Helper intern pentru a verifica dacă utilizatorul este admin.
 * @private
 */
async function _ensureUserIsAdmin() {
  await ensureUserIsAdmin()
}

/**
 * FACTORY FUNCTION: Creează o acțiune sigură care necesită privilegii de admin.
 * Încorporează validarea, autorizarea, execuția, gestionarea erorilor și revalidarea.
 */
function createAdminAction<T extends z.ZodType<any, any, any>>(
  schema: T,
  actionLogic: (payload: z.infer<T>) => Promise<any>,
) {
  return (payload: z.infer<T>) => {
    return executeSafeAction(schema, payload, async (validatedPayload) => {
      await _ensureUserIsAdmin()

      try {
        const result = await actionLogic(validatedPayload)
        revalidatePath(APP_ROUTES.ADMIN_PAGE)
        return { data: result }
      } catch (error) {
        if (error instanceof UniquenessError) {
          return {
            validationErrors: Object.fromEntries(error.fields.map((f) => [f.field, [f.message]])),
          }
        }
        throw error
      }
    })
  }
}

// --- PUBLIC SERVER ACTIONS ---

export const createAction = createAdminAction(
  CreateActionSchema,
  async (payload: CreatePayload) => domainService.create(payload),
)
```

### Tipuri de Factory Functions

#### 1. Admin Actions

```typescript
function createAdminAction<T extends z.ZodType<any, any, any>>(
  schema: T,
  actionLogic: (payload: z.infer<T>) => Promise<any>,
)
```

- Pentru operații care necesită privilegii de admin
- Validare automată cu Zod
- Autorizare centralizată
- Gestionare consistentă a erorilor

#### 2. Stylist Own Actions

```typescript
function createStylistOwnAction<T extends z.ZodType<any, any, any>>(
  schema: T,
  actionLogic: (payload: z.infer<T>, userId: string) => Promise<any>,
)
```

- Pentru operații care permit stilistului să-și gestioneze propriile date
- Verificare automată că stilistul accesează doar propriile date
- Autorizare și validare centralizată

#### 3. Public Actions

```typescript
function createPublicAction<T extends z.ZodType<any, any, any>>(
  schema: T,
  actionLogic: (payload: z.infer<T>) => Promise<any>,
)
```

- Pentru operații publice (ex: autentificare)
- Validare automată cu Zod
- Gestionare consistentă a erorilor

## 🎯 Beneficiile Pattern-ului

### 1. DRY (Don't Repeat Yourself)

- Elimină duplicarea codului pentru validare, autorizare și gestionarea erorilor
- Factory functions reutilizabile pentru tipuri similare de acțiuni

### 2. Single Responsibility

- Fiecare factory function are o responsabilitate specifică
- Separarea clară între admin, stylist și public actions

### 3. Clean Structure

- Organizare consistentă în toate fișierele
- Comentarii descriptive pentru fiecare secțiune
- Helper functions private cu prefix `_`

### 4. Type Safety

- Generics pentru type safety
- Zod schemas pentru validare
- TypeScript strict mode

### 5. Error Handling

- Gestionare consistentă a `UniquenessError`
- Fallback pentru erori neașteptate
- Logging centralizat

### 6. Constants Over Magic Numbers/Strings

- Eliminarea magic strings prin folosirea constantelor din domenii
- Rute centralizate în `APP_ROUTES`
- Mesaje de eroare din constante specifice domeniului
- Tipuri de cauze din constante specifice domeniului

### 7. Structured Logging

- Folosirea logger-ului din `@/lib/logger` în loc de `console.log`
- Context specific pentru fiecare domeniu (ex: `createLogger('auth')`)
- Niveluri de logare optime (debug, info, warn, error)
- Logging structurat cu context complet pentru debugging

## 📁 Fișiere Refactorizate

### ✅ Complet Refactorizate

- `auth/actions.ts` - Pattern public actions
- `services/actions.ts` - Pattern admin actions
- `stylists/actions.ts` - Pattern admin actions
- `stylist-services/actions.ts` - Pattern admin + stylist actions
- `unavailability/actions.ts` - Pattern stylist actions
- `work-schedule/actions.ts` - Pattern admin + stylist actions

### 🔧 Caracteristici Implementate

- Factory functions pentru toate tipurile de acțiuni
- Gestionare consistentă a erorilor
- Revalidare cache automată
- Autorizare centralizată
- Type safety completă
- Comentarii descriptive
- Eliminarea magic strings prin constante din domenii
- Logging structurat cu context specific pentru fiecare domeniu

## 🚀 Utilizare

### Pentru Admin Actions

```typescript
export const createAction = createAdminAction(CreateSchema, async (payload) => service.create(payload))
```

### Pentru Stylist Own Actions

```typescript
export const createStylistAction = createStylistOwnAction(CreateSchema, async (payload, userId) => {
  // Verificare că stilistul accesează propriile date
  if (payload.stylistId !== userId) {
    throw new Error('Unauthorized')
  }
  return service.create(payload)
})
```

### Pentru Public Actions

```typescript
export const signInAction = createPublicAction(SignInSchema, async (credentials) => authService.signIn(credentials))
```

## 📋 Reguli de Menținere

1. **Consistență**: Toate noile actions trebuie să urmeze pattern-ul unificat
2. **Factory Functions**: Folosește factory functions pentru a evita duplicarea
3. **Error Handling**: Gestionează erorile conform pattern-ului stabilit
4. **Type Safety**: Folosește Zod schemas și TypeScript strict
5. **Documentație**: Adaugă comentarii descriptive pentru funcții complexe
6. **Constants**: Folosește constante din domenii în loc de magic strings
7. **Logging**: Folosește logger-ul cu context specific și niveluri optime

---

**Pattern-ul unificat asigură cod consistent, mentenabil și aliniat cu principiile de Clean Code din `.cursorrules`.**

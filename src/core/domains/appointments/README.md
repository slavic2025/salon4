# Domeniul Appointments

## 📋 Descriere

Domeniul `appointments` gestionează programările clienților în salonul de înfrumusețare. Acest domeniu este responsabil pentru crearea, actualizarea, ștergerea și gestionarea statusurilor programărilor.

## 🏗️ Arhitectura

### Structura Fișierelor

```
src/core/domains/appointments/
├── appointment.types.ts      # Tipuri TypeScript și interfețe
├── appointment.constants.ts  # Constante și mesaje
├── appointment.validators.ts # Validatori Zod
├── appointment.repository.ts # Acces la baza de date
├── appointment.service.ts    # Logica de business
├── index.ts                 # Exporturi publice
└── README.md               # Documentația domeniului
```

### Schema Bazei de Date

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_notes TEXT,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  stylist_id UUID NOT NULL REFERENCES stylists(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status appointment_status DEFAULT 'waiting',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE appointment_status AS ENUM (
  'waiting',     -- În așteptare
  'confirmed',   -- Confirmat
  'refused',     -- Refuzat
  'cancelled',   -- Anulat
  'completed',   -- Finalizat
  'no_show'      -- Nu s-a prezentat
);
```

## 🎯 Funcționalități

### Operațiuni de Bază

- **Creare programare**: Creează o nouă programare cu validare de disponibilitate
- **Actualizare programare**: Modifică detaliile unei programări existente
- **Ștergere programare**: Șterge o programare din sistem
- **Actualizare status**: Schimbă statusul unei programări

### Căutări și Filtrare

- **După client**: Găsește toate programările unui client
- **După stilist**: Găsește toate programările unui stilist
- **După serviciu**: Găsește toate programările pentru un serviciu
- **După status**: Filtrează programările după status
- **După interval de date**: Găsește programările într-un interval specificat
- **Cu detalii**: Obține programările cu informații despre serviciu și stilist

### Validări și Business Logic

- **Verificare disponibilitate**: Asigură că nu există conflicte de programare
- **Validare date**: Verifică formatul și logica datelor de intrare
- **Validare timp**: Asigură că ora de sfârșit este după ora de început
- **Validare stilist-serviciu**: Verifică dacă stilistul oferă serviciul respectiv

## 📊 Statusurile Programărilor

| Status      | Cod | Descriere                                    |
| ----------- | --- | -------------------------------------------- |
| `waiting`   | 0   | Programarea este în așteptarea confirmării   |
| `confirmed` | 1   | Programarea a fost confirmată și este activă |
| `refused`   | 2   | Programarea a fost refuzată                  |
| `cancelled` | 3   | Programarea a fost anulată                   |
| `completed` | 4   | Serviciul a fost finalizat cu succes         |
| `no_show`   | 5   | Clientul nu s-a prezentat la programare      |

## 🔧 Utilizare

### În Server Actions

```typescript
import { createAppointmentAction, updateAppointmentAction } from '@/features/appointments/actions'

// Creare programare
const result = await createAppointmentAction({
  clientEmail: 'client@example.com',
  clientName: 'Maria Popescu',
  clientPhone: '+40123456789',
  serviceId: 'service-uuid',
  stylistId: 'stylist-uuid',
  startTime: '2024-01-15T10:00:00Z',
  endTime: '2024-01-15T11:00:00Z',
})

// Actualizare status
const result = await updateAppointmentStatusAction({
  id: 'appointment-uuid',
  status: 'confirmed',
})
```

### În Server Components

```typescript
import { createAppointmentService, createAppointmentRepository } from '@/core/domains/appointments'
import { db } from '@/db'

const appointmentService = createAppointmentService(createAppointmentRepository(db))

// Obține programările cu detalii
const appointments = await appointmentService.getAppointmentsWithDetails({
  status: 'confirmed',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  limit: 20,
})
```

### În Client Components

```typescript
import { CreateAppointmentFormValidator } from '@/core/domains/appointments'

// Validare formular
const formData = {
  clientEmail: 'client@example.com',
  clientName: 'Maria Popescu',
  // ... alte câmpuri
}

const validationResult = CreateAppointmentFormValidator.safeParse(formData)
if (!validationResult.success) {
  console.log(validationResult.error.errors)
}
```

## 🛡️ Securitate

### Autorizare

- Toate operațiunile de modificare necesită privilegii de administrator
- Verificarea rolului se face prin `ensureUserIsAdmin()`
- Logging complet pentru auditare

### Validare

- Validare strictă cu Zod pentru toate input-urile
- Verificare de disponibilitate înainte de creare/actualizare
- Validare de business logic pentru conflicte de programare

## 📝 Logging

Domeniul folosește logger-ul centralizat cu contextul `appointments`:

```typescript
const logger = createLogger('appointments')

logger.info('Programarea a fost creată cu succes', { appointmentId: 'uuid' })
logger.warn('Conflict de programare detectat', { stylistId: 'uuid' })
logger.error('Eroare la crearea programării', { error })
```

## 🔄 Relații cu Alte Domenii

### Dependențe

- **services**: Programările referă servicii specifice
- **stylists**: Programările sunt asociate cu stilistul care oferă serviciul
- **stylist-services**: Verifică dacă stilistul oferă serviciul respectiv

### Flux de Date

1. **Creare programare**:
   - Validare date client
   - Verificare disponibilitate stilist
   - Verificare serviciu disponibil pentru stilist
   - Creare în baza de date

2. **Actualizare programare**:
   - Validare modificări
   - Verificare disponibilitate (dacă se schimbă timpul/stilistul)
   - Actualizare în baza de date

3. **Gestionare status**:
   - Validare tranziții de status
   - Actualizare status în baza de date
   - Notificări (viitor)

## 🚀 Extensibilitate

### Funcționalități Viitoare

- **Notificări**: Email/SMS pentru confirmări și remindere
- **Recurring appointments**: Programări recurente
- **Waitlist**: Listă de așteptare pentru sloturi ocupate
- **Online booking**: Rezervări directe de către clienți
- **Calendar integration**: Integrare cu calendare externe

### Hook-uri pentru Extensie

- **Pre-save hooks**: Validări suplimentare înainte de salvare
- **Post-save hooks**: Acțiuni după salvare (notificări, etc.)
- **Status transition hooks**: Logica pentru schimbări de status

## 📋 Checklist de Implementare

- [x] Schema bazei de date
- [x] Tipuri TypeScript
- [x] Constante și mesaje
- [x] Validatori Zod
- [x] Repository pattern
- [x] Service layer
- [x] Server actions
- [x] Logging
- [x] Documentație
- [ ] Teste unitare
- [ ] Teste de integrare
- [ ] UI components
- [ ] Admin interface

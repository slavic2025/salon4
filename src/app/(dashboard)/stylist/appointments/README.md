# Pagina de Programări pentru Stilist

## Descriere

Această pagină permite stilistului să-și vadă și să-și gestioneze programările într-un mod organizat și vizual clar.

## Funcționalități

### 1. Vizualizare Organizată a Programărilor

Programările sunt grupate și afișate în următoarea ordine:

1. **Programări care așteaptă acțiuni** (status: `waiting`)
   - Afișate cu prioritate maximă
   - Stilizate cu iconițe de alertă
   - Butoane pentru Accept/Refuz

2. **Programările de astăzi** (status: `confirmed` pentru data curentă)
   - Evidențiate cu border albastru
   - Afișate separat pentru acces rapid

3. **Programări confirmate** (status: `confirmed` pentru date viitoare)
   - Sortate cronologic
   - Butoane pentru Finalizare/Anulare

4. **Programări finalizate** (status: `completed`)
   - Fără acțiuni disponibile
   - Pentru istoric

5. **Programări anulate/refuzate** (status: `refused`, `cancelled`, `no_show`)
   - Grupate împreună
   - Fără acțiuni disponibile

### 2. Filtrare și Căutare

- **Căutare text**: După nume client, email, telefon sau serviciu
- **Filtrare după status**: Toate statusurile disponibile
- **Filtrare după perioada**: Astăzi, săptămâna aceasta, luna aceasta, toate
- **Ștergere filtre**: Buton pentru resetarea tuturor filtrelor

### 3. Statistici

Carduri cu statistici în timp real:

- Total programări
- Programări în așteptare
- Programări confirmate
- Programări pentru astăzi

### 4. Acțiuni Disponibile

#### Pentru programări în așteptare:

- **Acceptă**: Schimbă statusul în `confirmed`
- **Refuză**: Schimbă statusul în `refused`

#### Pentru programări confirmate:

- **Finalizează**: Schimbă statusul în `completed`
- **Anulează**: Schimbă statusul în `cancelled`
- **No-show**: Pentru programări trecute (schimbă statusul în `no_show`)

### 5. Design și UX

- **Card-uri responsive**: Grid adaptiv (1 coloană pe mobile, 2 pe tablet, 3 pe desktop)
- **Evidențiere vizuală**:
  - Programările de astăzi au border albastru
  - Programările trecute au border portocaliu
  - Status-uri colorate cu badge-uri
- **Iconițe intuitive**: Pentru fiecare tip de programare
- **Loading states**: Skeleton loading pentru o experiență fluidă
- **Error handling**: Pagină de eroare cu buton de reîncercare

## Structura Fișierelor

```
src/app/(dashboard)/stylist/appointments/
├── page.tsx                    # Server Component - data fetching
├── loading.tsx                 # Loading skeleton
├── error.tsx                   # Error boundary
└── README.md                   # Această documentație

src/components/features/stylist-appointments/
├── StylistAppointmentsPageContent.tsx  # Componenta principală
├── AppointmentCard.tsx                 # Card individual programare
├── AppointmentFilters.tsx              # Filtre și căutare
└── AppointmentStats.tsx                # Statistici
```

## API și Acțiuni

### Acțiuni Server

- `getStylistAppointmentsWithDetailsAction(stylistId)` - Obține programările cu detalii
- `updateStylistAppointmentStatusAction(payload)` - Actualizează statusul programării

### Tipuri de Date

- `AppointmentWithDetails` - Programare cu informații despre serviciu și stilist
- `AppointmentStatus` - Enum cu toate statusurile posibile

## Principii de Design

1. **Componente Dumb**: Toate componentele sunt prezentationale
2. **Server Components**: Data fetching în page.tsx
3. **Type Safety**: TypeScript strict pentru toate tipurile
4. **Responsive Design**: Tailwind CSS pentru layout adaptiv
5. **Accessibility**: Iconițe cu aria-labels și contrast adecvat
6. **Performance**: Memoization pentru calcule costisitoare

## Stiluri și Design System

- **Culori**: Folosește paleta de culori din Tailwind config
- **Spacing**: Sistemul de spacing consistent din Tailwind
- **Typography**: Font-uri și dimensiuni din design system
- **Components**: shadcn/ui pentru consistență
- **Animations**: Tranziții subtile pentru hover states

## Securitate

- **Autorizare**: Verificare rol stilist în page.tsx
- **Validare**: Zod schemas pentru toate input-urile
- **Sanitizare**: Toate datele sunt validate înainte de procesare
- **Logging**: Logging complet pentru auditare

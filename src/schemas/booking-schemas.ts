import { z } from 'zod'

// Schema pentru datele clientului
export const clientDataSchema = z.object({
  clientName: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere'),
  clientPhone: z
    .string()
    .min(1, 'Numărul de telefon este obligatoriu')
    .regex(
      /^(\+373|373|0)[0-9]{8}$/,
      'Numărul de telefon trebuie să fie în format moldovenesc (+373, 373 sau 0 urmat de 8 cifre)',
    ),
  clientEmail: z.string().email('Adresa de email nu este validă'),
  clientNotes: z.string().optional(),
})

// Schema pentru selecția serviciului
export const serviceSelectionSchema = z.object({
  serviceId: z.string().min(1, 'Serviciul este obligatoriu'),
})

// Schema pentru selecția stilistului
export const stylistSelectionSchema = z.object({
  stylistId: z.string().min(1, 'Stilistul este obligatoriu'),
})

// Schema pentru selecția slot-ului
export const slotSelectionSchema = z.object({
  startTime: z.string().min(1, 'Ora de început este obligatorie'),
  endTime: z.string().min(1, 'Ora de sfârșit este obligatorie'),
})

// Schema completă pentru booking
export const bookingFormSchema = z.object({
  serviceId: z.string().min(1, 'Serviciul este obligatoriu'),
  stylistId: z.string().min(1, 'Stilistul este obligatoriu'),
  startTime: z.string().min(1, 'Ora de început este obligatorie'),
  endTime: z.string().min(1, 'Ora de sfârșit este obligatorie'),
  clientName: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere'),
  clientPhone: z
    .string()
    .min(1, 'Numărul de telefon este obligatoriu')
    .regex(
      /^(\+373|373|0)[0-9]{8}$/,
      'Numărul de telefon trebuie să fie în format moldovenesc (+373, 373 sau 0 urmat de 8 cifre)',
    ),
  clientEmail: z.string().email('Adresa de email nu este validă'),
  clientNotes: z.string().optional(),
})

// Tipuri TypeScript derivate din schemas
export type ClientData = z.infer<typeof clientDataSchema>
export type ServiceSelection = z.infer<typeof serviceSelectionSchema>
export type StylistSelection = z.infer<typeof stylistSelectionSchema>
export type SlotSelection = z.infer<typeof slotSelectionSchema>
export type BookingFormData = z.infer<typeof bookingFormSchema>

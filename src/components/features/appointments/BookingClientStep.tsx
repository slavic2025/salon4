// src/components/features/appointments/BookingClientStep.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { type ClientData, clientDataSchema } from '@/schemas/booking-schemas'
import { useBookingStore } from '@/stores/booking-store'

interface BookingClientStepProps {
  onSubmit: () => void
}

// Component pentru validare vizuală compact
const ValidationIndicator = ({ isValid, isDirty, error }: { isValid: boolean; isDirty: boolean; error?: string }) => {
  if (!isDirty) return null

  if (error) {
    return (
      <div className="flex items-center space-x-1.5 text-red-600 text-xs">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{error}</span>
      </div>
    )
  }

  if (isValid) {
    return (
      <div className="flex items-center space-x-1.5 text-slate-600 text-xs">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>Perfect!</span>
      </div>
    )
  }

  return null
}

export default function BookingClientStep({ onSubmit }: BookingClientStepProps) {
  const { clientData, setClientData, setLoading, setError } = useBookingStore()

  const form = useForm<ClientData>({
    resolver: zodResolver(clientDataSchema),
    defaultValues: {
      clientName: clientData?.clientName || '',
      clientPhone: clientData?.clientPhone || '',
      clientEmail: clientData?.clientEmail || '',
      clientNotes: clientData?.clientNotes || '',
    },
    mode: 'onChange', // Validare în timp real
  })

  // Auto-focus pe primul câmp la montarea componentei
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstInput = document.querySelector('input[name="clientName"]') as HTMLInputElement
      if (firstInput) {
        firstInput.focus()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Auto-focus pe primul câmp cu eroare
  useEffect(() => {
    const errors = form.formState.errors
    const firstErrorField = Object.keys(errors)[0]

    if (firstErrorField) {
      setTimeout(() => {
        const errorInput = document.querySelector(
          `input[name="${firstErrorField}"], textarea[name="${firstErrorField}"]`,
        ) as HTMLElement
        if (errorInput) {
          errorInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
          errorInput.focus()
        }
      }, 300) // Delay pentru a permite animațiile să se termine
    }
  }, [form.formState.errors])

  const handleSubmit = async (data: ClientData) => {
    setLoading(true)
    setError(null)

    try {
      setClientData({
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail,
        clientNotes: data.clientNotes || '',
      })
      onSubmit()
    } catch {
      setError('A apărut o eroare. Vă rugăm să încercați din nou.')
    } finally {
      setLoading(false)
    }
  }

  // Calculează progresul completării formularului
  const watchedValues = form.watch()
  const requiredFields = ['clientName', 'clientPhone', 'clientEmail']
  const completedRequiredFields = requiredFields.filter((field) =>
    watchedValues[field as keyof ClientData]?.toString().trim(),
  ).length
  const completionPercentage = (completedRequiredFields / requiredFields.length) * 100

  return (
    <div className="space-y-6">
      {/* Header Section îmbunătățit și compact */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Informațiile tale</h2>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Completează datele pentru finalizarea programării. Toate câmpurile marcate cu * sunt obligatorii.
        </p>
      </div>

      {/* Progress bar îmbunătățit și compact pentru completarea formularului */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
          <span>Progres completare</span>
          <span className="font-semibold">{Math.round(completionPercentage)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-slate-700 to-slate-800 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Form îmbunătățit și compact */}
      <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-lg mx-auto space-y-6">
        {/* Nume complet */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label htmlFor="clientName" className="text-sm font-semibold text-slate-900">
            Nume și prenume <span className="text-red-500">*</span>
          </Label>
          <Input
            id="clientName"
            {...form.register('clientName')}
            placeholder="ex: Ana Maria Popescu"
            className={`h-10 text-sm transition-all duration-300 ${
              form.formState.errors.clientName
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : form.watch('clientName')?.trim()
                  ? 'border-slate-300 focus:ring-slate-500 focus:border-slate-500'
                  : 'focus:ring-slate-500 focus:border-slate-500'
            }`}
            autoComplete="name"
          />
          <ValidationIndicator
            isValid={!form.formState.errors.clientName && !!form.watch('clientName')?.trim()}
            isDirty={!!form.watch('clientName')}
            error={form.formState.errors.clientName?.message}
          />
        </motion.div>

        {/* Număr de telefon */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="clientPhone" className="text-sm font-semibold text-slate-900">
            Număr de telefon <span className="text-red-500">*</span>
          </Label>
          <Input
            id="clientPhone"
            {...form.register('clientPhone')}
            placeholder="ex: 0721234567"
            type="tel"
            className={`h-10 text-sm transition-all duration-300 ${
              form.formState.errors.clientPhone
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : form.watch('clientPhone')?.trim()
                  ? 'border-slate-300 focus:ring-slate-500 focus:border-slate-500'
                  : 'focus:ring-slate-500 focus:border-slate-500'
            }`}
            autoComplete="tel"
          />
          <ValidationIndicator
            isValid={!form.formState.errors.clientPhone && !!form.watch('clientPhone')?.trim()}
            isDirty={!!form.watch('clientPhone')}
            error={form.formState.errors.clientPhone?.message}
          />
          <p className="text-xs text-slate-500">Vom folosi acest număr pentru confirmarea programării</p>
        </motion.div>

        {/* Adresa de email */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label htmlFor="clientEmail" className="text-sm font-semibold text-slate-900">
            Adresa de email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="clientEmail"
            type="email"
            {...form.register('clientEmail')}
            placeholder="ex: ana.popescu@email.com"
            className={`h-10 text-sm transition-all duration-300 ${
              form.formState.errors.clientEmail
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : form.watch('clientEmail')?.trim()
                  ? 'border-slate-300 focus:ring-slate-500 focus:border-slate-500'
                  : 'focus:ring-slate-500 focus:border-slate-500'
            }`}
            autoComplete="email"
          />
          <ValidationIndicator
            isValid={!form.formState.errors.clientEmail && !!form.watch('clientEmail')?.trim()}
            isDirty={!!form.watch('clientEmail')}
            error={form.formState.errors.clientEmail?.message}
          />
          <p className="text-xs text-slate-500">Vei primi confirmarea programării pe acest email</p>
        </motion.div>

        {/* Note opționale */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Label htmlFor="clientNotes" className="text-sm font-semibold text-slate-900">
            Note sau cerințe speciale
            <span className="text-slate-500 ml-2 font-normal">(opțional)</span>
          </Label>
          <Textarea
            id="clientNotes"
            {...form.register('clientNotes')}
            placeholder="ex: Am părul foarte gros, prefer stilul clasic, sunt alergic la..."
            rows={3}
            className="resize-none transition-all duration-300 focus:ring-slate-500 focus:border-slate-500 text-sm"
          />
          <p className="text-xs text-slate-500">Ajută-ne să îți oferim exact ceea ce dorești</p>
        </motion.div>

        {/* Submit button îmbunătățit și compact */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Se salvează...</span>
              </div>
            ) : (
              'Continuă la confirmare'
            )}
          </Button>
        </motion.div>

        {/* Informații de confidențialitate îmbunătățite și compacte */}
        <motion.div
          className="text-center p-4 bg-gradient-to-r from-stone-50 to-stone-100 rounded-xl border border-stone-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-1">
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-xs font-semibold text-slate-900">Confidențialitate garantată</span>
          </div>
          <p className="text-xs text-slate-700">
            Datele tale sunt în siguranță și vor fi folosite doar pentru programare
          </p>
        </motion.div>
      </form>
    </div>
  )
}

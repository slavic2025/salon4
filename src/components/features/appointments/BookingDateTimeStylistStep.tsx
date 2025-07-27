// src/components/features/appointments/BookingDateTimeStylistStep.tsx
'use client'

import { addDays, format } from 'date-fns'
import { ro } from 'date-fns/locale'
import { AnimatePresence, easeOut, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { BookingCalendar } from '@/components/ui/booking-calendar'
import { BookingStylistPicker } from '@/components/ui/booking-stylist-picker'
import { BookingTimeSlots } from '@/components/ui/booking-time-slots'
import type { Slot } from '@/core/domains/appointments/appointment.utils'
import type { Stylist } from '@/core/domains/stylists/stylist.types'
import { getAvailableSlotsPublicAction, getStylistsForServicePublicAction } from '@/features/appointments/actions'
import { useBookingStore } from '@/stores/booking-store'

interface BookingDateTimeStylistStepProps {
  onNext: () => void
}

// Animation variants îmbunătățite
const fadeInUp = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -30, scale: 0.95 },
  transition: { duration: 0.4, ease: easeOut },
}

const slideIn = {
  initial: { opacity: 0, x: 40, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -40, scale: 0.95 },
  transition: { duration: 0.4, ease: easeOut },
}

// Loading skeleton îmbunătățit
const LoadingSkeleton = () => (
  <div className="flex items-center justify-center py-16">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full animate-pulse mx-auto mb-6"></div>
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 rounded-lg w-48 mx-auto animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
      </div>
    </div>
  </div>
)

export default function BookingDateTimeStylistStep({ onNext }: BookingDateTimeStylistStepProps) {
  // State pentru progresul în cadrul acestui pas
  const [currentSubStep, setCurrentSubStep] = useState<'date' | 'time' | 'stylist'>('date')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([])
  const [availableStylists, setAvailableStylists] = useState<Stylist[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Store state - ignorăm setStoreError ca nu îl folosim
  const { service, slot, stylist, setSlot, setStylist } = useBookingStore()

  // Resetează sub-pas-ul când componenta se montează
  useEffect(() => {
    setCurrentSubStep('date')
    setSelectedDate(undefined)
    setAvailableSlots([])
    setAvailableStylists([])
  }, [])

  // Handler pentru selectarea datei
  const handleDateSelect = async (date: Date) => {
    if (!service?.id) return

    setSelectedDate(date)
    setLoading(true)
    setError(null)

    try {
      // Obține sloturile disponibile pentru data selectată
      const slots = await getAvailableSlotsPublicAction({
        serviceId: service.id,
        stylistId: '', // Inițial căutăm pentru toți stiliștii
        fromDate: format(date, 'yyyy-MM-dd'),
        days: 1, // Doar pentru ziua selectată
      })

      setAvailableSlots(slots)
      setCurrentSubStep('time')
    } catch (err) {
      setError('Eroare la încărcarea sloturilor disponibile. Vă rugăm să încercați din nou.')
      console.error('Error loading slots:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handler pentru selectarea slot-ului
  const handleSlotSelect = async (selectedSlot: Slot) => {
    if (!service?.id) return

    setSlot(selectedSlot)
    setLoading(true)
    setError(null)

    try {
      // Obține stiliștii disponibili pentru serviciul și slot-ul selectat
      const stylists = await getStylistsForServicePublicAction(service.id)

      // TODO: Filtrează stiliștii în funcție de disponibilitate pentru slot-ul specific
      // Pentru moment returnăm toți stiliștii care oferă serviciul
      setAvailableStylists(stylists)
      setCurrentSubStep('stylist')
    } catch (err) {
      setError('Eroare la încărcarea stiliștilor disponibili. Vă rugăm să încercați din nou.')
      console.error('Error loading stylists:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handler pentru selectarea stilistului
  const handleStylistSelect = (selectedStylist: Stylist) => {
    setStylist(selectedStylist)
    // Mici delay pentru a permite vizualizarea selecției
    setTimeout(() => {
      onNext()
    }, 500)
  }

  // Funcție pentru a merge înapoi la sub-pas-ul anterior
  const goBackToSubStep = (subStep: 'date' | 'time' | 'stylist') => {
    setCurrentSubStep(subStep)
    if (subStep === 'date') {
      setSelectedDate(undefined)
      setAvailableSlots([])
      setAvailableStylists([])
      // Resetăm slot și stylist în store
      setSlot(null)
      setStylist(null)
    } else if (subStep === 'time') {
      setAvailableStylists([])
      // Resetăm doar stylist
      setStylist(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress indicator îmbunătățit pentru sub-pași */}
      <div className="flex items-center justify-center space-x-4 mb-12">
        <div className="flex items-center space-x-3">
          <div
            className={`w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center ${
              currentSubStep === 'date'
                ? 'bg-gradient-to-r from-slate-600 to-slate-700 scale-125 shadow-lg'
                : selectedDate
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : 'bg-gray-300'
            }`}
          >
            {selectedDate && currentSubStep !== 'date' && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span
            className={`text-sm font-semibold transition-colors ${
              currentSubStep === 'date' ? 'text-slate-700' : selectedDate ? 'text-emerald-700' : 'text-gray-400'
            }`}
          >
            Data
          </span>
        </div>

        <div
          className={`w-16 h-1 rounded-full transition-all duration-300 ${
            availableSlots.length > 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gray-300'
          }`}
        />

        <div className="flex items-center space-x-3">
          <div
            className={`w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center ${
              currentSubStep === 'time'
                ? 'bg-gradient-to-r from-slate-600 to-slate-700 scale-125 shadow-lg'
                : slot
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : 'bg-gray-300'
            }`}
          >
            {slot && currentSubStep !== 'time' && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span
            className={`text-sm font-semibold transition-colors ${
              currentSubStep === 'time' ? 'text-slate-700' : slot ? 'text-emerald-700' : 'text-gray-400'
            }`}
          >
            Ora
          </span>
        </div>

        <div
          className={`w-16 h-1 rounded-full transition-all duration-300 ${
            availableStylists.length > 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gray-300'
          }`}
        />

        <div className="flex items-center space-x-3">
          <div
            className={`w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center ${
              currentSubStep === 'stylist'
                ? 'bg-gradient-to-r from-slate-600 to-slate-700 scale-125 shadow-lg'
                : stylist
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : 'bg-gray-300'
            }`}
          >
            {stylist && currentSubStep !== 'stylist' && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span
            className={`text-sm font-semibold transition-colors ${
              currentSubStep === 'stylist' ? 'text-slate-700' : stylist ? 'text-emerald-700' : 'text-gray-400'
            }`}
          >
            Stilist
          </span>
        </div>
      </div>

      {/* Header dinamic îmbunătățit */}
      <div className="text-center">
        <motion.h2
          className="text-3xl font-bold text-slate-900 mb-4"
          key={currentSubStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentSubStep === 'date' && 'Selectează data programării'}
          {currentSubStep === 'time' && 'Alege ora potrivită'}
          {currentSubStep === 'stylist' && 'Selectează stilistul preferat'}
        </motion.h2>
        <motion.p
          className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed"
          key={`${currentSubStep}-desc`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {currentSubStep === 'date' && 'Alege ziua în care dorești să vii la salon'}
          {currentSubStep === 'time' &&
            `Selectează ora pentru ${selectedDate ? format(selectedDate, 'EEEE, d MMMM', { locale: ro }) : ''}`}
          {currentSubStep === 'stylist' && `Alege cine să îți ofere serviciul ${service?.name || ''}`}
        </motion.p>
      </div>

      {/* Breadcrumb îmbunătățit */}
      {currentSubStep !== 'date' && (
        <motion.div
          className="flex items-center justify-center space-x-3 text-sm text-slate-500 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedDate && (
            <>
              <button
                onClick={() => goBackToSubStep('date')}
                className="px-4 py-2 bg-gradient-to-r from-stone-100 to-stone-200 rounded-full hover:from-stone-200 hover:to-stone-300 transition-all duration-200 font-medium text-slate-700 hover:scale-105"
              >
                {format(selectedDate, 'dd MMM yyyy', { locale: ro })}
              </button>
              {currentSubStep !== 'time' && (
                <>
                  <span className="text-gray-300">→</span>
                  <button
                    onClick={() => goBackToSubStep('time')}
                    className="px-4 py-2 bg-gradient-to-r from-stone-100 to-stone-200 rounded-full hover:from-stone-200 hover:to-stone-300 transition-all duration-200 font-medium text-slate-700 hover:scale-105"
                  >
                    {slot ? format(new Date(slot.start), 'HH:mm', { locale: ro }) : 'Ora'}
                  </button>
                </>
              )}
            </>
          )}
        </motion.div>
      )}

      {/* Error Display îmbunătățit */}
      {error && (
        <motion.div
          className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-xl shadow-sm"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-red-800 font-semibold mb-1">Eroare</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content cu animații îmbunătățite */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          {/* Pas 1: Calendar pentru data */}
          {currentSubStep === 'date' && (
            <motion.div key="calendar" {...fadeInUp}>
              <BookingCalendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                maxDate={addDays(new Date(), 60)} // Programări maxim 60 de zile în viitor
                disabled={loading}
              />
            </motion.div>
          )}

          {/* Pas 2: Time slots pentru ora */}
          {currentSubStep === 'time' && (
            <motion.div key="timeslots" {...slideIn}>
              <BookingTimeSlots
                slots={availableSlots}
                selectedSlot={slot || undefined}
                onSlotSelect={handleSlotSelect}
                date={selectedDate}
                disabled={loading}
              />
            </motion.div>
          )}

          {/* Pas 3: Stylist picker */}
          {currentSubStep === 'stylist' && (
            <motion.div key="stylists" {...slideIn}>
              <BookingStylistPicker
                stylists={availableStylists}
                selectedStylist={stylist || undefined}
                onStylistSelect={handleStylistSelect}
                disabled={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading overlay îmbunătățit */}
      {loading && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
              <div>
                <p className="text-slate-700 font-medium">Se încarcă...</p>
                <p className="text-sm text-slate-500">
                  {currentSubStep === 'date' && 'Se caută sloturile disponibile'}
                  {currentSubStep === 'time' && 'Se caută stiliștii disponibili'}
                  {currentSubStep === 'stylist' && 'Se finalizează selecția'}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

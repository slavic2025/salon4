// src/components/features/appointments/BookingSlotStep.tsx
'use client'

import { format } from 'date-fns'
import { ro } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { BookingTimeSlots } from '@/components/ui/booking-time-slots'
import type { Slot } from '@/core/domains/appointments/appointment.utils'
import { getAvailableSlotsPublicAction } from '@/features/appointments/actions'
import { useBookingStore } from '@/stores/booking-store'

interface BookingSlotStepProps {
  onNext: () => void
}

// Animation variants îmbunătățite
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
}

// Loading skeleton îmbunătățit
const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="text-center">
      <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
      <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
      ))}
    </div>
  </div>
)

// Empty state îmbunătățit
const EmptyState = ({ slotDate }: { slotDate: Date }) => (
  <motion.div
    className="text-center py-16"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">Nu sunt sloturi disponibile</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
      Pentru {format(slotDate, 'EEEE, d MMMM yyyy', { locale: ro })} nu sunt momente libere. Vă rugăm să alegeți o altă
      dată.
    </p>
    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Încercați să selectați o altă zi din calendar</span>
    </div>
  </motion.div>
)

export default function BookingSlotStep({ onNext }: BookingSlotStepProps) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  // Store state
  const { service, stylist, slot, setSlot } = useBookingStore()

  // Încarcă sloturile disponibile
  useEffect(() => {
    const loadSlots = async () => {
      if (!service?.id || !slot) return

      setLoading(true)
      setError(null)

      try {
        const slotDate = new Date(slot.start)
        const availableSlots = await getAvailableSlotsPublicAction({
          serviceId: service.id,
          stylistId: stylist?.id || '',
          fromDate: format(slotDate, 'yyyy-MM-dd'),
          days: 1,
        })

        setSlots(availableSlots)
      } catch (err) {
        setError('Eroare la încărcarea sloturilor disponibile. Vă rugăm să încercați din nou.')
        console.error('Error loading slots:', err)
      } finally {
        setLoading(false)
      }
    }

    void loadSlots()
  }, [service?.id, stylist?.id, slot])

  // Handler pentru selectarea slot-ului
  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot)
    setSlot(slot)

    // Mici delay pentru a permite vizualizarea selecției
    setTimeout(() => {
      onNext()
    }, 500)
  }

  // Dacă nu avem date necesare, afișăm loading
  if (!service || !slot) {
    return <LoadingSkeleton />
  }

  // Derivă data slotului selectat pentru afișare
  const slotDate = new Date(slot.start)

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header îmbunătățit */}
      <motion.div className="text-center" variants={itemVariants}>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Selectează ora programării</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Alege momentul potrivit pentru {format(slotDate, 'EEEE, d MMMM yyyy', { locale: ro })}
          {stylist && ` cu ${stylist.fullName}`}
        </p>
      </motion.div>

      {/* Informații despre serviciu și stilist */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{service.name}</h3>
              <p className="text-sm text-gray-600">
                {service.duration} min • {service.price} RON
              </p>
            </div>
          </div>

          {stylist && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {stylist.fullName
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')}
                </span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{stylist.fullName}</p>
                <p className="text-sm text-gray-600">Stilist</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Error Display îmbunătățit */}
      {error && (
        <motion.div
          className="p-6 bg-red-50 border-l-4 border-red-400 rounded-xl shadow-sm"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
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

      {/* Content principal */}
      <motion.div className="min-h-[400px]" variants={itemVariants}>
        {loading ? (
          <LoadingSkeleton />
        ) : slots.length === 0 ? (
          <EmptyState slotDate={slotDate} />
        ) : (
          <div className="space-y-6">
            {/* Statistici rapide */}
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span>{slots.length} sloturi disponibile</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span>Sloturi ocupate</span>
              </div>
            </div>

            {/* Grid de sloturi îmbunătățit */}
            <BookingTimeSlots
              slots={slots}
              selectedSlot={selectedSlot || undefined}
              onSlotSelect={handleSlotSelect}
              date={slotDate}
              disabled={loading}
            />
          </div>
        )}
      </motion.div>

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
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div>
                <p className="text-gray-700 font-medium">Se încarcă sloturile...</p>
                <p className="text-sm text-gray-500">Se verifică disponibilitatea pentru data selectată</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

// src/components/features/appointments/BookingFormStepper.tsx
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'

import { BookingSummary } from '@/components/ui/booking-summary'
import { ProgressIndicator } from '@/components/ui/progress-indicator'
import { StepNavigation } from '@/components/ui/step-navigation'
import { createPublicAppointmentAction } from '@/features/appointments/actions'
import { bookingFormSchema } from '@/schemas/booking-schemas'
import { useBookingStore } from '@/stores/booking-store'

import BookingClientStep from './BookingClientStep'
import BookingConfirmationStep from './BookingConfirmationStep'
import BookingDateTimeStylistStep from './BookingDateTimeStylistStep'
import BookingServiceStep from './BookingServiceStep'

const steps = ['Serviciu', 'Data & Programare', 'Informații', 'Confirmare']

// Animation variants îmbunătățite pentru performanță și smoothness
const pageVariants = {
  initial: { opacity: 0, x: 20, scale: 0.98 },
  in: { opacity: 1, x: 0, scale: 1 },
  out: { opacity: 0, x: -20, scale: 0.98 },
}

const pageTransition = {
  type: 'tween' as const,
  ease: 'easeOut' as const,
  duration: 0.4,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
}

// Loading skeleton pentru o experiență mai fluidă
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
      ))}
    </div>
  </div>
)

export default function BookingFormStepper() {
  const {
    currentStep,
    totalSteps,
    service,
    stylist,
    slot,
    clientData,
    isLoading,
    error,
    isSubmitted,
    nextStep,
    prevStep,
    canGoNext,
    canGoPrev,
    setLoading,
    setError,
    setSubmitted,
    setCurrentStep,
    reset,
  } = useBookingStore()

  // Reset store when component mounts
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      reset()
    }
  }, [reset])

  const handleNext = () => {
    if (canGoNext()) {
      nextStep()
    }
  }

  const handlePrev = () => {
    if (canGoPrev()) {
      prevStep()
    }
  }

  const handleEdit = () => {
    // Înapoi la pasul de date personale pentru editare
    setCurrentStep(2)
  }

  const handleSubmit = async () => {
    if (!service || !stylist || !slot || !clientData) {
      setError('Toate câmpurile sunt obligatorii')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Validare cu Zod
      const bookingData = {
        serviceId: service.id,
        stylistId: stylist.id,
        startTime: slot.start,
        endTime: slot.end,
        clientName: clientData.clientName,
        clientPhone: clientData.clientPhone,
        clientEmail: clientData.clientEmail,
        clientNotes: clientData.clientNotes,
      }

      const validationResult = bookingFormSchema.safeParse(bookingData)
      if (!validationResult.success) {
        setError('Datele introduse nu sunt valide.')
        return
      }

      // Submit server action
      const response = await createPublicAppointmentAction(validationResult.data)
      const data = response?.data

      if (data && typeof data === 'object' && 'success' in data) {
        if (data.success) {
          setSubmitted(true)
        } else {
          setError(typeof (data as any).message === 'string' ? (data as any).message : 'Eroare la trimitere.')
        }
      } else {
        setError('Eroare la trimitere.')
      }
    } catch {
      setError('A apărut o eroare neașteptată. Vă rugăm să încercați din nou.')
    } finally {
      setLoading(false)
    }
  }

  // Success state cu animații îmbunătățite
  if (isSubmitted) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="max-w-2xl mx-auto text-center w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-emerald-100"
            variants={itemVariants}
          >
            <motion.div
              className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8"
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <motion.h2 className="text-4xl font-bold text-emerald-600 mb-6" variants={itemVariants}>
              Programarea a fost trimisă cu succes! 🎉
            </motion.h2>

            <motion.p className="text-gray-700 text-xl mb-3" variants={itemVariants}>
              Vă mulțumim pentru programare, <strong className="text-gray-900">{clientData?.clientName}</strong>!
            </motion.p>

            <motion.p className="text-gray-600 mb-10" variants={itemVariants}>
              Veți primi o confirmare pe email la <strong className="text-gray-900">{clientData?.clientEmail}</strong>{' '}
              în curând.
            </motion.p>

            {/* Detalii programare în success - design îmbunătățit */}
            <motion.div
              className="bg-gradient-to-r from-gray-50 to-emerald-50 rounded-2xl p-8 mb-10 text-left border border-emerald-200"
              variants={itemVariants}
            >
              <h3 className="font-bold text-gray-900 mb-6 text-lg flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                Detaliile programării:
              </h3>
              <div className="space-y-4 text-base">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Serviciu:</span>
                  <span className="font-semibold text-gray-900">{service?.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Stilist:</span>
                  <span className="font-semibold text-gray-900">{stylist?.fullName}</span>
                </div>
                {slot && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Data:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(slot.start).toLocaleDateString('ro-RO', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Ora:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(slot.start).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {new Date(slot.end).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center py-3 bg-emerald-50 rounded-lg px-4">
                  <span className="text-gray-700 font-medium">Total:</span>
                  <span className="font-bold text-2xl text-emerald-600">{service?.price} lei</span>
                </div>
              </div>
            </motion.div>

            <motion.button
              onClick={reset}
              className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Programează din nou
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header îmbunătățit */}
        <motion.div className="text-center mb-12" variants={containerVariants} initial="hidden" animate="visible">
          <motion.h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" variants={itemVariants}>
            Programează-te online
          </motion.h1>
          <motion.p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed" variants={itemVariants}>
            Simplu, rapid și convenabil - rezervă-ți locul în salon în câteva minute
          </motion.p>
        </motion.div>

        {/* Progress Indicator îmbunătățit */}
        <motion.div className="mb-12" variants={itemVariants} initial="hidden" animate="visible">
          <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} steps={steps} />
        </motion.div>

        {/* Main Content with Sidebar - layout îmbunătățit */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="xl:col-span-3">
            {/* Error Display îmbunătățit */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mb-8 p-6 bg-red-50 border-l-4 border-red-400 rounded-xl shadow-sm"
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
            </AnimatePresence>

            {/* Step Content - design îmbunătățit */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6 sm:p-8 lg:p-10 xl:p-12">
                <AnimatePresence mode="wait">
                  {currentStep === 0 && (
                    <motion.div
                      key="step-0"
                      variants={pageVariants}
                      initial="initial"
                      animate="in"
                      exit="out"
                      transition={pageTransition}
                      className="w-full"
                    >
                      <BookingServiceStep onNext={handleNext} />
                    </motion.div>
                  )}
                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      variants={pageVariants}
                      initial="initial"
                      animate="in"
                      exit="out"
                      transition={pageTransition}
                    >
                      <BookingDateTimeStylistStep onNext={handleNext} />
                    </motion.div>
                  )}
                  {currentStep === 2 && (
                    <motion.div
                      key="step-2"
                      variants={pageVariants}
                      initial="initial"
                      animate="in"
                      exit="out"
                      transition={pageTransition}
                    >
                      <BookingClientStep onSubmit={handleNext} />
                    </motion.div>
                  )}
                  {currentStep === 3 && (
                    <motion.div
                      key="step-3"
                      variants={pageVariants}
                      initial="initial"
                      animate="in"
                      exit="out"
                      transition={pageTransition}
                    >
                      <BookingConfirmationStep onConfirm={handleSubmit} onEdit={handleEdit} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation îmbunătățită */}
              {currentStep !== 3 && (
                <motion.div
                  className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 p-6 sm:p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <StepNavigation
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    canGoNext={canGoNext()}
                    canGoPrev={canGoPrev()}
                    isLoading={isLoading}
                  />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Summary îmbunătățit */}
          <motion.div
            className="xl:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <BookingSummary />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

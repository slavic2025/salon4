// src/components/features/appointments/BookingFormStepper.tsx
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { toast } from 'sonner'

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
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
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

  // Funcție pentru scroll automat la erori
  const scrollToError = () => {
    if (error) {
      setTimeout(() => {
        const errorElement = document.getElementById('error-display')
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  // Scroll la erori când se afișează
  useEffect(() => {
    if (error) {
      scrollToError()
    }
  }, [error])

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
      const errorMessage = 'Toate câmpurile sunt obligatorii pentru a finaliza programarea'
      setError(errorMessage)
      toast.error('Eroare de validare', {
        description: errorMessage,
        duration: 5000,
      })
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
        // Parsez erorile de validare pentru a le afișa specific
        const fieldErrors = validationResult.error.flatten().fieldErrors
        const errorMessages = Object.entries(fieldErrors)
          .map(([field, errors]) => {
            const fieldName =
              {
                clientName: 'Numele',
                clientPhone: 'Numărul de telefon',
                clientEmail: 'Adresa de email',
                serviceId: 'Serviciul',
                stylistId: 'Stilistul',
                startTime: 'Ora de început',
                endTime: 'Ora de sfârșit',
              }[field] || field

            return `${fieldName}: ${errors?.[0] || 'Câmp invalid'}`
          })
          .join('\n')

        const errorMessage = 'Vă rugăm să corectați următoarele erori:\n' + errorMessages
        setError(errorMessage)

        // Afișez notificare cu erorile specifice
        toast.error('Eroare de validare', {
          description: errorMessages,
          duration: 8000,
        })

        // Scroll la primul câmp cu eroare
        const firstErrorField = Object.keys(fieldErrors)[0]
        if (firstErrorField) {
          setTimeout(() => {
            const errorElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement
            if (errorElement) {
              errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
              errorElement.focus()
            }
          }, 100)
        }

        return
      }

      // Submit server action
      const response = await createPublicAppointmentAction(validationResult.data)
      const data = response?.data

      if (data && typeof data === 'object' && 'success' in data) {
        if (data.success) {
          setSubmitted(true)
          toast.success('Programare trimisă cu succes!', {
            description: 'Vă mulțumim pentru programare. Veți primi o confirmare în curând.',
            duration: 6000,
          })
        } else {
          const errorMessage =
            typeof (data as any).message === 'string' ? (data as any).message : 'Eroare la trimiterea programării'
          setError(errorMessage)
          toast.error('Eroare la trimitere', {
            description: errorMessage,
            duration: 6000,
          })
        }
      } else {
        const errorMessage = 'Eroare la trimiterea programării. Vă rugăm să încercați din nou.'
        setError(errorMessage)
        toast.error('Eroare la trimitere', {
          description: errorMessage,
          duration: 6000,
        })
      }
    } catch (error) {
      const errorMessage = 'A apărut o eroare neașteptată. Vă rugăm să încercați din nou.'
      setError(errorMessage)
      toast.error('Eroare neașteptată', {
        description: errorMessage,
        duration: 6000,
      })
    } finally {
      setLoading(false)
    }
  }

  // Success state cu animații îmbunătățite
  if (isSubmitted) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center p-4 sm:p-6"
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
            className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-purple-100"
            variants={itemVariants}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <motion.h2 className="text-3xl font-bold text-purple-600 mb-4" variants={itemVariants}>
              Programarea a fost trimisă cu succes! 🎉
            </motion.h2>

            <motion.p className="text-gray-700 text-lg mb-2" variants={itemVariants}>
              Vă mulțumim pentru programare, <strong className="text-gray-900">{clientData?.clientName}</strong>!
            </motion.p>

            <motion.p className="text-gray-600 mb-8" variants={itemVariants}>
              Veți primi o confirmare pe email la <strong className="text-gray-900">{clientData?.clientEmail}</strong>{' '}
              în curând.
            </motion.p>

            {/* Detalii programare în success - design îmbunătățit */}
            <motion.div
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 text-left border border-purple-200"
              variants={itemVariants}
            >
              <h3 className="font-bold text-gray-900 mb-4 text-base flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Detaliile programării:
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-purple-200">
                  <span className="text-gray-600">Serviciu:</span>
                  <span className="font-semibold text-gray-900">{service?.name}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-purple-200">
                  <span className="text-gray-600">Stilist:</span>
                  <span className="font-semibold text-gray-900">{stylist?.fullName}</span>
                </div>
                {slot && (
                  <>
                    <div className="flex justify-between items-center py-1 border-b border-purple-200">
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
                    <div className="flex justify-between items-center py-1 border-b border-purple-200">
                      <span className="text-gray-600">Ora:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(slot.start).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {new Date(slot.end).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center py-2 bg-purple-100 rounded-lg px-3">
                  <span className="text-gray-700 font-medium">Total:</span>
                  <span className="font-bold text-xl text-purple-600">{service?.price} lei</span>
                </div>
              </div>
            </motion.div>

            <motion.button
              onClick={reset}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
      className="min-h-screen bg-gradient-to-br from-slate-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header îmbunătățit și compact */}
        <motion.div
          className="text-center mb-6 sm:mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3" variants={itemVariants}>
            Programează-te online
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4"
            variants={itemVariants}
          >
            Simplu, rapid și convenabil - rezervă-ți locul în salon în câteva minute
          </motion.p>
        </motion.div>

        {/* Progress Indicator îmbunătățit */}
        <motion.div className="mb-6 sm:mb-8 px-4" variants={itemVariants} initial="hidden" animate="visible">
          <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} steps={steps} />
        </motion.div>

        {/* Main Content with Sidebar - layout îmbunătățit */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Error Display îmbunătățit */}
            <AnimatePresence>
              {error && (
                <motion.div
                  id="error-display"
                  className="mb-4 sm:mb-6 p-4 sm:p-5 bg-red-50 border-l-4 border-red-400 rounded-xl shadow-lg sticky top-4 z-10"
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 sm:w-5 sm:h-5 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-red-800 font-semibold mb-2 text-sm sm:text-base">Eroare de validare</h3>
                      <div className="text-red-700 text-xs sm:text-sm space-y-1">
                        {error.split('\n').map((line, index) => (
                          <p key={index} className="leading-relaxed break-words">
                            {line}
                          </p>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setError(null)
                          toast.dismiss()
                        }}
                        className="mt-2 text-red-600 hover:text-red-800 text-xs font-medium underline"
                      >
                        Închide mesajul
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Content - design îmbunătățit și compact */}
            <motion.div
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-4 sm:p-6 lg:p-8">
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

              {/* Navigation îmbunătățită și compactă */}
              {currentStep !== 3 && (
                <motion.div
                  className="border-t border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6"
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
            className="lg:col-span-1"
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

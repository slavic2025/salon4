import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Slot } from '@/core/domains/appointments/appointment.utils'
import type { Service } from '@/core/domains/services/service.types'
import type { Stylist } from '@/core/domains/stylists/stylist.types'

export interface BookingState {
  // Current step
  currentStep: number
  totalSteps: number

  // Form data
  service: Service | null
  stylist: Stylist | null
  slot: Slot | null
  clientData: {
    clientName: string
    clientPhone: string
    clientEmail: string
    clientNotes: string
  } | null

  // UI state
  isLoading: boolean
  error: string | null
  isSubmitted: boolean

  // Actions
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setService: (service: Service | null) => void
  setStylist: (stylist: Stylist | null) => void
  setSlot: (slot: Slot | null) => void
  setClientData: (data: BookingState['clientData']) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSubmitted: (submitted: boolean) => void
  reset: () => void

  // Computed values
  canGoNext: () => boolean
  canGoPrev: () => boolean
  getProgress: () => number
}

const initialState = {
  currentStep: 0,
  totalSteps: 4, // Serviciu → Data/Ora/Stilist → Date personale → Confirmare
  service: null,
  stylist: null,
  slot: null,
  clientData: null,
  isLoading: false,
  error: null,
  isSubmitted: false,
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentStep: (step: number) => {
        set({ currentStep: Math.max(0, Math.min(step, get().totalSteps - 1)) })
      },

      nextStep: () => {
        const { currentStep, totalSteps, canGoNext } = get()
        if (canGoNext()) {
          set({ currentStep: Math.min(currentStep + 1, totalSteps - 1) })
        }
      },

      prevStep: () => {
        const { currentStep, canGoPrev } = get()
        if (canGoPrev()) {
          set({ currentStep: Math.max(currentStep - 1, 0) })
        }
      },

      setService: (service: Service | null) => {
        set({ service, error: null })
      },

      setStylist: (stylist: Stylist | null) => {
        set({ stylist, error: null })
      },

      setSlot: (slot: Slot | null) => {
        set({ slot, error: null })
      },

      setClientData: (clientData: BookingState['clientData']) => {
        set({ clientData, error: null })
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      setSubmitted: (isSubmitted: boolean) => {
        set({ isSubmitted })
      },

      reset: () => {
        set(initialState)
      },

      canGoNext: () => {
        const { currentStep, service, stylist, slot, clientData } = get()

        switch (currentStep) {
          case 0: // Serviciu
            return service !== null
          case 1: // Data/Ora/Stilist - toate trebuie selectate
            return service !== null && stylist !== null && slot !== null
          case 2: // Date personale
            return (
              clientData !== null &&
              clientData.clientName.trim() !== '' &&
              clientData.clientPhone.trim() !== '' &&
              clientData.clientEmail.trim() !== ''
            )
          case 3: // Confirmare - toate datele trebuie să fie complete
            return (
              service !== null &&
              stylist !== null &&
              slot !== null &&
              clientData !== null &&
              clientData.clientName.trim() !== '' &&
              clientData.clientPhone.trim() !== '' &&
              clientData.clientEmail.trim() !== ''
            )
          default:
            return false
        }
      },

      canGoPrev: () => {
        const { currentStep } = get()
        return currentStep > 0
      },

      getProgress: () => {
        const { currentStep, totalSteps } = get()
        return ((currentStep + 1) / totalSteps) * 100
      },
    }),
    {
      name: 'booking-store',
      partialize: (state) => ({
        service: state.service,
        stylist: state.stylist,
        slot: state.slot,
        clientData: state.clientData,
      }),
    },
  ),
)

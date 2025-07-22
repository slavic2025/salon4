// src/components/features/appointments/BookingServiceStep.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { BookingCard } from '@/components/ui/booking-card'
import type { Service } from '@/core/domains/services/service.types'
import { getActiveServicesPublicAction } from '@/features/appointments/actions'
import { getServiceIcon } from '@/lib/service-icons'
import { type ServiceSelection, serviceSelectionSchema } from '@/schemas/booking-schemas'
import { useBookingStore } from '@/stores/booking-store'

interface BookingServiceStepProps {
  onNext: () => void
}

// Loading skeleton îmbunătățit
const ServiceLoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="h-8 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="space-y-2 w-full">
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
            <div className="flex justify-between items-center w-full pt-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Error state îmbunătățit
const ServiceErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="text-center py-16">
    <div className="max-w-md mx-auto">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">Oops! Ceva nu a mers bine</h3>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium"
      >
        Încearcă din nou
      </button>
    </div>
  </div>
)

// Empty state îmbunătățit
const ServiceEmptyState = () => (
  <div className="text-center py-16">
    <div className="max-w-md mx-auto">
      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">Nu sunt servicii disponibile momentan</h3>
      <p className="text-gray-600">Vă rugăm să reveniți mai târziu pentru a vedea serviciile noastre.</p>
    </div>
  </div>
)

export default function BookingServiceStep({ onNext }: BookingServiceStepProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { service, setService } = useBookingStore()

  const form = useForm<ServiceSelection>({
    resolver: zodResolver(serviceSelectionSchema),
    defaultValues: {
      serviceId: service?.id || '',
    },
  })

  const loadServices = async () => {
    setLoading(true)
    setError(null)
    try {
      const servicesData = await getActiveServicesPublicAction()
      setServices(servicesData)
    } catch (err) {
      setError('Eroare la încărcarea serviciilor. Vă rugăm să încercați din nou.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadServices()
  }, [])

  const handleServiceSelect = (selectedService: Service) => {
    setService(selectedService)
    form.setValue('serviceId', selectedService.id)
    onNext()
  }

  if (loading) {
    return <ServiceLoadingSkeleton />
  }

  if (error) {
    return <ServiceErrorState error={error} onRetry={loadServices} />
  }

  if (!services.length) {
    return <ServiceEmptyState />
  }

  return (
    <div className="space-y-8">
      {/* Header Section îmbunătățit */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Alegeți serviciul dorit</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Selectați serviciul pe care doriți să îl rezervați din gama noastră completă de servicii profesionale. Fiecare
          serviciu este oferit de stilistii noștri experimentați.
        </p>
      </div>

      {/* Services Grid îmbunătățit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {services.map((serviceItem: Service) => (
          <BookingCard
            key={serviceItem.id}
            id={serviceItem.id}
            title={serviceItem.name}
            description={serviceItem.description || undefined}
            price={`${serviceItem.price} lei`}
            duration={`${serviceItem.duration} min`}
            icon={getServiceIcon(serviceItem.name)}
            variant="service"
            isSelected={service?.id === serviceItem.id}
            onClick={() => handleServiceSelect(serviceItem)}
          />
        ))}
      </div>

      {/* Selected Service Info îmbunătățit */}
      {service && (
        <motion.div
          className="mt-10 p-6 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/20 rounded-full text-primary">{getServiceIcon(service.name)}</div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Serviciu selectat:</p>
              <p className="font-bold text-lg text-primary">{service.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Preț & Durată:</p>
              <p className="font-bold text-lg text-gray-900">
                {service.price} lei • {service.duration} min
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Informații suplimentare */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Informații importante</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Toate serviciile includ consultația inițială</li>
              <li>• Prețurile sunt finale, fără costuri suplimentare</li>
              <li>• Durata include timpul pentru pregătire și finalizare</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

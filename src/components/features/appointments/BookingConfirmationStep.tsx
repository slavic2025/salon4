// src/components/features/appointments/BookingConfirmationStep.tsx
'use client'

import { format } from 'date-fns'
import { ro } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { Calendar, Clock, CreditCard, Info, MapPin, Scissors, Shield, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getServiceIcon } from '@/lib/service-icons'
import { useBookingStore } from '@/stores/booking-store'

interface BookingConfirmationStepProps {
  onConfirm: () => void
  onEdit: () => void
}

// Component InfoItem compact și modern
const InfoItem = ({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: any
  title: string
  children: React.ReactNode
  className?: string
}) => (
  <div className={`flex items-start space-x-2 ${className}`}>
    <div className="p-1.5 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg text-purple-700 flex-shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-sm text-gray-900">{title}</p>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  </div>
)

export default function BookingConfirmationStep({ onConfirm, onEdit }: BookingConfirmationStepProps) {
  const { service, stylist, slot, clientData, isLoading } = useBookingStore()

  // Verificăm dacă avem toate datele necesare
  if (!service || !stylist || !slot || !clientData) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Date incomplete</h3>
          <p className="text-gray-600 text-sm">Vă rugăm să completați toate informațiile înainte de confirmare.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section îmbunătățit și compact */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Confirmă programarea</h2>
        <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Verifică toate detaliile înainte de a finaliza programarea. Totul pare în regulă!
        </p>
      </div>

      <div className="space-y-6">
        {/* Serviciu Card îmbunătățit și compact */}
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-lg text-purple-700">
                <Scissors className="w-4 h-4" />
              </div>
              <span>Serviciul ales</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-lg text-purple-700">
                {getServiceIcon(service.name)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{service.name}</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-purple-600">
                    <Clock className="w-3 h-3" />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-1 text-purple-600">
                    <CreditCard className="w-3 h-3" />
                    <span>Plată la salon</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{service.price} lei</div>
                <p className="text-xs text-gray-500">Preț final</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data și Ora Card îmbunătățit și compact */}
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg text-blue-600">
                <Calendar className="w-4 h-4" />
              </div>
              <span>Data și ora programării</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <label className="text-xs text-gray-600 mb-1 block">Data</label>
                <div className="text-lg font-semibold text-gray-900">
                  {format(new Date(slot.start), 'EEEE, d MMMM yyyy', { locale: ro })}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <label className="text-xs text-gray-600 mb-1 block">Ora</label>
                <div className="text-lg font-semibold text-gray-900">
                  {format(new Date(slot.start), 'HH:mm', { locale: ro })} -{' '}
                  {format(new Date(slot.end), 'HH:mm', { locale: ro })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stilist Card îmbunătățit și compact */}
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg text-green-600">
                <User className="w-4 h-4" />
              </div>
              <span>Stilistul tău</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{stylist.fullName}</h3>
                  <p className="text-sm text-gray-600">{stylist.email}</p>
                  {stylist.description && <p className="text-sm text-gray-600 mt-1">{stylist.description}</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datele clientului Card îmbunătățit și compact */}
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-lg text-purple-700">
                <User className="w-4 h-4" />
              </div>
              <span>Datele tale</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <InfoItem icon={User} title="Nume complet">
                  {clientData.clientName}
                </InfoItem>
                <InfoItem icon={Clock} title="Telefon">
                  {clientData.clientPhone}
                </InfoItem>
              </div>
              <div className="space-y-3">
                <InfoItem icon={Shield} title="Email">
                  {clientData.clientEmail}
                </InfoItem>
                {clientData.clientNotes && (
                  <InfoItem icon={Info} title="Note speciale">
                    <div className="p-2 bg-white rounded-lg border border-purple-200 text-sm">
                      {clientData.clientNotes}
                    </div>
                  </InfoItem>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informații importante Card îmbunătățit și compact */}
        <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-lg text-yellow-600">
                <Info className="w-4 h-4" />
              </div>
              <span>Informații importante</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoItem icon={MapPin} title="Locația salonului">
                <p className="text-blue-700 text-sm">Strada Exemplu, Nr. 123, București</p>
              </InfoItem>
              <InfoItem icon={Clock} title="Program de funcționare">
                <p className="text-blue-700 text-sm">Luni - Sâmbătă: 9:00 - 20:00</p>
              </InfoItem>
              <InfoItem icon={CreditCard} title="Modalitate de plată">
                <p className="text-blue-700 text-sm">Numerar sau card la salon</p>
              </InfoItem>
              <InfoItem icon={Shield} title="Politica de anulare">
                <p className="text-blue-700 text-sm">Anulare gratuită cu 24h înainte</p>
              </InfoItem>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Butoane de acțiune îmbunătățite și compacte */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Button
          variant="outline"
          onClick={onEdit}
          className="flex-1 h-12 text-base font-semibold border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
        >
          Editează detaliile
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Se trimite...</span>
            </div>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Finalizează programarea
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}

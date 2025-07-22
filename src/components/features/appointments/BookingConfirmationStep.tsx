// src/components/features/appointments/BookingConfirmationStep.tsx
'use client'

import { format } from 'date-fns'
import { ro } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, Mail, MapPin, Phone, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getServiceIcon } from '@/lib/service-icons'
import { useBookingStore } from '@/stores/booking-store'

interface BookingConfirmationStepProps {
  onConfirm: () => void
  onEdit: () => void
}

// Component pentru informații cu icon
const InfoItem = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full text-primary">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1">
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      {children}
    </div>
  </div>
)

export default function BookingConfirmationStep({ onConfirm, onEdit }: BookingConfirmationStepProps) {
  const { service, stylist, slot, clientData, isLoading } = useBookingStore()

  if (!service || !stylist || !slot || !clientData) {
    return (
      <div className="text-center py-16">
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
        <h3 className="text-xl font-bold text-gray-900 mb-3">Eroare: Date incomplete</h3>
        <p className="text-gray-600">Nu s-au putut încărca toate detaliile pentru confirmare.</p>
      </div>
    )
  }

  const appointmentDate = new Date(slot.start)
  const appointmentEndDate = new Date(slot.end)

  return (
    <div className="space-y-8">
      {/* Header îmbunătățit */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Confirmă programarea</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Verifică toate detaliile înainte de a confirma programarea. Vei primi o confirmare pe email în cel mai scurt
          timp.
        </p>
      </div>

      {/* Detalii programare îmbunătățite */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Serviciu */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 bg-primary/10 rounded-full text-primary">{getServiceIcon(service.name)}</div>
                <span>Serviciu selectat</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  {service.description && <p className="text-gray-600 mb-3 leading-relaxed">{service.description}</p>}
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} minute</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary mb-1">{service.price} lei</p>
                  <p className="text-sm text-gray-500">Plata la salon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data și ora */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border border-gray-200 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  <Clock className="w-5 h-5" />
                </div>
                <span>Data și ora programării</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-600 font-medium mb-2">Data</p>
                  <p className="text-xl font-bold text-gray-900">
                    {format(appointmentDate, 'EEEE, d MMMM yyyy', { locale: ro })}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-600 font-medium mb-2">Ora</p>
                  <p className="text-xl font-bold text-gray-900">
                    {format(appointmentDate, 'HH:mm', { locale: ro })} -{' '}
                    {format(appointmentEndDate, 'HH:mm', { locale: ro })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stilist */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border border-gray-200 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                  <User className="w-5 h-5" />
                </div>
                <span>Stilistul tău</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{stylist.fullName}</h3>
                <p className="text-gray-600 mb-3">{stylist.email}</p>
                {stylist.description && <p className="text-gray-700 leading-relaxed">{stylist.description}</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Datele tale */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border border-gray-200 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                  <User className="w-5 h-5" />
                </div>
                <span>Datele tale</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nume complet</p>
                    <p className="text-lg font-semibold text-gray-900">{clientData.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Telefon</p>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-lg font-semibold text-gray-900">{clientData.clientPhone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-lg font-semibold text-gray-900">{clientData.clientEmail}</p>
                    </div>
                  </div>
                  {clientData.clientNotes && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Note speciale</p>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">{clientData.clientNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Informații importante */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl text-blue-900">
                <div className="p-2 bg-blue-200 rounded-full text-blue-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>Informații importante</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={CheckCircle} title="Programare">
                  <p className="text-blue-700">Te rugăm să ajungi cu 5-10 minute înainte de programare</p>
                </InfoItem>
                <InfoItem icon={Mail} title="Confirmare">
                  <p className="text-blue-700">Vei primi o confirmare pe email în cel mai scurt timp</p>
                </InfoItem>
                <InfoItem icon={Phone} title="Modificări">
                  <p className="text-blue-700">Pentru modificări sau anulări, te rugăm să ne contactezi telefonic</p>
                </InfoItem>
                <InfoItem icon={CheckCircle} title="Plata">
                  <p className="text-blue-700">Plata se efectuează la salon după finalizarea serviciului</p>
                </InfoItem>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Butoane de acțiune îmbunătățite */}
        <motion.div
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="outline"
            onClick={onEdit}
            disabled={isLoading}
            className="flex-1 h-14 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50"
          >
            Modifică detaliile
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Se confirmă...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6" />
                <span>Confirmă programarea</span>
              </div>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

// src/components/features/appointments/BookingConfirmationStep.tsx
'use client'

import { format } from 'date-fns'
import { ro } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { Calendar, Clock, CreditCard, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getServiceIcon } from '@/lib/service-icons'
import { useBookingStore } from '@/stores/booking-store'

interface BookingConfirmationStepProps {
  onConfirm: () => void
  onEdit: () => void
}

export default function BookingConfirmationStep({ onConfirm, onEdit }: BookingConfirmationStepProps) {
  const { service, stylist, slot, clientData, isLoading } = useBookingStore()

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
          <h3 className="text-lg font-bold text-slate-900 mb-2">Date incomplete</h3>
          <p className="text-slate-600 text-sm">Vă rugăm să completați toate informațiile înainte de confirmare.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header simplu */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Confirmă programarea</h2>
        <p className="text-slate-600">Verifică detaliile înainte de finalizare</p>
      </div>

      {/* Card principal cu toate informațiile */}
      <Card className="border-slate-200 bg-white">
        <CardContent className="p-6 space-y-6">
          {/* Serviciu */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-slate-50 border border-slate-200 w-12 h-12 flex items-center justify-center">
                <div className="text-slate-700">{getServiceIcon(service.name)}</div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{service.name}</h3>
                <p className="text-sm text-slate-600">{service.duration} min</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{service.price} lei</div>
            </div>
          </div>

          {/* Programare */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <Calendar className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm text-slate-600">Data</p>
                <p className="font-medium text-slate-900">
                  {format(new Date(slot.start), 'd MMM yyyy', { locale: ro })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <Clock className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm text-slate-600">Ora</p>
                <p className="font-medium text-slate-900">{format(new Date(slot.start), 'HH:mm', { locale: ro })}</p>
              </div>
            </div>
          </div>

          {/* Stilist */}
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <User className="w-5 h-5 text-slate-600" />
            <div>
              <p className="text-sm text-slate-600">Stilist</p>
              <p className="font-medium text-slate-900">{stylist.fullName}</p>
            </div>
          </div>

          {/* Client */}
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <User className="w-5 h-5 text-slate-600" />
            <div>
              <p className="text-sm text-slate-600">Client</p>
              <p className="font-medium text-slate-900">{clientData.clientName}</p>
              <p className="text-sm text-slate-600">{clientData.clientPhone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informații importante - compacte */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h4 className="font-medium text-slate-900 mb-3">Informații importante</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-slate-600" />
            <span className="text-slate-700">Plată la salon</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-600" />
            <span className="text-slate-700">Anulare gratuită cu 24h înainte</span>
          </div>
        </div>
      </div>

      {/* Butoane de acțiune */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Button
          variant="outline"
          onClick={onEdit}
          className="flex-1 h-12 font-medium border-slate-200 hover:bg-slate-50"
        >
          Editează
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium"
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

'use client'

import { Calendar, Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function InteractiveButtons() {
  const handleBookingClick = () => {
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up animation-delay-400">
      <Button
        size="lg"
        className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
        onClick={handleBookingClick}
      >
        <Calendar className="mr-2 h-5 w-5" />
        Programează-te Acum
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
      >
        <Phone className="mr-2 h-5 w-5" />
        Sună-ne
      </Button>
    </div>
  )
}

export function ServiceBookingButton() {
  const handleBookingClick = () => {
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Button
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 hover:scale-105"
      onClick={handleBookingClick}
    >
      Programează-te
    </Button>
  )
}

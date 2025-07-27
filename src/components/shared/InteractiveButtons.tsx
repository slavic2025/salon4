'use client'

import { Calendar, Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function InteractiveButtons() {
  const handleBookingClick = () => {
    const bookingSection = document.getElementById('booking-section')
    if (bookingSection) {
      setTimeout(() => {
        bookingSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up animation-delay-400">
      <Button
        size="lg"
        className="bg-white text-purple-700 hover:bg-purple-50 px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
        onClick={handleBookingClick}
      >
        <Calendar className="mr-2 h-5 w-5" />
        Programează-te Acum
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="border-white text-white hover:bg-white hover:text-purple-700 px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
      >
        <Phone className="mr-2 h-5 w-5" />
        Sună-ne
      </Button>
    </div>
  )
}

export function ServiceBookingButton() {
  const handleBookingClick = () => {
    const bookingSection = document.getElementById('booking-section')
    if (bookingSection) {
      setTimeout(() => {
        bookingSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
    }
  }

  return (
    <Button
      className="w-full bg-slate-700 hover:bg-slate-800 text-white transition-all duration-300 hover:scale-105"
      onClick={handleBookingClick}
    >
      Programează-te
    </Button>
  )
}

export function StylistAvailabilityButton() {
  const handleBookingClick = () => {
    const bookingSection = document.getElementById('booking-section')
    if (bookingSection) {
      setTimeout(() => {
        bookingSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
    }
  }

  return (
    <Button className="w-full bg-slate-700 hover:bg-slate-800 text-white" onClick={handleBookingClick}>
      <Calendar className="h-4 w-4 mr-2" />
      Vezi Disponibilitatea
    </Button>
  )
}

export function HeroBookingButton() {
  const handleBookingClick = () => {
    const bookingSection = document.getElementById('booking-section')
    if (bookingSection) {
      // Add a small delay to ensure smooth scroll works properly
      setTimeout(() => {
        bookingSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
    }
  }

  return (
    <Button
      size="lg"
      className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 text-lg font-semibold"
      onClick={handleBookingClick}
    >
      Programează-te Acum
    </Button>
  )
}

export function HeroServicesButton() {
  const handleServicesClick = () => {
    const servicesSection = document.getElementById('services-section')
    if (servicesSection) {
      // Add a small delay to ensure smooth scroll works properly
      setTimeout(() => {
        servicesSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
    }
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold"
      onClick={handleServicesClick}
    >
      Vezi Serviciile
    </Button>
  )
}

export function LocationBookingButton() {
  const handleBookingClick = () => {
    const bookingSection = document.getElementById('booking-section')
    if (bookingSection) {
      setTimeout(() => {
        bookingSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
    }
  }

  return (
    <Button className="w-full bg-slate-700 hover:bg-slate-800 text-white" onClick={handleBookingClick}>
      Programează-te Acum
    </Button>
  )
}

export function FooterBookingButton() {
  const handleBookingClick = () => {
    const bookingSection = document.getElementById('booking-section')
    if (bookingSection) {
      setTimeout(() => {
        bookingSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
    }
  }

  return (
    <button
      className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
      onClick={handleBookingClick}
    >
      Programează-te Acum
    </button>
  )
}

export function FooterServicesButton() {
  const handleServicesClick = () => {
    const servicesSection = document.getElementById('services-section')
    if (servicesSection) {
      setTimeout(() => {
        servicesSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
    }
  }

  return (
    <button
      className="border border-slate-600 text-slate-300 hover:bg-slate-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
      onClick={handleServicesClick}
    >
      Vezi Serviciile
    </button>
  )
}

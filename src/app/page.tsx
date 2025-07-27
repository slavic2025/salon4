import BookingFormStepper from '@/components/features/appointments/BookingFormStepper'
import {
  BenefitsSection,
  Footer,
  HeroSection,
  HowItWorksSection,
  LocationSection,
  ServicesSection,
  StylistsSection,
  TestimonialsSection,
} from '@/components/features/home'

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Beneficii Section */}
      <BenefitsSection />

      {/* Stiliști Section */}
      <StylistsSection />

      {/* Servicii Section */}
      <ServicesSection />

      {/* Cum Funcționează Section */}
      <HowItWorksSection />

      {/* Testimoniale Section */}
      <TestimonialsSection />

      {/* Locație Section */}
      <LocationSection />

      {/* Formular de Programare Section */}
      <section id="booking-section" className="py-20 bg-gradient-to-br from-stone-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-sm font-medium mb-6">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Programare Rapidă
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Programează-te Online</h2>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Rezervă-ți locul în câteva clicuri. Procesul durează mai puțin de 2 minute și nu necesită apeluri
              telefonice!
            </p>
          </div>

          {/* Booking Form Container */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <BookingFormStepper />
            </div>
          </div>

          {/* Bottom Benefits */}
          <div className="text-center mt-12">
            <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Confirmare instantanee</span>
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Fără apeluri telefonice</span>
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>24/7 disponibil</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

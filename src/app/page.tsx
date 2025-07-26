import { Award, Clock, MapPin, Star, Users } from 'lucide-react'

import BookingFormStepper from '@/components/features/appointments/BookingFormStepper'
import { InteractiveButtons, ServiceBookingButton } from '@/components/shared/InteractiveButtons'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getActiveServicesPublicAction } from '@/features/appointments/actions'
import { getServiceIcon } from '@/lib/service-icons'

// Date mock pentru beneficiile salonului
const benefits = [
  {
    icon: Star,
    title: 'Calitate Premium',
    description: 'Folosim doar produse de top și tehnici moderne',
  },
  {
    icon: Users,
    title: 'Experiență',
    description: 'Echipa noastră are peste 10 ani de experiență',
  },
  {
    icon: Clock,
    title: 'Program Flexibil',
    description: 'Programări online 24/7, programare rapidă',
  },
  {
    icon: Award,
    title: 'Certificări',
    description: 'Toți stilistii noștri sunt certificați profesional',
  },
]

const testimonials = [
  {
    name: 'Maria Popescu',
    text: 'Cel mai bun salon din oraș! Serviciul este excelent și rezultatul depășește așteptările.',
    rating: 5,
  },
  {
    name: 'Ana Ionescu',
    text: 'Am fost mulțumită de fiecare dată. Recomand cu încredere!',
    rating: 5,
  },
  {
    name: 'Elena Dumitrescu',
    text: 'Profesionalism și calitate la cel mai înalt nivel. Mulțumesc!',
    rating: 5,
  },
]

export default async function Home() {
  // Preluăm serviciile active din baza de date
  const services = await getActiveServicesPublicAction()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-slide-up">
              Frumusețea Ta Este
              <span className="block text-yellow-300">Prioritatea Noastră</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto animate-slide-up animation-delay-200">
              Descoperă serviciile noastre premium de înfrumusețare și lasă-ne să-ți oferim experiența pe care o meriți
            </p>

            <InteractiveButtons />
          </div>
        </div>
      </section>

      {/* Servicii Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-up">Serviciile Noastre</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up animation-delay-200">
              Oferim o gamă completă de servicii de înfrumusețare pentru a-ți oferi aspectul pe care îl dorești
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={service.id} className="group animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white group-hover:scale-110 transition-transform duration-300">
                      {getServiceIcon(service.name)}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CardTitle className="text-xl font-bold text-gray-900">{service.name}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {service.category}
                    </Badge>
                  </CardHeader>

                  <CardContent className="text-center pt-0">
                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-purple-600">{service.price} RON</div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration} min
                      </div>
                    </div>

                    <ServiceBookingButton />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficii Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-up">De Ce Să Ne Alegeți</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up animation-delay-200">
              Ne dedicăm să-ți oferim cea mai bună experiență de înfrumusețare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mx-auto mb-6 p-4 rounded-full bg-white shadow-lg group-hover:shadow-xl transition-shadow duration-300 w-16 h-16 flex items-center justify-center group-hover:scale-110">
                  <benefit.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimoniale Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-up">
              Ce Spun Clienții Noștri
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 animate-fade-in hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formular de Programare Section */}
      <section id="booking-section" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 animate-slide-up">
              Programează-te Online
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed px-4 animate-slide-up animation-delay-200">
              Rezervă-ți locul în câteva clicuri. Nu mai trebuie să suni la telefon!
            </p>
          </div>

          <div className="max-w-6xl mx-auto animate-fade-in animation-delay-400">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
              <BookingFormStepper />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Salonul Nostru</h3>
              <p className="text-gray-300 mb-4">
                Oferim servicii de înfrumusețare de cea mai înaltă calitate, într-un mediu relaxant și profesional.
              </p>
              <div className="flex items-center text-gray-300 mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Strada Exemplu, Nr. 123, București</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="h-4 w-4 mr-2">📞</span>
                <span>+40 123 456 789</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Program</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Luni - Vineri:</span>
                  <span>09:00 - 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sâmbătă:</span>
                  <span>09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Duminică:</span>
                  <span>10:00 - 16:00</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Servicii</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Tuns & Coafat</li>
                <li>• Vopsit & Balayage</li>
                <li>• Manichiură & Pedichiură</li>
                <li>• Tratamente Faciale</li>
                <li>• Extensii Gene</li>
                <li>• Make-up Profesional</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Salonul Nostru. Toate drepturile rezervate.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

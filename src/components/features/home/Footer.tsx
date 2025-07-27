import { Clock, Mail, MapPin, Phone } from 'lucide-react'

import { FooterBookingButton, FooterServicesButton } from '@/components/shared/InteractiveButtons'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-slate-800 to-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informații salon */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Salonul Nostru</h3>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Oferim servicii de înfrumusețare de cea mai înaltă calitate, într-un mediu relaxant și profesional. Ne
              dedicăm să-ți oferim experiența pe care o meriți.
            </p>

            <div className="space-y-4">
              <div className="flex items-center text-slate-300">
                <MapPin className="h-4 w-4 mr-3 text-amber-400 flex-shrink-0" />
                <span>Strada Exemplu, Nr. 123, Chișinău</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Phone className="h-4 w-4 mr-3 text-amber-400 flex-shrink-0" />
                <span>+373 69 123 456</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Mail className="h-4 w-4 mr-3 text-amber-400 flex-shrink-0" />
                <span>contact@salonulnostru.md</span>
              </div>
            </div>
          </div>

          {/* Program și programare */}
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-amber-400" />
                Program
              </h4>
              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between">
                  <span>Luni - Vineri:</span>
                  <span className="font-medium">09:00 - 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sâmbătă:</span>
                  <span className="font-medium">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Duminică:</span>
                  <span className="font-medium">10:00 - 16:00</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Programare Online</h4>
              <p className="text-slate-300 mb-4">
                Programează-te online 24/7 pentru serviciile noastre. Procesul durează mai puțin de 2 minute!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <FooterBookingButton />
                <FooterServicesButton />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-700 text-center">
          <p className="text-slate-400">&copy; {currentYear} Salonul Nostru. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  )
}

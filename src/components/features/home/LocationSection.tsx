import { Clock, MapPin, Phone } from 'lucide-react'

import { LocationBookingButton } from '@/components/shared/InteractiveButtons'

const schedule = [
  { day: 'Luni - Vineri', hours: '09:00 - 20:00' },
  { day: 'Sâmbătă', hours: '09:00 - 18:00' },
  { day: 'Duminică', hours: '10:00 - 16:00' },
]

export default function LocationSection() {
  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Locația Noastră</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Găsește-ne într-o locație centrală și accesibilă</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informații de contact */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl border border-stone-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Informații de Contact</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-amber-50 border border-amber-200">
                    <MapPin className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Adresa</h4>
                    <p className="text-slate-600">
                      Strada Exemplu, Nr. 123,
                      <br />
                      or. Chișinău
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-amber-50 border border-amber-200">
                    <Phone className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Telefon</h4>
                    <p className="text-slate-600">+373 69 123 456</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-amber-50 border border-amber-200">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Program</h4>
                    <div className="space-y-2 text-slate-600">
                      {schedule.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.day}:</span>
                          <span className="font-medium">{item.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-200">
                <LocationBookingButton />
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div className="bg-white p-8 rounded-xl border border-stone-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Harta Noastră</h3>

            <div className="aspect-video bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <p className="text-lg font-medium">Google Maps Embed</p>
                <p className="text-sm">Harta va fi integrată aici</p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-slate-500">Locație centrală cu parcare gratuită</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

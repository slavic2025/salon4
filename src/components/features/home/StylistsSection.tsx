import { Star } from 'lucide-react'

import { StylistAvailabilityButton } from '@/components/shared/InteractiveButtons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getActiveStylistsPublicAction } from '@/features/appointments/actions'

export default async function StylistsSection() {
  // Preluăm stiliștii activi din baza de date
  const stylists = await getActiveStylistsPublicAction()

  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Echipa Noastră de Profesioniști</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Cunoaște stilistii noștri dedicați care îți vor oferi serviciile de cea mai înaltă calitate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stylists.map((stylist) => (
            <Card key={stylist.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-2xl">
                  👩‍🎨
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">{stylist.fullName}</CardTitle>
              </CardHeader>

              <CardContent className="text-center pt-0">
                <p className="text-slate-600 mb-4 leading-relaxed">{stylist.description}</p>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="h-4 w-4 text-amber-500 fill-current" />
                  <span className="text-sm font-medium text-slate-700">5.0 (Experiență)</span>
                </div>

                <StylistAvailabilityButton />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

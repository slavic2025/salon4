import { Clock } from 'lucide-react'

import { ServiceBookingButton } from '@/components/shared/InteractiveButtons'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getActiveServicesPublicAction } from '@/features/appointments/actions'
import { getServiceIcon } from '@/lib/service-icons'

export default async function ServicesSection() {
  const services = await getActiveServicesPublicAction()

  return (
    <section id="services-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Serviciile Noastre</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Oferim o gamă completă de servicii de înfrumusețare pentru a-ți oferi aspectul pe care îl dorești
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card
              key={service.id}
              className="group hover:shadow-lg transition-all duration-300 bg-white border border-slate-200"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 rounded-full bg-amber-50 border border-amber-200 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {getServiceIcon(service.name)}
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">{service.name}</CardTitle>
                <Badge variant="secondary" className="text-sm">
                  {service.category}
                </Badge>
              </CardHeader>

              <CardContent className="text-center pt-0">
                <p className="text-slate-600 mb-6 leading-relaxed min-h-[3rem]">{service.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-slate-900">{service.price} lei</div>
                  <div className="flex items-center text-slate-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.duration} min
                  </div>
                </div>

                <ServiceBookingButton />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

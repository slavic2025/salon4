import { ArrowRight, Calendar, CheckCircle, Clock, CreditCard } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

const steps = [
  {
    icon: Calendar,
    title: 'Alege Serviciul',
    description: 'Selectează serviciul dorit din lista noastră completă de tratamente și văd disponibilitatea',
    step: '01',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
  },
  {
    icon: Clock,
    title: 'Programează Ora',
    description: 'Alege data și ora care ți se par cele mai potrivite pentru programare',
    step: '02',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-600',
  },
  {
    icon: CreditCard,
    title: 'Confirmă Rezervarea',
    description: 'Completează datele tale și confirmă rezervarea în câteva clicuri',
    step: '03',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-600',
  },
  {
    icon: CheckCircle,
    title: 'Primește Confirmarea',
    description: 'Vei primi o confirmare pe email și SMS cu toate detaliile programării',
    step: '04',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-stone-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-sm font-medium mb-6">
            <Clock className="h-4 w-4 mr-2" />
            Proces Simplu
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Cum Funcționează</h2>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Programarea online este simplă și rapidă. Urmărește acești pași pentru a-ți rezerva locul în mai puțin de 2
            minute
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-slate-200 to-slate-300 z-0 transform -translate-y-1/2">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              )}

              <Card className="h-full bg-white border-stone-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 group-hover:scale-105 relative z-10">
                <CardContent className="p-6 text-center">
                  {/* Step Number */}
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div
                    className={`mx-auto mb-6 p-4 rounded-2xl ${step.bgColor} ${step.borderColor} border-2 w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className={`h-10 w-10 ${step.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors duration-300">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed text-sm lg:text-base">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-6 w-6 text-amber-600" />
                <span className="text-2xl font-bold text-slate-900">2 minute</span>
              </div>
            </div>

            <p className="text-lg text-slate-700 mb-6 max-w-2xl mx-auto">
              Programarea durează mai puțin de 2 minute și nu necesită apeluri telefonice!
            </p>

            <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Confirmare prin email</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Fără apeluri telefonice</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>24/7 disponibil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

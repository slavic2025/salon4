import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Maria Popescu',
    text: 'Cel mai bun salon din oraș! Serviciul este excelent și rezultatul depășește așteptările. Recomand cu încredere tuturor prietenelor mele.',
    rating: 5,
    service: 'Coafat & Vopsit',
  },
  {
    name: 'Ana Ionescu',
    text: 'Am fost mulțumită de fiecare dată. Stilistii sunt foarte atenți la detalii și folosesc doar produse de calitate. Programarea online este foarte practică!',
    rating: 5,
    service: 'Manichiură & Pedichiură',
  },
  {
    name: 'Elena Dumitrescu',
    text: 'Profesionalism și calitate la cel mai înalt nivel. Am găsit salonul perfect pentru toate nevoile mele de înfrumusețare. Mulțumesc echipei!',
    rating: 5,
    service: 'Make-up & Tratamente Faciale',
  },
  {
    name: 'Cristina Vasilescu',
    text: 'Salonul meu preferat! Atmosfera este relaxantă, serviciile sunt de cea mai înaltă calitate, iar programarea online îmi salvează timpul prețios.',
    rating: 5,
    service: 'Coafat & Vopsit',
  },
  {
    name: 'Diana Marin',
    text: 'Recomand cu încredere! Am fost clientă de peste 2 ani și nu am fost niciodată dezamăgită. Echipa este profesională și dedicată.',
    rating: 5,
    service: 'Manichiură & Pedichiură',
  },
  {
    name: 'Laura Stan',
    text: 'Cel mai bun salon din București! Serviciile sunt excelente, prețurile sunt corecte, iar programarea online este foarte convenabilă.',
    rating: 5,
    service: 'Make-up & Tratamente Faciale',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Ce Spun Clienții Noștri</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Descoperă experiențele autentice ale clienților noștri mulțumiți
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-stone-50 p-6 rounded-xl border border-stone-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                ))}
              </div>

              <p className="text-slate-700 mb-4 italic text-lg leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>

              <div className="border-t border-stone-200 pt-4">
                <p className="font-semibold text-slate-900">{testimonial.name}</p>
                <p className="text-sm text-slate-500">{testimonial.service}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-6 py-3">
            <Star className="h-5 w-5 text-amber-600 fill-current" />
            <span className="text-slate-700 font-medium">Peste 500+ clienți mulțumiți</span>
          </div>
        </div>
      </div>
    </section>
  )
}

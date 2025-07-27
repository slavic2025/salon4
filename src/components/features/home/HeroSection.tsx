'use client'

import Image from 'next/image'

import { HeroBookingButton, HeroServicesButton } from '@/components/shared/InteractiveButtons'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="absolute inset-0 bg-black/5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Layout Split cu Imagine AI */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Text Content - 40% */}
          <div className="lg:col-span-2 text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900">
                Frumusețea Ta
                <span className="block text-amber-600 mt-2">Merită Cele Mai Bune</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                Descoperă serviciile noastre de înfrumusețare și lasă-ne să-ți oferim îngrijirea și atenția pe care o
                meriți
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <HeroBookingButton />
              <HeroServicesButton />
            </div>
          </div>

          {/* Imagine AI - 60% */}
          <div className="lg:col-span-3 relative">
            <div className="relative">
              <Image
                src="/salon-hero.jpg"
                alt="Salon de înfrumusețare modern"
                width={800}
                height={600}
                className="rounded-3xl shadow-2xl w-full h-auto object-cover"
                priority
              />
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

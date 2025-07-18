import Link from 'next/link'

import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              ← Înapoi la pagina principală
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pagină de Test pentru Preloader</h1>

          <p className="text-gray-600 dark:text-gray-300">
            Această pagină demonstrează funcționalitatea preloader-ului global. Navighează între pagini pentru a vedea
            efectul.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Demonstrație LoadingSpinner */}
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Variante LoadingSpinner</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Small</span>
              </div>

              <div className="flex items-center gap-4">
                <LoadingSpinner size="md" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Medium</span>
              </div>

              <div className="flex items-center gap-4">
                <LoadingSpinner size="lg" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Large</span>
              </div>

              <div className="flex items-center gap-4">
                <LoadingSpinner size="xl" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Extra Large</span>
              </div>
            </div>
          </div>

          {/* Variante de culoare */}
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Variante de Culoare</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <LoadingSpinner size="md" variant="default" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Default</span>
              </div>

              <div className="flex items-center gap-4">
                <LoadingSpinner size="md" variant="primary" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Primary</span>
              </div>

              <div className="flex items-center gap-4">
                <LoadingSpinner size="md" variant="secondary" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Secondary</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instrucțiuni */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
            Cum să testezi preloader-ul global:
          </h3>

          <ul className="space-y-2 text-blue-800 dark:text-blue-200">
            <li>• Navighează între această pagină și pagina principală</li>
            <li>• Preloader-ul se va afișa automat în timpul tranziției</li>
            <li>• Folosește butonul &quot;Înapoi&quot; sau navighează manual</li>
            <li>• Preloader-ul are o întârziere minimă pentru a evita flash-ul</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

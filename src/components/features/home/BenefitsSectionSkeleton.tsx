export default function BenefitsSectionSkeleton() {
  return (
    <section className="py-20 bg-white" aria-label="Se încarcă secțiunea de beneficii">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-10 bg-slate-200 rounded-lg w-80 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-slate-200 rounded w-96 mx-auto animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="text-center p-6 rounded-xl bg-white border border-slate-200">
              <div className="mx-auto mb-6 p-4 rounded-full bg-slate-200 w-16 h-16 animate-pulse" />
              <div className="h-6 bg-slate-200 rounded w-32 mx-auto mb-3 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto mt-2 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

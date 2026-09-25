const Bone = ({ className, style }) => (
  <div className={`rounded-lg bg-gray-500/10 ${className}`} style={style} />
);

// Mirrors the layout of FlightMap + poster so nothing jumps when they load
export default function TravelSectionsSkeleton() {
  return (
    <div className="animate-pulse motion-reduce:animate-none" aria-busy="true">
      <span className="sr-only">Loading travel map…</span>
      <section className="w-full mt-16">
        <div className="max-w-[620px] mx-auto px-5">
          <Bone className="h-3 w-28 mb-3" />
          <Bone className="h-8 w-48 mb-4" />
          <Bone className="h-4 w-full mb-2" />
          <Bone className="h-4 w-2/3 mb-8" />
          <Bone className="h-9 w-56 mb-5 rounded-xl" />
          <Bone className="h-[172px] sm:h-[86px] w-full mb-8 rounded-xl" />
          <div className="flex items-end gap-1.5 h-24 mb-1">
            {[40, 65, 30, 80, 55, 100, 70, 45, 85].map((h, i) => (
              <Bone
                key={i}
                className="flex-1 rounded-md"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <Bone className="h-5 w-full mt-4 mb-7" />
        </div>
        <div className="max-w-[960px] mx-auto px-5">
          <div className="rounded-2xl border border-gray-500/15 bg-gray-500/[0.06] aspect-[960/520]" />
        </div>
      </section>
      <section className="w-full max-w-[620px] mx-auto px-5 mt-16">
        <Bone className="h-6 w-24 mb-2" />
        <Bone className="h-4 w-3/4 mb-5" />
        <Bone className="h-8 w-full mb-3" />
        <Bone className="h-8 w-full mb-6" />
        <Bone className="aspect-[1080/1350] w-full rounded-xl" />
      </section>
    </div>
  );
}

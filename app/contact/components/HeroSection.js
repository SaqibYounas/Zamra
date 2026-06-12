export default function HeroSection() {
  return (
    <section className="relative pt-28 pb-14 px-8 md:px-16 lg:px-24 overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,222,128,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0a] via-transparent to-transparent" />

      <div className="relative z-10 max-w-3xl">
        <p className="text-green-400 text-[10px] tracking-[0.3em] font-semibold uppercase mb-5 flex items-center gap-2">
          <span className="w-6 h-px bg-green-400/60 inline-block" />
          Global Communication Protocol
        </p>

        <h1 className="text-5xl md:text-6xl font-black uppercase leading-none tracking-tight mb-5">
          <span className="text-white">CONTACT </span>
          <span className="text-green-400">US</span>
        </h1>

        <p className="text-gray-400 text-sm leading-relaxed max-w-md">
          Our neural infrastructure spans continents. Reach out to coordinate
          high velocity deployments or integrate with our kinetic logistics network.
        </p>
      </div>
    </section>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";

interface Specimen {
  id: string;
  number: string;
  name: string;
  category: string;
  classification: string;
  location: string;
  coords: string;
  elevation: string;
  image: string;
  description: string;
  metrics: { label: string; value: string }[];
  accentColor: string;
  colSpan: string;
  initialRotate: string;
  offsetY?: string;
}

const SPECIMENS: Specimen[] = [
  {
    id: "sylph",
    number: "01",
    name: "The Sylph of the Veil",
    category: "FAUNA // AETHER-WINGED",
    classification: "SANCTUARY SPIRIT",
    location: "Veil Valley — Upper Canopy",
    coords: '14°22\'08" N • 101°54\'30" E',
    elevation: "ELEV. 1,420M",
    image: "/creatures/sylph_veil.jpg",
    description:
      "Translucent entities that condense from high-altitude morning mist. Their resonance is said to harmonize with the geomagnetic pulses of the ancient trees.",
    metrics: [
      { label: "REFRACTIVE INDEX", value: "1.42" },
      { label: "LUMINESCENCE", value: "430 lm" },
      { label: "FREQUENCY", value: "528 Hz" },
    ],
    accentColor: "#10B981", // Emerald
    colSpan: "lg:col-span-7",
    initialRotate: "-rotate-1",
    offsetY: "lg:translate-y-0",
  },
  {
    id: "panthere",
    number: "02",
    name: "Nocturne Panthere",
    category: "PREDATOR // SHADOW BIOME",
    classification: "LIGHT-ABSORBING APEX",
    location: "Obsidian Ravine — Sunken Basins",
    coords: '09°11\'45" S • 142°08\'12" W',
    elevation: "DEPTH -380M",
    image: "/creatures/nocturne_panthere.jpg",
    description:
      "A silent predator whose dense pelt absorbs 99.4% of incident photon light. Its silhouette distorts peripheral vision, leaving only piercing luminous eyes.",
    metrics: [
      { label: "PHOTON ABSORPTION", value: "99.4%" },
      { label: "SPRINT SPEED", value: "88 km/h" },
      { label: "TEMPERAMENT", value: "ELUSIVE" },
    ],
    accentColor: "#06B6D4", // Cyan
    colSpan: "lg:col-span-5",
    initialRotate: "rotate-1",
    offsetY: "lg:translate-y-16",
  },
  {
    id: "lotus",
    number: "03",
    name: "Primordial Chrono-Lotus",
    category: "BOTANICA // ANOMALOUS FLORA",
    classification: "CHRONO-RESPONSIVE",
    location: "Geothermal Spring — Sacred Terraces",
    coords: '02°45\'19" N • 083°12\'04" E',
    elevation: "ELEV. 860M",
    image: "/creatures/chrono_lotus.jpg",
    description:
      "Blooms once every celestial cycle beneath deep geothermal vents. Petals emit coherent amber wavelengths that induce localized temporal stillness in surrounding water.",
    metrics: [
      { label: "BLOOM CYCLE", value: "12 CYCLES" },
      { label: "EMISSION PEAK", value: "580 nm" },
      { label: "ZONE STASIS", value: "+0.14s" },
    ],
    accentColor: "#F59E0B", // Amber
    colSpan: "lg:col-span-5",
    initialRotate: "rotate-1",
    offsetY: "lg:translate-y-6",
  },
  {
    id: "leviathan",
    number: "04",
    name: "Aegis of the Cloud Seas",
    category: "COLOSSUS // HIGH TROPOSPHERE",
    classification: "ATMOSPHERIC GLIDER",
    location: "High Troposphere — The Wind Bridges",
    coords: '27°50\'02" N • 044°33\'18" W',
    elevation: "ALT. 9,200M",
    image: "/creatures/sky_leviathan.jpg",
    description:
      "An ancient aerial colossus navigating continental thermal updrafts. Revered by elder cartographers as the living compass of high-altitude thunderstorm fronts.",
    metrics: [
      { label: "WINGSPAN", value: "184 M" },
      { label: "BAROMETRIC SENSITIVITY", value: "0.02 hPa" },
      { label: "AGE ESTIMATE", value: "800+ YRS" },
    ],
    accentColor: "#38BDF8", // Sky
    colSpan: "lg:col-span-7",
    initialRotate: "-rotate-1",
    offsetY: "lg:translate-y-0",
  },
  {
    id: "sentinel",
    number: "05",
    name: "The Mossbound Sentinel",
    category: "MONUMENT // LIVING ARTIFACT",
    classification: "DORMANT CONSTRUCT",
    location: "Forgotten Grove — Ruins of Aethel",
    coords: '18°04\'55" S • 061°19\'40" E',
    elevation: "ELEV. 1,150M",
    image: "/creatures/moss_sentinel.jpg",
    description:
      "Monolithic granite entities carved before the Great Floods. Intertwining moss and ancient roots sustain an eternal low-frequency resonant hum within their core.",
    metrics: [
      { label: "ESTIMATED AGE", value: "~4,200 YRS" },
      { label: "PULSE FREQUENCY", value: "8.2 Hz" },
      { label: "MATERIAL", value: "RUNIC GRANITE" },
    ],
    accentColor: "#34D399", // Emerald
    colSpan: "lg:col-span-8 lg:col-start-3",
    initialRotate: "rotate-0",
    offsetY: "lg:translate-y-8",
  },
];

export default function DiscoverySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({});
  const [activeCard, setActiveCard] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-specimen-id");
            if (id) {
              setVisibleCards((prev) => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    const cards = document.querySelectorAll("[data-specimen-id]");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#87CEEB] text-[#0A2640] py-24 sm:py-32 md:py-40 px-5 sm:px-10 md:px-14 lg:px-20 overflow-hidden select-none selection:bg-[#0A2640] selection:text-white"
    >
      {/* Atmospheric Sky Blue Gradients & Ambient Blooms */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#7DC3E8] to-[#6EBBE2] pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-[600px] h-[600px] rounded-full bg-white/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-[550px] h-[550px] rounded-full bg-[#52A8D9]/25 blur-[120px] pointer-events-none" />

      {/* ========================================================
          OVERSIZED FLOATING BACKGROUND TYPOGRAPHY
          Curated scientific field journal / futuristic art exhibition
      ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <span className="absolute top-[8%] -left-12 font-bebas text-[18vw] leading-none text-[#071F36]/[0.035] tracking-widest whitespace-nowrap">
          EXPEDITION
        </span>
        <span className="absolute top-[38%] -right-16 font-bebas text-[20vw] leading-none text-[#071F36]/[0.035] tracking-widest whitespace-nowrap">
          TAXONOMY
        </span>
        <span className="absolute bottom-[14%] -left-8 font-bebas text-[18vw] leading-none text-[#071F36]/[0.035] tracking-widest whitespace-nowrap">
          SANCTUARY
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* ========================================================
            EDITORIAL HEADER AREA
        ======================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12 pb-16 sm:pb-24 border-b border-[#0A2640]/15">
          {/* Left: Section Badge + Big Headline */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/45 backdrop-blur-md border border-white/65 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-[#0D3254] mb-4 sm:mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>CLASSIFIED FIELD ARCHIVE // VOL. IV</span>
            </div>

            <h2 className="font-bebas text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.04em] uppercase text-[#081F36] leading-[0.85]">
              DISCOVER ELF
            </h2>

            <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg font-normal text-[#0F3B63]/85 leading-relaxed max-w-2xl">
              An unmapped ecosystem where primordial biology transcends natural law.
              Explore classified field journals, recorded sightings, and living anomalies
              cataloged across the sacred sanctuaries of Elf.
            </p>
          </div>

          {/* Right: Curatorial Micro-Metadata */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 font-mono text-[11px] text-[#0A2640]/75 tracking-wider border-l lg:border-l-0 lg:border-r border-[#0A2640]/20 pl-4 lg:pl-0 lg:pr-4">
            <div>
              <span className="block text-[9px] uppercase tracking-widest text-[#0A2640]/50">
                SYSTEM IDENTIFIER
              </span>
              <span className="font-semibold text-[#081F36]">ELF SYSTEM 04</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-widest text-[#0A2640]/50">
                SPECIMEN LOGS
              </span>
              <span className="font-semibold text-[#081F36]">05 RECORDED ANOMALIES</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-widest text-[#0A2640]/50">
                FIELD CLEARANCE
              </span>
              <span className="font-semibold text-emerald-800">LEVEL IV // UNRESTRICTED</span>
            </div>
          </div>
        </div>

        {/* Hairline Grid Coordinates Bar */}
        <div className="w-full flex items-center justify-between py-4 text-[10px] font-mono text-[#0A2640]/60 tracking-widest uppercase border-b border-[#0A2640]/10 mb-16 sm:mb-20">
          <span>SEC // 04.A — TAXONOMIC OVERVIEW</span>
          <span className="hidden sm:inline">REF: ARCHIVE-FLR-2026</span>
          <span>LAT. 14°N — LONG. 101°E</span>
        </div>

        {/* ========================================================
            ASYMMETRIC EDITORIAL GRID (4-6 CARDS)
            Different sizes, offsets, subtle rotations & rich interactions
        ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
          {SPECIMENS.map((specimen, idx) => {
            const isVisible = visibleCards[specimen.id];
            const isHovered = activeCard === specimen.id;

            return (
              <div
                key={specimen.id}
                data-specimen-id={specimen.id}
                onMouseEnter={() => setActiveCard(specimen.id)}
                onMouseLeave={() => setActiveCard(null)}
                className={`group relative ${specimen.colSpan} ${specimen.offsetY || ""} transition-all duration-700 ease-out`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? "translate3d(0, 0, 0) scale(1)"
                    : "translate3d(0, 40px, 0) scale(0.96)",
                  transitionDelay: `${idx * 120}ms`,
                }}
              >
                {/* Card Container with Editorial Frosted Styling */}
                <div
                  className={`relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-md border border-white/65 p-4 sm:p-6 shadow-[0_12px_40px_rgba(10,38,64,0.08)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_24px_60px_rgba(10,38,64,0.18)] group-hover:bg-white/50 group-hover:border-white/80 ${specimen.initialRotate} group-hover:rotate-0`}
                >
                  {/* Subtle Background Accent Glow on Card Hover */}
                  <div
                    className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-30 pointer-events-none"
                    style={{ backgroundColor: specimen.accentColor }}
                  />

                  {/* Top Bar inside Card: Number + Category */}
                  <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#0A2640]/10 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bebas text-lg text-[#081F36] tracking-wider">
                        [{specimen.number}]
                      </span>
                      <span className="text-[10px] tracking-widest uppercase text-[#0D3254]/80 font-semibold">
                        {specimen.category}
                      </span>
                    </div>

                    <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-white/60 text-[#081F36] font-medium border border-white/60 tracking-wider">
                      {specimen.classification}
                    </span>
                  </div>

                  {/* Image Container with Editorial Zoom & Vignette */}
                  <div className="relative w-full overflow-hidden rounded-2xl bg-black/10 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] mb-5">
                    <img
                      src={specimen.image}
                      alt={specimen.name}
                      className="w-full h-full object-cover object-center select-none transition-transform duration-700 ease-out group-hover:scale-108"
                      draggable={false}
                    />

                    {/* Gradient Overlay for Mood & Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                    {/* Coordinates Stamp inside Image (bottom-left) */}
                    <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm border border-white/20 text-[9px] font-mono text-white/90 tracking-wider">
                      <span>{specimen.coords}</span>
                    </div>

                    {/* Elevation Stamp (bottom-right) */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm border border-white/20 text-[9px] font-mono text-white/90 tracking-wider">
                      <span>{specimen.elevation}</span>
                    </div>
                  </div>

                  {/* Specimen Name & Description */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-bebas text-2xl sm:text-3xl md:text-4xl uppercase text-[#081F36] tracking-wide group-hover:text-black transition-colors duration-300">
                        {specimen.name}
                      </h3>
                      <span className="text-xs font-mono font-medium text-[#0A2640]/60 group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#0F3B63]/70">
                      LOC: {specimen.location}
                    </span>

                    <p className="text-xs sm:text-[13px] text-[#0A2640]/85 font-sans leading-relaxed mt-1">
                      {specimen.description}
                    </p>
                  </div>

                  {/* Micro-Metrics Bar on Bottom (reveals rich details on hover) */}
                  <div className="mt-5 pt-4 border-t border-[#0A2640]/10 grid grid-cols-3 gap-2 text-[10px] font-mono">
                    {specimen.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-wider text-[#0A2640]/55">
                          {metric.label}
                        </span>
                        <span className="font-semibold text-[#081F36] text-[10px] sm:text-[11px] mt-0.5">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================
            STRONG CENTERED CALL TO ACTION: "ENTER THE WORLD →"
        ======================================================== */}
        <div className="mt-24 sm:mt-32 md:mt-40 text-center flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-[10px] font-mono uppercase tracking-[0.3em] text-[#0A2640]/80 mb-6">
            <span>EXPEDITION CLEARANCE // ALL ZONES</span>
          </div>

          <h3 className="font-bebas text-4xl sm:text-5xl md:text-6xl text-[#081F36] tracking-wide uppercase mb-8 max-w-xl">
            Begin Your Journey Across the Sanctuaries
          </h3>

          <a
            href="#enter"
            className="group relative inline-flex items-center justify-center gap-4 px-10 sm:px-14 py-4 sm:py-5 rounded-full bg-[#081F36] text-white text-sm sm:text-base font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-black hover:scale-105 active:scale-95 shadow-[0_12px_36px_rgba(8,31,54,0.35)] hover:shadow-[0_16px_48px_rgba(8,31,54,0.5)]"
          >
            <span className="relative z-10">Enter the World</span>
            <span className="relative z-10 font-sans text-lg transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 via-sky-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </a>

          <p className="mt-4 text-[11px] font-mono text-[#0A2640]/70 tracking-widest uppercase">
            IMMERSIVE DISCOVERY • VIRTUAL EXHIBITION
          </p>
        </div>
      </div>
    </section>
  );
}

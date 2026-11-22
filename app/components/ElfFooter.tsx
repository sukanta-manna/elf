"use client";

export default function ElfFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#020509] text-[#E2DDD5] pt-28 sm:pt-36 md:pt-44 pb-12 sm:pb-16 px-5 sm:px-10 md:px-14 lg:px-20 overflow-hidden select-none">
      {/* Seamless Transition Gradient from Sky Blue to Midnight Obsidian */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#6EBBE2] via-[#0A2640]/80 to-[#020509] pointer-events-none" />

      {/* Subtle Atmospheric Starlight Glow in Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-900/10 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-950/15 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto z-10 flex flex-col justify-between min-h-[70vh]">
        {/* ========================================================
            TOP FOOTER BAR: Art Book Colophon & Micro-Links
        ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-16 sm:pb-24 border-b border-white/10">
          {/* Brand Statement / Monograph Introduction */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {/* Geometric architectural square logo from hero */}
                <div className="w-5 h-5">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#E2DDD5]">
                    <path d="M3 14V3H14" stroke="currentColor" strokeWidth="2.8" strokeLinecap="square" />
                    <path d="M21 10V21H10" stroke="currentColor" strokeWidth="2.8" strokeLinecap="square" />
                  </svg>
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#E2DDD5]/70">
                  ELF MONOGRAPH // ED. IV
                </span>
              </div>

              <p className="text-sm sm:text-base font-normal text-zinc-400 leading-relaxed max-w-md">
                A sanctuary of living myth and unexplored wonders, where primordial folklore meets futuristic ecology. Published as an ongoing archival record of the unmapped realms.
              </p>
            </div>

            {/* Back to Top Button */}
            <div className="mt-8 md:mt-12">
              <button
                type="button"
                onClick={scrollToTop}
                className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono tracking-widest uppercase text-zinc-300 hover:text-white transition-all duration-300"
              >
                <span>RETURN TO CANOPY</span>
                <span className="font-sans transition-transform duration-300 group-hover:-translate-y-1">
                  ↑
                </span>
              </button>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-4 flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-5">
              SANCTUARY NAVIGATION
            </span>
            <ul className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs sm:text-[13px] font-medium uppercase tracking-[0.15em] text-zinc-300">
              <li>
                <a href="#creator" className="hover:text-white transition-colors duration-200">
                  Creator
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-white transition-colors duration-200">
                  Collection
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors duration-200">
                  About
                </a>
              </li>
              <li>
                <a href="#explore" className="hover:text-white transition-colors duration-200">
                  Exhibitions
                </a>
              </li>
              <li>
                <a href="#field-notes" className="hover:text-white transition-colors duration-200">
                  Field Notes
                </a>
              </li>
              <li>
                <a href="#manifesto" className="hover:text-white transition-colors duration-200">
                  Manifesto
                </a>
              </li>
            </ul>
          </div>

          {/* Connect & Socials Column */}
          <div className="md:col-span-3 flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-5">
              FIELD CORRESPONDENCE
            </span>
            <ul className="space-y-3 text-xs sm:text-[13px] font-mono text-zinc-400">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between hover:text-white transition-colors"
                >
                  <span>INSTAGRAM</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between hover:text-white transition-colors"
                >
                  <span>TWITTER / X</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between hover:text-white transition-colors"
                >
                  <span>DISCORD SANCTUARY</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://artstation.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between hover:text-white transition-colors"
                >
                  <span>ARTSTATION ARCHIVE</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ========================================================
            OVERSIZED ELF TYPOGRAPHY
            Monumental art book finale matching the hero's grandeur
        ======================================================== */}
        
        <div className="py-12 sm:py-16 md:py-20 flex items-center justify-center overflow-hidden">
          <h2 className="font-bebas text-[20vw] sm:text-[21vw] md:text-[22vw] leading-[0.74] tracking-[0.06em] text-[#E2DDD5]/90 hover:text-white transition-colors duration-500 uppercase text-center font-normal drop-shadow-[0_4px_40px_rgba(0,0,0,0.8)] cursor-default w-full">
            ELF
          </h2>
        </div>
      
        {/* ========================================================
            BOTTOM LEGAL & METADATA LINE
        ======================================================== */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-[11px] font-mono text-zinc-500 tracking-wider">
          <div className="flex items-center gap-3">
            <span>© 2026 ELF ARCHIVES</span>
            <span>•</span>
            <span>ALL SPECIMENS RECORDED</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">SANCTUARY SYSTEM 04</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span>TERMS // ARCHIVE</span>
            <span>PRIVACY PROTOCOL</span>
            <span>@ELF.WORLD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

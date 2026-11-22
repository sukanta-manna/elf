"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import WaterfallStorySection from "./components/WaterfallStorySection";
import DiscoverySection from "./components/DiscoverySection";
import ElfFooter from "./components/ElfFooter";

const Hero3DScene = dynamic(() => import("./components/Hero3DScene"), {
  ssr: false,
});

export default function Home() {
  const [isLiked, setIsLiked] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);

  // Smooth cursor-following movement with easing/lerp & requestAnimationFrame
  useEffect(() => {
    const hero = heroRef.current;
    const reveal = revealRef.current;
    if (!hero || !reveal) return;

    let animId: number;
    let isMaskTicking = false;
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const updateMask = () => {
      // If hero is off screen, sleep
      if (window.scrollY >= (window.innerHeight || 800)) {
        isMaskTicking = false;
        return;
      }

      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;

      // Easing / lerp interpolation towards cursor position
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.15);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.15);

      if (reveal) {
        const x = currentPos.current.x.toFixed(1);
        const y = currentPos.current.y.toFixed(1);
        // Soft circular spotlight mask centered on cursor with 260px radius and feathered glowing edge
        const mask = `radial-gradient(circle 260px at ${x}px ${y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 130px, rgba(0,0,0,0.85) 175px, rgba(0,0,0,0.4) 220px, transparent 260px, transparent 100%)`;
        reveal.style.webkitMaskImage = mask;
        reveal.style.maskImage = mask;
      }

      if (isHoveredRef.current || Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        animId = requestAnimationFrame(updateMask);
      } else {
        isMaskTicking = false;
      }
    };

    const triggerMaskTick = () => {
      if (!isMaskTicking && window.scrollY < (window.innerHeight || 800)) {
        isMaskTicking = true;
        animId = requestAnimationFrame(updateMask);
      }
    };

    const handlePointerMoveGlobal = (e: PointerEvent) => {
      if (!hero || !reveal) return;
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const inside =
        x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

      if (inside) {
        if (!isHoveredRef.current) {
          currentPos.current = { x, y };
          targetPos.current = { x, y };
          isHoveredRef.current = true;
          reveal.style.opacity = "1";
        } else {
          targetPos.current = { x, y };
        }
        triggerMaskTick();
      } else {
        if (isHoveredRef.current) {
          isHoveredRef.current = false;
          reveal.style.opacity = "0";
        }
      }
    };

    const handlePointerLeaveGlobal = () => {
      if (!reveal) return;
      isHoveredRef.current = false;
      reveal.style.opacity = "0";
    };

    window.addEventListener("pointermove", handlePointerMoveGlobal, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeaveGlobal);
    window.addEventListener("blur", handlePointerLeaveGlobal);
    document.addEventListener("mouseleave", handlePointerLeaveGlobal);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", handlePointerMoveGlobal);
      window.removeEventListener("pointerleave", handlePointerLeaveGlobal);
      window.removeEventListener("blur", handlePointerLeaveGlobal);
      document.removeEventListener("mouseleave", handlePointerLeaveGlobal);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!heroRef.current || !revealRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!isHoveredRef.current) {
      currentPos.current = { x, y };
      targetPos.current = { x, y };
      isHoveredRef.current = true;
      revealRef.current.style.opacity = "1";
    } else {
      targetPos.current = { x, y };
    }
  };

  const handlePointerLeave = () => {
    isHoveredRef.current = false;
    if (revealRef.current) {
      revealRef.current.style.opacity = "0";
    }
  };

  return (
    <main className="relative w-full bg-[#000000] overflow-x-clip">
      <div
        ref={heroRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative min-h-screen h-screen w-full bg-[#000000] text-white flex flex-col justify-between overflow-x-hidden select-none"
      >
      {/* Base Image Layer (BG_IMAGE_1.png) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <img
          src="/BG_IMAGE_1.png"
          alt="Elf Base World"
          className="w-full h-full object-cover object-center select-none"
          draggable={false}
        />
      </div>

      {/* Reveal Image Layer (BG_IMAGE_2.png) with cursor-following soft circular spotlight */}
      <div
        ref={revealRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1] transition-opacity duration-300 ease-out"
        style={{
          opacity: 0,
          pointerEvents: "none",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}
      >
        <img
          src="/BG_IMAGE_2.png"
          alt="Elf Reveal World"
          className="w-full h-full object-cover object-center select-none"
          draggable={false}
        />
      </div>

      {/* 3D Forest Fairy Character (Center of Hero, Head/Eyes follow cursor) */}
      <Hero3DScene />

      {/* Top Navigation Bar */}
      <header className="relative w-full z-30 px-5 sm:px-10 md:px-14 lg:px-18 xl:px-20 pt-6 sm:pt-9 md:pt-10">
        <div className="w-full flex items-center justify-between">
          {/* Left: Geometric Logo + Navigation Links */}
          <div className="flex items-center gap-4 sm:gap-10 md:gap-14">
            {/* Geometric architectural square logo from reference */}
            <a
              href="#"
              className="group flex items-center justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
              aria-label="Elf Home"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-[26px] md:h-[26px] transition-transform duration-300 group-hover:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-full h-full text-white"
                >
                  {/* Top-left bracket */}
                  <path
                    d="M3 14V3H14"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="square"
                  />
                  {/* Bottom-right bracket */}
                  <path
                    d="M21 10V21H10"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
            </a>

            {/* Navigation Links */}
            <nav className="flex items-center gap-3 sm:gap-7 md:gap-11 text-[10px] sm:text-[11px] md:text-xs font-medium uppercase tracking-[0.18em] sm:tracking-[0.25em] text-[#E2DDD5]/90">
              <a
                href="#creator"
                className="transition-colors duration-200 hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
              >
                Creator
              </a>
              <a
                href="#collection"
                className="transition-colors duration-200 hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
              >
                Collection
              </a>
              <a
                href="#about"
                className="transition-colors duration-200 hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
              >
                About
              </a>
            </nav>
          </div>

          {/* Right: Heart, Search, and EXPLORE */}
          <div className="flex items-center gap-3.5 sm:gap-6 md:gap-8">
            {/* Wishlist / Heart button */}
            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className="text-zinc-200 hover:text-white transition-all duration-200 p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
              aria-label="Toggle favorite"
            >
              <svg
                viewBox="0 0 24 24"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[17px] md:h-[17px] transition-colors duration-300 ${
                  isLiked ? "text-rose-400" : ""
                }`}
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </button>

            {/* Search button with minimal popover input */}
            <div className="relative flex items-center">
              {isSearchOpen && (
                <div className="absolute right-7 top-1/2 -translate-y-1/2 flex items-center z-50">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Elf..."
                    autoFocus
                    className="bg-black/95 border border-zinc-700 text-xs px-3 py-1.5 rounded-sm w-36 sm:w-44 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-all shadow-xl"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-zinc-200 hover:text-white transition-colors duration-200 p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
                aria-label="Search"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[17px] md:h-[17px]"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </div>

            {/* EXPLORE action link matching reference */}
            <a
              href="#explore"
              className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#E2DDD5] hover:text-white transition-colors duration-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
            >
              Explore
            </a>
          </div>
        </div>
      </header>

      {/* Dominant Hero Element: ELF */}
      <main className="relative w-full max-w-full flex-1 flex items-center justify-center my-auto py-2 sm:py-4 select-none z-10 px-4 sm:px-6 overflow-hidden">
        <h1 className="font-bebas text-[20vw] sm:text-[22vw] md:text-[22vw] lg:text-[25vw] xl:text-[20.5vw] leading-[0.76] tracking-[0.04em] sm:tracking-[0.06em] md:tracking-[0.08em] text-[#E2DDD5] uppercase text-center font-normal drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)] select-none pointer-events-none w-full">
          EL          F
        </h1>
      </main>

      {/* Bottom Area: Supporting text, description, and CTA buttons */}
      <footer className="relative w-full z-20 px-5 sm:px-10 md:px-14 lg:px-18 xl:px-20 pb-8 sm:pb-12 md:pb-14">
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12">
          {/* Bottom Left Content Block */}
          <div className="max-w-xl flex flex-col">
            {/* Supporting text */}
            <p className="text-[13px] sm:text-sm md:text-base font-medium tracking-wide text-[#E2DDD5] mb-3.5 sm:mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Enter a world where creatures come alive
            </p>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-zinc-300 font-normal leading-[1.65] max-w-[270px] sm:max-w-[310px] mb-5 sm:mb-7 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              An immersive world of curious creatures, magical places, and stories waiting to be discovered.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#explore"
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#E2DDD5] text-black text-xs sm:text-[13px] font-semibold tracking-wide transition-all duration-300 hover:bg-white hover:shadow-[0_0_24px_rgba(255,255,255,0.35)] active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
              >
                <span>Explore Elf</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 font-sans">
                  →
                </span>
              </a>

              <a
                href="#creatures"
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white/30 text-white text-xs sm:text-[13px] font-medium tracking-wide transition-all duration-300 hover:border-white hover:text-white hover:bg-white/[0.1] active:scale-95 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
              >
                <span>Meet the Creatures</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 font-sans">
                  →
                </span>
              </a>
            </div>
          </div>

          {/* Bottom Right Handle/Credit matching reference @svg.graphixx */}
          <div className="flex items-center md:items-end justify-start md:justify-end pb-1 sm:pb-2">
            <span className="text-[11px] sm:text-xs font-mono tracking-widest text-zinc-400 hover:text-zinc-200 transition-colors cursor-default drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              @elf.world
            </span>
          </div>
        </div>
      </footer>
    </div>

    {/* Cinematic Waterfall Storytelling Section */}
    <WaterfallStorySection />

    {/* Elf Discovery Archive Section */}
    <DiscoverySection />

    {/* Visually Striking ELF Art Book Footer */}
     <ElfFooter />
  </main>
  );
}

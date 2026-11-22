"use client";

import { useEffect, useRef, useState } from "react";

export default function WaterfallStorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    // Measure viewport on mount and resize
    const updateSize = () => {
      setViewport({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    let animationFrameId: number;
    let targetProgress = 0;
    let currentProgress = 0;
    let isTicking = false;

    const updateSmoothProgress = () => {
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0005) {
        currentProgress += diff * 0.12;
        setScrollProgress(currentProgress);
        animationFrameId = requestAnimationFrame(updateSmoothProgress);
      } else {
        currentProgress = targetProgress;
        setScrollProgress(targetProgress);
        isTicking = false;
      }
    };

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      if (totalScrollable <= 0) return;

      // Calculate progress from 0 (section top hits viewport top) to 1 (section bottom hits viewport bottom)
      const currentScroll = -rect.top;
      const rawProgress = currentScroll / totalScrollable;
      targetProgress = Math.max(0, Math.min(1, rawProgress));

      if (!isTicking) {
        isTicking = true;
        animationFrameId = requestAnimationFrame(updateSmoothProgress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Clamped progress values for different phases
  const p = scrollProgress;

  // Image expansion phase: starts at p = 0.08, reaches full screen at p = 0.82
  const expandProgress = Math.max(0, Math.min(1, (p - 0.08) / 0.74));

  // Nonlinear easeInOutCubic for organic, cinematic expansion curve
  const easeExpand =
    expandProgress < 0.5
      ? 4 * expandProgress * expandProgress * expandProgress
      : 1 - Math.pow(-2 * expandProgress + 2, 3) / 2;

  // Staggered fade & translation helpers for the surrounding informational elements
  const getElementStyle = (
    startFade: number,
    endFade: number,
    moveX: number,
    moveY: number,
    baseRotate: number,
    extraRotate: number
  ) => {
    const fadeProgress = Math.max(0, Math.min(1, (p - startFade) / (endFade - startFade)));
    const opacity = Math.max(0, 1 - fadeProgress);
    const translateX = moveX * fadeProgress;
    const translateY = moveY * fadeProgress;
    const rotation = baseRotate + extraRotate * fadeProgress;
    const scale = 1 - 0.12 * fadeProgress;

    return {
      opacity,
      transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotation}deg) scale(${scale})`,
      pointerEvents: opacity < 0.05 ? ("none" as const) : ("auto" as const),
      visibility: opacity <= 0.001 ? ("hidden" as const) : ("visible" as const),
    };
  };

  // Dimensions computation without fragile CSS calc arithmetic
  const isMobile = viewport.w > 0 && viewport.w < 640;
  const isTablet = viewport.w >= 640 && viewport.w < 1024;

  let initialW = 250;
  if (viewport.w > 0) {
    if (isMobile) {
      initialW = Math.min(220, Math.max(175, viewport.w * 0.48));
    } else if (isTablet) {
      initialW = Math.min(240, Math.max(190, viewport.w * 0.24));
    } else {
      initialW = Math.min(270, Math.max(220, viewport.w * 0.17));
    }
  }
  const initialH = initialW * (16 / 9);

  const targetW = viewport.w || 1440;
  const targetH = viewport.h || 900;

  const currentW = initialW + (targetW - initialW) * easeExpand;
  const currentH = initialH + (targetH - initialH) * easeExpand;

  // Container styling
  const containerStyle: React.CSSProperties = {
    width:
      viewport.w === 0
        ? "clamp(180px, 18vw, 270px)"
        : easeExpand >= 0.999
        ? "100vw"
        : `${Math.round(currentW)}px`,
    height:
      viewport.w === 0
        ? undefined
        : easeExpand >= 0.999
        ? "100vh"
        : `${Math.round(currentH)}px`,
    aspectRatio: viewport.w === 0 ? "9 / 16" : undefined,
    borderRadius: easeExpand >= 0.99 ? "0px" : `${Math.max(0, 24 * (1 - easeExpand))}px`,
    boxShadow:
      easeExpand >= 0.98
        ? "none"
        : `0 24px 70px rgba(10, 38, 64, ${(0.28 * (1 - easeExpand)).toFixed(3)})`,
  };

  // Subtle inner camera push-in and vertical parallax
  const innerScale = 1.10 - 0.10 * easeExpand;
  const innerTranslateY = (1 - easeExpand) * -12;

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[350vh] bg-[#87CEEB] text-[#0A2640] selection:bg-[#0A2640] selection:text-white"
    >
      {/* Sticky Full-Viewport Exhibition Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Pure Sky Blue Background with Atmospheric Depth */}
        <div className="absolute inset-0 bg-[#87CEEB]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#7DC3E8] via-[#87CEEB] to-[#92D7F3] pointer-events-none" />

        {/* Ambient Light Blooms Behind Initial Image (softly dissipates on expand) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{ opacity: Math.max(0, 1 - easeExpand * 1.2) }}
        >
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-white/25 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] rounded-full bg-[#52A8D9]/30 blur-[100px]" />
        </div>

        {/* ========================================================
            ASYMMETRIC EDITORIAL "ORGANIZED CHAOS" TEXT ELEMENTS
            Surrounding the initial portrait image
        ======================================================== */}

        {/* 1. TOP-LEFT: Location Tag & Altitude */}
        <div
          className="absolute top-[4%] sm:top-[7%] md:top-[8%] left-[4%] sm:left-[7%] md:left-[9%] max-w-[190px] sm:max-w-[240px] z-10 transition-transform duration-75"
          style={getElementStyle(0.04, 0.35, -55, -40, -2, -3)}
        >
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/45 backdrop-blur-md border border-white/65 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#0D3254] mb-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>LOC // 04 • VEIL VALLEY</span>
          </div>
          <h2 className="font-bebas text-2xl sm:text-4xl md:text-5xl tracking-wide uppercase text-[#081F36] leading-[0.9]">
            The Emerald Cascade
          </h2>
          <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-mono text-[#0F3B63]/80 leading-relaxed">
            ELEV. 1,420M — ANCIENT MIST BASIN
            <br />
            14°22&apos;08&quot; N • 101°54&apos;30&quot; E
          </p>
        </div>

        {/* 2. TOP-RIGHT: Poetic Monologue / Archival Notes (Hidden on small mobile to avoid header collision) */}
        <div
          className="hidden sm:block absolute top-[6%] sm:top-[7%] right-[4%] sm:right-[6%] md:right-[8%] max-w-[200px] sm:max-w-[270px] z-10 transition-transform duration-75 text-right sm:text-left"
          style={getElementStyle(0.06, 0.36, 50, -45, 1.5, 3)}
        >
          <div className="p-3 sm:p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/65 shadow-[0_8px_30px_rgba(10,40,70,0.08)]">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#0A2640]/70 block mb-1.5">
              ELF ARCHIVES • ENTRY 94
            </span>
            <p className="text-xs sm:text-[13px] font-serif italic text-[#07192C] leading-relaxed">
              &ldquo;Where cold mountain water crashes into turquoise stillness, mist turns to breath and the air carries secrets.&rdquo;
            </p>
            <div className="mt-2.5 pt-2 border-t border-[#0A2640]/10 flex items-center justify-between text-[10px] font-mono text-[#0A2640]/70">
              <span>CANOPY SOUND: 42dB</span>
              <span>PURE SPRING</span>
            </div>
          </div>
        </div>

        {/* 3. MID-LEFT: Hydrological Measurement / Big Stat (Hidden on mobile to keep breathing room) */}
        <div
          className="hidden md:flex absolute top-[48%] -translate-y-1/2 left-[3%] sm:left-[5%] md:left-[7%] max-w-[160px] sm:max-w-[200px] z-10 transition-transform duration-75 flex-col"
          style={getElementStyle(0.1, 0.42, -70, 10, -1, -2)}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#0D3254]/75 mb-0.5">
            FLOW DISCHARGE
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bebas text-5xl sm:text-6xl md:text-7xl text-[#081F36] leading-none">
              840
            </span>
            <span className="text-xs font-mono font-semibold uppercase text-[#0D3254]">
              Tons/s
            </span>
          </div>
          <p className="text-[11px] font-mono text-[#0F3B63]/75 mt-1">
            DROP HEIGHT: 118 METERS
            <br />
            CONTINUOUS RUNOFF
          </p>
        </div>

        {/* 4. MID-RIGHT: Species & Biological Encounter Badge (Hidden on mobile to keep breathing room) */}
        <div
          className="hidden md:block absolute top-[46%] -translate-y-1/2 right-[3%] sm:right-[5%] md:right-[7%] max-w-[180px] sm:max-w-[220px] z-10 transition-transform duration-75"
          style={getElementStyle(0.09, 0.4, 65, 15, 2, 2.5)}
        >
          <div className="p-3 sm:p-3.5 rounded-xl bg-white/45 backdrop-blur-md border border-white/65 shadow-sm">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-semibold mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>RECORDED FAUNA</span>
            </div>
            <ul className="text-[11px] sm:text-xs font-sans text-[#081F36] space-y-1 leading-snug">
              <li>• Cerulean Mist Sprites</li>
              <li>• Forest Canopy Kingfishers</li>
              <li>• Phosphor River Beetles</li>
            </ul>
          </div>
        </div>

        {/* 5. BOTTOM-LEFT: Field Quote & Observation Stamp (Hidden on small mobile to avoid collision) */}
        <div
          className="hidden sm:block absolute bottom-[8%] sm:bottom-[9%] left-[4%] sm:left-[7%] md:left-[9%] max-w-[210px] sm:max-w-[270px] z-10 transition-transform duration-75"
          style={getElementStyle(0.14, 0.5, -45, 50, -1, -3)}
        >
          <p className="text-xs sm:text-[13px] font-medium text-[#07192C] leading-snug">
            &ldquo;Stand at the water&apos;s edge. The thunder of the falls swallows all thought until only quiet reverie remains.&rdquo;
          </p>
          <span className="block mt-1.5 text-[10px] font-mono uppercase tracking-widest text-[#0A2640]/70">
            — ELF FIELD SURVEY // VOL. III
          </span>
        </div>

        {/* 6. BOTTOM-RIGHT: Exhibition Stamp & Discovery Index */}
        <div
          className="absolute bottom-[4%] sm:bottom-[7%] md:bottom-[8%] right-[4%] sm:right-[7%] md:right-[9%] max-w-[180px] sm:max-w-[230px] z-10 transition-transform duration-75 text-right"
          style={getElementStyle(0.12, 0.46, 50, 45, 2, 3)}
        >
          <div className="inline-block p-2.5 sm:p-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 text-right shadow-sm">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#0A2640]/70 block">
              DISCOVERY EXHIBIT
            </span>
            <span className="font-bebas text-xl sm:text-2xl md:text-3xl text-[#081F36] tracking-wider block">
              NO. 07 // PRIMORDIAL
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-[#0D3254]/75 block mt-0.5">
              SANCTUARY STATUS: SACRED
            </span>
          </div>
        </div>

        {/* 7. FLOATING CUE ABOVE PORTRAIT: The Living Cascade */}
        <div
          className="hidden sm:block absolute top-[18%] sm:top-[16%] left-1/2 -translate-x-1/2 z-10 text-center whitespace-nowrap transition-transform duration-75"
          style={getElementStyle(0.02, 0.2, 0, -25, 0, 0)}
        >
          <span className="text-[10px] sm:text-xs font-mono font-medium uppercase tracking-[0.35em] text-[#0A2640]/80">
            [ EXHIBIT NO. 04 — THE LIVING CASCADE ]
          </span>
        </div>

        {/* 8. FLOATING SCROLL HINT BELOW PORTRAIT */}
        <div
          className="absolute bottom-[18%] sm:bottom-[13%] left-1/2 -translate-x-1/2 z-10 text-center whitespace-nowrap transition-transform duration-75"
          style={getElementStyle(0.02, 0.18, 0, 25, 0, 0)}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/35 backdrop-blur-sm border border-white/45 text-[10px] font-mono uppercase tracking-widest text-[#0A2640]/80">
            <span>SCROLL TO ENTER</span>
            <span className="animate-bounce">↓</span>
          </div>
        </div>

        {/* ========================================================
            CENTRAL CINEMATIC EXPANDING PORTRAIT IMAGE CONTAINER
            Smoothly scales from 9:16 portrait to full-screen 100vw/100vh
        ======================================================== */}
        <div
          className="relative z-20 overflow-hidden flex items-center justify-center will-change-[width,height,border-radius,box-shadow]"
          style={containerStyle}
        >
          {/* Subtle Outer Glowing Frame (fades as it expands) */}
          {easeExpand < 0.98 && (
            <div
              className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
              style={{
                borderRadius: `${Math.max(0, 24 * (1 - easeExpand))}px`,
                border: `1px solid rgba(255, 255, 255, ${(0.65 * (1 - easeExpand)).toFixed(2)})`,
                opacity: Math.max(0, 1 - easeExpand * 1.15),
              }}
            />
          )}

          {/* The Waterfall Image */}
          <img
            src="/Waterfall.png"
            alt="Elf Primordial Waterfall and Veil Basin"
            className="w-full h-full object-cover select-none pointer-events-none will-change-transform"
            style={{
              objectPosition: "48% 45%", // Anchors the cascading waterfall and emerald pool
              transform: `scale(${innerScale}) translateY(${innerTranslateY}px)`,
              transformOrigin: "center center",
            }}
            draggable={false}
          />

          {/* Subtle Inset Vignette / Mist Overlay on Initial Portrait (Fades to 0 at Full Screen) */}
          {easeExpand < 0.95 && (
            <div
              className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
              style={{
                opacity: Math.max(0, 0.16 * (1 - easeExpand * 1.25)),
                boxShadow: "inset 0 0 60px rgba(0, 0, 0, 0.3)",
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}


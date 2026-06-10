/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface BrandLogoProps {
  variant?: "horizontal" | "vertical" | "banner";
  className?: string;
  iconSize?: "sm" | "md" | "lg" | "xl";
}

export default function BrandLogo({ variant = "horizontal", className = "", iconSize = "md" }: BrandLogoProps) {
  // Dimension map for the royal icon emblem
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-28 h-28",
    xl: "w-40 h-40",
  };

  const currentSize = sizeClasses[iconSize];

  // Sovereign Golden Logo Emblem: Dual Leaf Wing with Vertical "KINGS" Monogram
  const IconGraphic = () => (
    <div className={`relative ${currentSize} flex items-center justify-center select-none shrink-0`}>
      <svg
        viewBox="0 0 200 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_16px_rgba(212,175,55,0.45)]"
      >
        <defs>
          {/* Majestic Metallic Luxury Gold Gradients */}
          <linearGradient id="luxuryGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9E6" />
            <stop offset="30%" stopColor="#E6C15C" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="75%" stopColor="#B38F24" />
            <stop offset="100%" stopColor="#806010" />
          </linearGradient>

          <linearGradient id="luxuryGoldGlow" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF2C2" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#5E4308" />
          </linearGradient>
        </defs>

        {/* 1. Left Symmetrical Wing Leaf Group */}
        <g fill="url(#luxuryGoldGrad)" fillRule="evenodd">
          {/* Top Leaf Contour (Pointing up-right/outwards) */}
          <path d="M 42,12 C 18,12 10,28 10,50 C 10,68 22,82 48,82 C 68,82 82,62 82,45 C 82,28 65,12 42,12 Z M 44,22 C 54,22 70,30 70,45 C 70,54 60,70 48,70 C 30,70 20,58 20,50 C 20,40 30,22 44,22 Z" />
          
          {/* Lower Leaf Contour (Pointing down-right/outwards) */}
          <path d="M 82,125 C 82,108 68,88 48,88 C 22,88 10,102 10,120 C 10,142 18,158 42,158 C 65,158 82,142 82,125 Z M 70,125 C 70,135 54,146 42,146 C 30,146 20,132 20,120 C 20,112 30,98 48,98 C 60,98 70,114 70,125 Z" />
        </g>

        {/* 2. Vertically Stacked Center "K I N G S" Text block with Royal Precision */}
        <g fill="url(#luxuryGoldGrad)" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="900" fontSize="16" textAnchor="middle" letterSpacing="0.05em">
          <text x="100" y="44">K</text>
          <text x="100" y="64">I</text>
          <text x="100" y="84">N</text>
          <text x="100" y="104">G</text>
          <text x="100" y="124">S</text>
        </g>

        {/* 3. Mirrored Right Wing Leaf Group (Symmetrical reflection across x = 100) */}
        <g transform="translate(200, 0) scale(-1, 1)" fill="url(#luxuryGoldGrad)" fillRule="evenodd">
          {/* Top Leaf Contour */}
          <path d="M 42,12 C 18,12 10,28 10,50 C 10,68 22,82 48,82 C 68,82 82,62 82,45 C 82,28 65,12 42,12 Z M 44,22 C 54,22 70,30 70,45 C 70,54 60,70 48,70 C 30,70 20,58 20,50 C 20,40 30,22 44,22 Z" />
          
          {/* Lower Leaf Contour */}
          <path d="M 82,125 C 82,108 68,88 48,88 C 22,88 10,102 10,120 C 10,142 18,158 42,158 C 65,158 82,142 82,125 Z M 70,125 C 70,135 54,146 42,146 C 30,146 20,132 20,120 C 20,112 30,98 48,98 C 60,98 70,114 70,125 Z" />
        </g>
      </svg>
    </div>
  );

  if (variant === "horizontal") {
    return (
      <div className={`flex items-center gap-4 select-none ${className}`}>
        <IconGraphic />
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-mono tracking-[0.45em] text-[#D4AF37] font-extrabold block uppercase leading-none mb-1.5">
            KINGS COLLECTION
          </span>
          <h1 className="text-2xl sm:text-3.5xl font-serif font-black tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFF2C2] via-[#D4AF37] to-[#A3791E] leading-none mb-1">
            HAVELI
          </h1>
          <span className="text-[8px] sm:text-[9.5px] font-sans font-extrabold tracking-[0.18em] text-slate-300 uppercase block leading-none">
            MULTI-CUISINE RESTAURANT & BANQUET HALL
          </span>
        </div>
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center text-center gap-4 select-none ${className}`}>
        <IconGraphic />
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-mono tracking-[0.55em] text-[#D4AF37] font-bold block uppercase leading-none mb-2">
            ESTD MARKAPUR
          </span>
          <h2 className="text-4xl sm:text-5.5xl font-serif font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFF2C2] via-[#D4AF37] to-[#A3791E] leading-zero drop-shadow-md pb-1.5">
            HAVELI
          </h2>
          <span className="text-[10px] sm:text-[11px] font-sans font-bold text-slate-300 mt-2.5 tracking-[0.22em] uppercase block text-center leading-relaxed max-w-sm">
            MULTI-CUISINE RESTAURANT & BANQUET HALL
          </span>
        </div>
      </div>
    );
  }

  // Beautiful luxury sign board style with high-end typography
  return (
    <div className={`w-full max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 border border-[#D4AF37]/35 bg-gradient-to-b from-[#23040A] via-[#0E0103] to-[#23040A] text-[#FAF6F0] text-center shadow-[0_12px_45px_rgba(0,0,0,0.9)] relative overflow-hidden backdrop-blur-md ${className}`}>
      {/* Golden spotlight overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Grid Headers */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-b border-slate-800/80 pb-6 mb-8">
        
        {/* Left Side Info */}
        <div className="text-left font-mono text-xs text-slate-300 space-y-2 tracking-wider">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600/35 border border-emerald-500/40 text-[#22c55e] font-bold text-[10px]">
              📎
            </span>
            <span className="font-bold text-[#D4AF37]">+91 99850 84847</span>
            <span className="text-[8px] text-emerald-400 font-mono px-1.5 py-0.5 bg-emerald-950/55 rounded uppercase border border-emerald-500/20">Active WhatsApp</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-[10px]">
              💳
            </span>
            <span className="font-bold text-slate-100">+91 70132 20053</span>
            <span className="text-[8px] text-amber-300 font-mono px-1.5 py-0.5 bg-amber-950/55 rounded uppercase border border-amber-500/10">Instant UPI</span>
          </div>
        </div>

        {/* Center Emblem alignment using our new exact leaf coordinate set */}
        <div className="flex items-center gap-3 bg-white/5 px-4.5 py-2.5 rounded-2xl border border-white/10 shrink-0">
          <div className="w-12 h-12">
            <IconGraphic />
          </div>
          <div className="text-left font-mono">
            <span className="text-[8px] text-[#D4AF37] font-bold block tracking-widest uppercase">KINGS MONARCHY</span>
            <span className="text-[11px] text-white font-extrabold block">HAVELI FOODS</span>
          </div>
        </div>

      </div>

      {/* Main Title Group */}
      <div className="space-y-4 my-8">
        <h1 className="text-5xl sm:text-7.5xl font-serif font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2C2] via-[#D4AF37] to-[#A3791E] drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] leading-none">
          HAVELI
        </h1>
        <p className="text-[10px] sm:text-sm font-sans font-extrabold tracking-[0.45em] text-slate-200 uppercase leading-none mt-3">
          MULTI-CUISINE RESTAURANT & BANQUET HALL
        </p>
      </div>

      {/* Telugu Royal Script Panel */}
      <div className="bg-black/45 py-5 px-7 rounded-2xl border border-slate-800/60 my-8 space-y-2">
        <h2 className="text-4xl sm:text-5xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF2C2] via-[#D4AF37] to-[#FFF2C2] tracking-wide leading-relaxed">
          హోవేలి
        </h2>
        <p className="text-xs sm:text-sm font-sans font-bold text-[#EAC775] tracking-[0.11em] uppercase">
          లగ్జరీ ఫ్యామిలీ రెస్టారెంట్ & రాయల్ బ్యాంకెట్ హాల్
        </p>
      </div>

      {/* Symmetrical Lower Details */}
      <div className="border-t border-slate-800 pt-6 mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Address */}
        <div className="md:col-span-7 text-left space-y-1.5">
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block">Location Landmark</span>
          <p className="text-xs sm:text-sm font-sans font-medium text-slate-300 leading-normal">
            Opp. RTC Bus stand, Register Office Line, N.S Nagar, MARKAPUR, AP, PIN 523316
          </p>
        </div>

        {/* Helpline */}
        <div className="md:col-span-5 bg-gradient-to-r from-[#4A0E1A] to-[#23040A] p-4 rounded-xl border border-[#D4AF37]/25 text-left flex items-center justify-between gap-3">
          <div>
            <span className="text-[8px] font-mono font-bold text-[#D4AF37] uppercase block leading-none mb-1.5">📞 OWNER HELPLINE</span>
            <span className="text-base sm:text-lg font-mono font-bold text-white leading-none block tracking-widest">
              7981562535
            </span>
          </div>
          <div className="bg-[#D4AF37] text-[#23040A] px-3 py-2 rounded-lg text-[9px] font-sans font-extrabold uppercase text-center leading-none tracking-wider">
            LUXURY
          </div>
        </div>

      </div>

    </div>
  );
}

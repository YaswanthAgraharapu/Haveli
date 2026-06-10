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

  // Premium Logo Redesign: SVG Crown & Luxury H Monogram
  const IconGraphic = () => (
    <div className={`relative ${currentSize} flex items-center justify-center select-none shrink-0`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(212,175,55,0.25)]"
      >
        <defs>
          {/* Majestic Metallic Luxury Gold Gradients */}
          <linearGradient id="luxuryGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9E6" />
            <stop offset="25%" stopColor="#E6C15C" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="75%" stopColor="#B38F24" />
            <stop offset="100%" stopColor="#806010" />
          </linearGradient>

          <linearGradient id="luxuryGoldGlow" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF2C2" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#5E4308" />
          </linearGradient>

          <filter id="royalGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dynamic Halo Accent */}
        <circle cx="100" cy="100" r="94" stroke="url(#luxuryGoldGrad)" strokeWidth="1" strokeDasharray="4 8" opacity="0.3" className="animate-spin" style={{ animationDuration: "120s" }} />

        {/* Elegant Hexagonal/Circular Filigree Frame */}
        <circle cx="100" cy="100" r="88" stroke="url(#luxuryGoldGrad)" strokeWidth="1.5" opacity="0.6" />
        <circle cx="100" cy="100" r="82" stroke="url(#luxuryGoldGrad)" strokeWidth="0.5" opacity="0.4" />

        {/* Small external gem spheres */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI) / 4;
          const cx = 100 + 88 * Math.cos(angle);
          const cy = 100 + 88 * Math.sin(angle);
          return <circle key={i} cx={cx} cy={cy} r="2.5" fill="url(#luxuryGoldGrad)" />;
        })}

        {/* --- THE SHIELD / CREST --- */}
        <path
          d="M 100,50 L 140,75 L 140,125 C 140,155 118,175 100,182 C 82,175 60,155 60,125 L 60,75 Z"
          stroke="url(#luxuryGoldGrad)"
          strokeWidth="2"
          fill="rgba(11, 21, 40, 0.4)"
          fillOpacity="0.8"
        />

        {/* --- CROWN INTEGRATION --- */}
        <g transform="translate(72, 60)">
          {/* Main Crown Base */}
          <path
            d="M 5,28 L 51,28 L 48,32 L 8,32 Z"
            fill="url(#luxuryGoldGrad)"
          />
          {/* Jewels on Base */}
          <circle cx="12" cy="30" r="1.5" fill="#FFF" />
          <circle cx="28" cy="30" r="1.5" fill="#FFF" />
          <circle cx="44" cy="30" r="1.5" fill="#FFF" />

          {/* Crown Peaks */}
          <path
            d="M 5,26 L 10,12 L 20,22 L 28,8 L 36,22 L 46,12 L 51,26 Z"
            fill="url(#luxuryGoldGrad)"
            stroke="url(#luxuryGoldGlow)"
            strokeWidth="0.5"
          />

          {/* Orbs on Peaks */}
          <circle cx="10" cy="11" r="2" fill="url(#luxuryGoldGrad)" />
          <circle cx="28" cy="7" r="2.5" fill="url(#luxuryGoldGrad)" />
          <circle cx="46" cy="11" r="2" fill="url(#luxuryGoldGrad)" />
        </g>

        {/* --- PREMIUM 'H' MONOGRAM --- */}
        <g transform="translate(74, 98)">
          {/* Left Serif Column */}
          <path
            d="M 4,4 L 14,4 L 14,8 L 11,8 L 11,32 L 14,32 L 14,36 L 4,36 L 4,32 L 7,32 L 7,8 L 4,8 Z"
            fill="url(#luxuryGoldGrad)"
          />
          {/* Right Serif Column */}
          <path
            d="M 38,4 L 48,4 L 48,8 L 45,8 L 45,32 L 48,32 L 48,36 L 38,36 L 38,32 L 41,32 L 41,8 L 38,8 Z"
            fill="url(#luxuryGoldGrad)"
          />
          {/* Elegant Filigree Crossbar matching Mughal arch */}
          <path
            d="M 10,18 C 17,14 31,14 39,18 L 39,22 C 31,18 17,18 10,22 Z"
            fill="url(#luxuryGoldGrad)"
          />
        </g>

        {/* Minimal Laurel Leaves */}
        <path
          d="M 35,140 Q 45,170 100,195 Q 155,170 165,140"
          stroke="url(#luxuryGoldGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    </div>
  );

  if (variant === "horizontal") {
    return (
      <div className={`flex items-center gap-4 select-none ${className}`}>
        <IconGraphic />
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-mono tracking-[0.4em] text-[#D4AF37] font-bold block uppercase leading-none mb-1 shadow-xs">
            HAVELI CLAN
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-[0.1em] text-white">
            HAVELI
          </h1>
          <span className="text-[8px] sm:text-[9.5px] font-sans font-medium tracking-[0.15em] text-slate-300 uppercase mt-0.5 block leading-none">
            BANQUET HALL & RESTAURANT
          </span>
        </div>
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center text-center gap-3.5 select-none ${className}`}>
        <IconGraphic />
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-mono tracking-[0.55em] text-[#D4AF37] font-bold block uppercase leading-none mb-1.5">
            ESTD MARKAPUR
          </span>
          <h2 className="text-3xl sm:text-4.5xl font-serif text-white font-black tracking-[0.15em] leading-none drop-shadow-md">
            HAVELI
          </h2>
          <span className="text-[10px] sm:text-[11px] font-sans font-medium text-slate-300 mt-2 tracking-[0.25em] uppercase block text-center leading-relaxed max-w-xs">
            BANQUET HALL & RESTAURANT
          </span>
        </div>
      </div>
    );
  }

  // Beautiful luxury sign board style with high-end typography
  return (
    <div className={`w-full max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 border border-[#D4AF37]/35 bg-gradient-to-b from-[#23040A] via-[#080808] to-[#23040A] text-[#FAF6F0] text-center shadow-[0_12px_40px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-md ${className}`}>
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

        {/* Center Emblem alignment */}
        <div className="flex items-center gap-3 bg-white/5 px-4.5 py-2 rounded-2xl border border-white/10 shrink-0">
          <div className="w-10 h-10">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <use href="#luxuryGoldGrad" />
              <circle cx="100" cy="100" r="85" stroke="url(#luxuryGoldGrad)" strokeWidth="1" opacity="0.3" />
              <g transform="translate(68, 60) scale(1.1)">
                <path d="M 5,26 L 10,12 L 20,22 L 28,8 L 36,22 L 46,12 L 51,26 Z" fill="url(#luxuryGoldGrad)" />
              </g>
            </svg>
          </div>
          <div className="text-left font-mono">
            <span className="text-[8px] text-[#D4AF37] font-bold block tracking-widest uppercase">ROYAL MONARCHY</span>
            <span className="text-[11px] text-white font-extrabold block">HAVELI BANQUETS</span>
          </div>
        </div>

      </div>

      {/* Main Title Group */}
      <div className="space-y-4 my-8">
        <h1 className="text-5xl sm:text-7xl font-serif font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2C2] via-[#D4AF37] to-[#A3791E] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] leading-none">
          HAVELI
        </h1>
        <p className="text-[10px] sm:text-sm font-sans font-bold tracking-[0.45em] text-slate-300 uppercase leading-none mt-2">
          BANQUET HALL & RESTAURANT
        </p>
      </div>

      {/* Telugu Royal Script Panel */}
      <div className="bg-black/45 py-5 px-7 rounded-2xl border border-slate-800/60 my-8 space-y-2">
        <h2 className="text-4xl sm:text-5xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF2C2] via-[#D4AF37] to-[#FFF2C2] tracking-wide leading-relaxed">
          హోవేలి
        </h2>
        <p className="text-xs sm:text-sm font-sans font-bold text-[#EAC775] tracking-[0.1em] uppercase">
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

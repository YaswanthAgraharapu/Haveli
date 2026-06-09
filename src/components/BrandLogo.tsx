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
    sm: "w-10 h-7",
    md: "w-16 h-11",
    lg: "w-24 h-16",
    xl: "w-36 h-24",
  };

  const currentSize = sizeClasses[iconSize];

  // Stylized double-leaf wing emblem with vertical "KINGS" column
  const IconGraphic = () => (
    <div className={`relative ${currentSize} flex items-center justify-center select-none shrink-0`}>
      <svg
        viewBox="0 0 160 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_5px_rgba(0,0,0,0.4)] animate-pulse"
        style={{ animationDuration: "6s" }}
      >
        <defs>
          {/* Majestic Metallic Gold Gradient */}
          <linearGradient id="royalGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF8D6" />
            <stop offset="30%" stopColor="#EAC775" />
            <stop offset="70%" stopColor="#C49B3B" />
            <stop offset="100%" stopColor="#9E761E" />
          </linearGradient>
          {/* Deep Royal Wine Red Gradient for center column */}
          <linearGradient id="emblemRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A81C24" />
            <stop offset="50%" stopColor="#800E14" />
            <stop offset="100%" stopColor="#4A0508" />
          </linearGradient>
        </defs>

        {/* --- LEFT GOLDEN STYLIZED LEAF/WING --- */}
        <g transform="translate(10, 5)">
          <path
            d="M 50 10 
               C 15 10, 5 45, 10 65 
               C 15 80, 45 85, 50 85 
               C 35 80, 24 68, 22 52 
               C 20 35, 36 22, 50 22 Z"
            fill="url(#royalGoldGrad)"
          />
          <path
            d="M 48 32 
               C 28 32, 18 48, 20 62 
               C 22 72, 40 76, 48 76 
               C 36 71, 30 60, 30 50 
               C 30 40, 38 34, 48 34 Z"
            fill="url(#royalGoldGrad)"
            opacity="0.85"
          />
        </g>

        {/* --- CENTER COLUMN: K I N G S --- */}
        <g transform="translate(68, 3)">
          <rect
            x="0"
            y="5"
            width="24"
            height="84"
            rx="4"
            fill="url(#emblemRedGrad)"
            stroke="url(#royalGoldGrad)"
            strokeWidth="1.75"
          />
          {/* Vertical text letters for "KINGS" */}
          {["K", "I", "N", "G", "S"].map((char, index) => (
            <text
              key={index}
              x="12"
              y={20 + index * 14}
              fill="#FFFFFF"
              fontFamily="sans-serif"
              fontWeight="900"
              fontSize="11"
              textAnchor="middle"
              className="tracking-tight"
            >
              {char}
            </text>
          ))}
        </g>

        {/* --- RIGHT GOLDEN STYLIZED LEAF/WING --- */}
        <g transform="translate(150, 5) scale(-1, 1)">
          <path
            d="M 50 10 
               C 15 10, 5 45, 10 65 
               C 15 80, 45 85, 50 85 
               C 35 80, 24 68, 22 52 
               C 20 35, 36 22, 50 22 Z"
            fill="url(#royalGoldGrad)"
          />
          <path
            d="M 48 32 
               C 28 32, 18 48, 20 62 
               C 22 72, 40 76, 48 76 
               C 36 71, 30 60, 30 50 
               C 30 40, 38 34, 48 34 Z"
            fill="url(#royalGoldGrad)"
            opacity="0.85"
          />
        </g>
      </svg>
    </div>
  );

  // Variant layouts for flexible render locations
  if (variant === "horizontal") {
    return (
      <div className={`flex items-center gap-3.5 select-none ${className}`}>
        <IconGraphic />
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-mono tracking-[0.3em] text-[#EAC775] font-extrabold block uppercase leading-none mb-1 shadow-xs">
            KINGS GROUP
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-widest text-[#EAC775] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] leading-none select-none">
            HAVELI
          </h1>
          <span className="text-[7.5px] sm:text-[9.5px] font-sans font-bold tracking-[0.12em] text-white/90 uppercase mt-1 block leading-none">
            Multi-Cuisine Restaurant & Banquet Hall
          </span>
        </div>
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center text-center gap-3 select-none ${className}`}>
        <IconGraphic />
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono tracking-[0.35em] text-[#EAC775] font-black block uppercase leading-none mb-1.5">
            KINGS GROUP
          </span>
          <h2 className="text-3.5xl sm:text-4.5xl font-serif text-white font-black tracking-[0.15em] leading-none drop-shadow-md">
            HAVELI
          </h2>
          <span className="text-[9px] sm:text-[11px] font-sans font-bold text-gray-200 mt-2 tracking-widest uppercase block text-center leading-relaxed max-w-xs">
            Multi-Cuisine Restaurant & Banquet Hall
          </span>
        </div>
      </div>
    );
  }

  // Large Board Banner Style (exactly mimicking physical sign board!)
  // Now loads dynamic numbers and address cleanly!
  return (
    <div className={`w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-10 border-4 border-[#EAC775]/50 bg-gradient-to-r from-[#3e0508] via-[#800E14] to-[#3e0508] text-[#FAF6F0] text-center shadow-2xl relative overflow-hidden ${className}`}>
      {/* Glossy shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>

      {/* Symmetrical Header Section for Mobile/Desktop */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4 mb-6">
        
        {/* Left Side: Contacts with Original Logos */}
        <div className="text-left font-mono text-xs sm:text-[13px] text-[#FAF6F0] space-y-1.5 tracking-wider">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.002-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.742.002-2.602-1.005-5.05-2.837-6.883-1.832-1.832-4.274-2.842-6.88-2.843-5.437 0-9.863 4.373-9.867 9.743-.001 1.984.518 3.929 1.502 5.642l-1.007 3.674 3.791-.983zm13.111-5.182c-.22-.11-1.3-.642-1.502-.715-.202-.073-.349-.11-.497.11-.148.22-.57.715-.697.86-.127.146-.255.165-.476.055-.22-.11-.929-.342-1.77-1.092-.653-.582-1.094-1.302-1.222-1.522-.127-.22-.014-.34.097-.449.1-.1.22-.256.33-.385.11-.128.147-.22.22-.366.073-.147.037-.275-.018-.385-.055-.11-.497-1.198-.68-1.642-.179-.434-.356-.375-.497-.382-.128-.006-.275-.008-.421-.008-.147 0-.385.055-.587.275-.203.22-.77.751-.77 1.83 0 1.079.79 2.124.9 2.27.111.147 1.553 2.37 3.763 3.322.525.226.935.362 1.255.463.527.168 1.007.144 1.387.089.424-.062 1.3-.53 1.482-1.042.18-.513.18-.952.127-1.042-.055-.09-.203-.146-.423-.256z" fill="currentColor"/>
              </svg>
            </span>
            <span className="font-extrabold text-[#EAC775]">99850 84847</span>
            <span className="text-[9px] text-[#EAC775]/75 font-mono px-1 border border-[#EAC775]/50 rounded uppercase pb-0.5 ml-1">WhatsApp</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white font-black text-[10px]">
              पे
            </span>
            <span className="font-extrabold text-[#FAF6F0]">70132 20053</span>
            <span className="text-[9px] text-gray-350 font-mono px-1 border border-white/20 rounded uppercase pb-0.5 ml-1">UPI Pay</span>
          </div>
        </div>

        {/* Right Side: Primary Slogan branding with Symmetrical Center Logo Graphic style */}
        <div className="flex items-center gap-2.5 bg-black/35 px-3 py-1.5 rounded-xl border border-white/10 ml-auto sm:ml-0">
          <IconGraphic />
          <div className="text-left font-mono">
            <span className="text-[8px] text-[#EAC775] font-bold block tracking-widest uppercase">ESTD. MARKAPUR</span>
            <span className="text-[11px] text-white font-extrabold block">ROYAL HAVELI CASTLE</span>
          </div>
        </div>

      </div>

      {/* Main Title Banner Group */}
      <div className="space-y-3.5 my-6">
        <h1 className="text-5xl sm:text-7xl font-serif font-black tracking-widest text-[#EAC775] drop-shadow-[0_4px_7px_rgba(0,0,0,0.6)] select-all leading-none">
          HAVELI
        </h1>
        <p className="text-[10px] sm:text-sm font-sans font-bold tracking-[0.3em] text-white uppercase leading-none mt-2">
          Multi-Cuisine Restaurant & Banquet Hall
        </p>
      </div>

      {/* Telugu Regional Translation exactly matching physical billboards */}
      <div className="bg-black/20 py-4 px-6 rounded-2xl border border-white/5 my-6 space-y-1 sm:space-y-2">
        <h2 className="text-4xl sm:text-5xl font-sans font-black text-[#EAC775] tracking-wide select-all leading-relaxed drop-shadow-md">
          హోవేలి
        </h2>
        <p className="text-xs sm:text-sm font-sans font-bold text-gray-300 tracking-wider">
          ఫ్యామిలీ మల్టీ-కుజీన్ రెస్టారెంట్ & ఫంక్షన్ హాల్
        </p>
      </div>

      {/* Symmetrical Lower Banner matching primary address and huge hotline number */}
      <div className="border-t border-white/15 pt-5 mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Address text blocks (Cols: 7) */}
        <div className="md:col-span-7 text-left space-y-1">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#EAC775] block">Location Landmark</span>
          <p className="text-xs sm:text-sm font-sans font-medium text-gray-200 leading-normal">
            Opp. RTC Bus stand, Register Office Line, N.S Nagar, MARKAPUR, AP, PIN 523316
          </p>
        </div>

        {/* Home Delivery Helpline Badge (Cols: 5) */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#ebc05f]/20 to-[#a3791e]/20 p-3.5 rounded-xl border border-[#EAC775]/40 text-left flex items-center justify-between gap-2.5">
          <div>
            <span className="text-[9px] font-mono font-bold text-[#EAC775] uppercase block leading-none mb-1">📞 HOME DELIVERY</span>
            <span className="text-base sm:text-lg font-mono font-extrabold text-white leading-none block tracking-wider">
              7981562535
            </span>
          </div>
          <div className="bg-[#FAF6F0] text-[#800E14] px-2.5 py-1.5 rounded-lg text-[10px] font-sans font-black uppercase text-center flex flex-col justify-center leading-tight">
            <span>HOME</span>
            <span className="text-[8px] tracking-normal font-mono opacity-80">delivery</span>
          </div>
        </div>

      </div>

    </div>
  );
}

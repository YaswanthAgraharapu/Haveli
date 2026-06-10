/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import DashboardView from "./components/DashboardView";
import MenuSection from "./components/MenuSection";
import BookingSystem from "./components/BookingSystem";
import AdminSuite from "./components/AdminSuite";
import BrandLogo from "./components/BrandLogo";
import { GOOGLE_RATING, RESTAURANT_NAME } from "./menuData";
import { UtensilsCrossed, ShieldAlert, Award, Eye, LogOut, Heart, Compass, Sparkles, MapPin, Phone, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "menu" | "booking" | "admin">("dashboard");
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor cursor coordination to feed the spotlight background gradient!
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setCoords({ x, y });
        containerRef.current.style.setProperty("--mouse-x", `${x}px`);
        containerRef.current.style.setProperty("--mouse-y", `${y}px`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleNavigate = (tab: "dashboard" | "menu" | "booking") => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#060608] text-slate-100 font-sans flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black relative overflow-hidden"
    >
      {/* 1. DYNAMIC RADIAL CURSOR FIELD BACKDROP */}
      <div 
        className="absolute inset-0 spotlight-mask pointer-events-none z-0"
        style={{
          transition: "background 0.05s ease"
        }}
      />

      {/* Decorative ambient blurred nodes */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#4A0E1A]/20 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-[#D4AF37]/5 to-transparent blur-[140px] pointer-events-none" />

      {/* 2. GLASS TRANSLUCENT STICKY COMMISSION HEADER */}
      <header className="sticky top-0 z-50 glass-panel border-b border-[#D4AF37]/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-5 relative z-10">
          
          {/* Brand Monogram Redesign */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onClick={() => handleNavigate("dashboard")} 
            className="cursor-pointer hover:opacity-95 transition-all duration-300 shrink-0"
          >
            <BrandLogo variant="horizontal" iconSize="sm" />
          </motion.div>

          {/* Luxury Tab Navigation list */}
          <nav className="flex items-center flex-wrap justify-center gap-1.5 md:gap-3 p-1 rounded-2xl bg-black/45 border border-white/5">
            <button
              onClick={() => handleNavigate("dashboard")}
              className={`relative px-4 py-2 rounded-xl text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 cursor-pointer ${
                activeTab === "dashboard" 
                  ? "bg-gradient-to-r from-[#D4AF37] to-[#A3791E] text-black font-extrabold shadow-[0_4px_12px_rgba(212,175,55,0.3)]" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              🏰 HAVELI SUITE
            </button>

            <button
              onClick={() => handleNavigate("menu")}
              className={`relative px-4 py-2 rounded-xl text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 cursor-pointer ${
                activeTab === "menu" 
                  ? "bg-gradient-to-r from-[#D4AF37] to-[#A3791E] text-black font-extrabold shadow-[0_4px_12px_rgba(212,175,55,0.3)]" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              🍽️ ROYAL MENU
            </button>

            <button
              onClick={() => handleNavigate("booking")}
              className={`relative px-4 py-2 rounded-xl text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 cursor-pointer ${
                activeTab === "booking" 
                  ? "bg-gradient-to-r from-[#D4AF37] to-[#A3791E] text-black font-extrabold shadow-[0_4px_12px_rgba(212,175,55,0.3)]" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              🎫 BOOK SEATS
            </button>

            {/* Separator */}
            <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block"></div>

            {/* Admin trigger */}
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-3 py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 border ${
                activeTab === "admin" 
                  ? "bg-[#7E1C2E] text-white border-red-500/50 shadow-[0_4px_10px_rgba(126,28,46,0.3)]" 
                  : "text-red-400 hover:text-red-300 hover:bg-red-950/20 border-red-900/30"
              }`}
              title="Restricted Staff Operations Panel"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Staff
            </button>
          </nav>

        </div>
      </header>

      {/* 3. COHESIVE ANIMATED WORKSPACE VIEW */}
      <main className="flex-grow relative z-10">
        
        <AnimatePresence mode="wait">
          {/* VIEW 1: HOME PAGE DASHBOARD */}
          {activeTab === "dashboard" && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
            >
              <DashboardView onNavigate={handleNavigate} onAdminClick={() => setActiveTab("admin")} />
            </motion.div>
          )}

          {/* VIEW 2: FOOD MENU */}
          {activeTab === "menu" && (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <MenuSection />
            </motion.div>
          )}

          {/* VIEW 3: BOOKINGS */}
          {activeTab === "booking" && (
            <motion.div 
              key="booking"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <BookingSystem />
            </motion.div>
          )}

          {/* VIEW 4: CODE ADMIN CRITICAL RECOVERY */}
          {activeTab === "admin" && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              <div className="mb-6 flex justify-between items-center glass-panel p-4 rounded-2xl border border-[#D4AF37]/15">
                <span className="text-xs font-mono text-slate-400">Security Gate: <strong className="text-[#D4AF37] font-mono">STAFF SUITE</strong></span>
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className="text-xs font-mono font-bold text-[#D4AF37] hover:text-[#FFF2C2] hover:underline flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> Return to Customer site
                </button>
              </div>
              <AdminSuite />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* 4. SOLID ULTRA-PREMIUM HOSPITALITY FOOTER */}
      <footer className="relative bg-gradient-to-t from-[#060608] to-[#120509] text-gray-400 py-16 border-t border-[#D4AF37]/15 select-none font-sans overflow-hidden">
        {/* Subtle decorative linear reflection */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          
          {/* Brand Columns */}
          <div className="md:col-span-2 space-y-6 text-left">
            <div className="flex items-center gap-3">
              <BrandLogo variant="horizontal" iconSize="sm" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Haveli Banquet Hall And Restaurant represents Markapur's zenith of culinary luxury. From our state-of-the-art gold & royal burgundy acoustics to hand-ground spice reserves, we present fine hospitality comparable with 5-star heritage properties.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-mono">
              <Sparkles className="w-4 h-4" />
              <span>G-Maps Verified Rank:</span>
              <strong className="font-bold underline">{GOOGLE_RATING}</strong>
            </div>
          </div>

          {/* Quick links portal */}
          <div className="text-left space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">Explore Suites</h4>
            <ul className="text-xs space-y-3 font-sans">
              <li>
                <button onClick={() => handleNavigate("dashboard")} className="text-slate-400 hover:text-[#D4AF37] transition duration-300 text-left cursor-pointer flex items-center gap-2">
                  <span>🏰</span> <span>Diner Showcase</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate("menu")} className="text-slate-400 hover:text-[#D4AF37] transition duration-300 text-left cursor-pointer flex items-center gap-2">
                  <span>🍽️</span> <span>Authentic Menu Board</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate("booking")} className="text-slate-400 hover:text-[#D4AF37] transition duration-300 text-left cursor-pointer flex items-center gap-2">
                  <span>🎫</span> <span>VIP Table Booking</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Direct coordinates contacts */}
          <div className="text-left text-xs space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">Helpline Gate</h4>
            <div className="space-y-2 font-mono text-[11px] text-slate-300">
              <p className="flex items-center gap-1.5 text-emerald-400">
                <span>🟢 WhatsApp:</span> <span>+91 99850 84847</span>
              </p>
              <p className="flex items-center gap-1.5 text-slate-200">
                <span>📞 Hotline Table:</span> <span>+91 79815 62535</span>
              </p>
              <p className="flex items-center gap-1.5 text-amber-400">
                <span>🟡 UPI Desk:</span> <span>+91 70132 20053</span>
              </p>
              <p className="text-slate-400 font-sans text-xs pt-1.5 leading-normal">
                📍 Opp. RTC Bus stand, Register Office Line, N.S Nagar, Markapur, Andhra Pradesh 523316.
              </p>
            </div>
          </div>

        </div>

        {/* Outer subcredits bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-900 text-center text-[10px] text-slate-600 font-mono flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Haveli Banquet Hall And Restaurant. Preserved with 5-Star Monarchy Standards.</p>
          <p className="flex items-center gap-1.5 text-slate-500">
            Heritage Creative Direction & Custom Glassmorphic Engineering <Heart className="w-3 h-3 text-[#7E1C2E] fill-[#7E1C2E]" />
          </p>
        </div>
      </footer>

    </div>
  );
}

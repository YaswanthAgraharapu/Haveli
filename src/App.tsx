/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import DashboardView from "./components/DashboardView";
import MenuSection from "./components/MenuSection";
import BookingSystem from "./components/BookingSystem";
import AdminSuite from "./components/AdminSuite";
import BrandLogo from "./components/BrandLogo";
import { GOOGLE_RATING, RESTAURANT_NAME } from "./menuData";
import { UtensilsCrossed, ShieldAlert, Award, Eye, LogOut, Heart } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "menu" | "booking" | "admin">("dashboard");

  const handleNavigate = (tab: "dashboard" | "menu" | "booking") => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-gray-800 font-sans flex flex-col justify-between selection:bg-brand-gold selection:text-brand-wine-dark">
      
      {/* 1. SEAMLESS NAVIGATION HEADER BAR */}
      <header className="sticky top-0 z-40 bg-linear-to-r from-brand-wine-dark via-brand-wine to-brand-wine-dark border-b border-brand-gold/25 shadow-lg select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo Brand Accents */}
          <div 
            onClick={() => handleNavigate("dashboard")} 
            className="cursor-pointer hover:opacity-90 transition shrink-0"
          >
            <BrandLogo variant="horizontal" iconSize="sm" />
          </div>

          {/* Quick Page Jump Links */}
          <nav className="flex items-center flex-wrap gap-1.5 md:gap-2">
            <button
              onClick={() => { handleNavigate("dashboard"); }}
              className={`p-2.5 px-3.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition cursor-pointer ${
                activeTab === "dashboard" ? "bg-brand-gold text-brand-wine-dark shadow-sm font-extrabold" : "text-brand-cream/80 hover:text-white hover:bg-white/5"
              }`}
            >
              🏰 Haveli Dashboard
            </button>
            <button
              onClick={() => { handleNavigate("menu"); }}
              className={`p-2.5 px-3.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition cursor-pointer ${
                activeTab === "menu" ? "bg-brand-gold text-brand-wine-dark shadow-sm font-extrabold" : "text-brand-cream/80 hover:text-white hover:bg-white/5"
              }`}
            >
              🍽️ Food Menu
            </button>
            <button
              onClick={() => { handleNavigate("booking"); }}
              className={`p-2.5 px-3.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition cursor-pointer ${
                activeTab === "booking" ? "bg-brand-gold text-brand-wine-dark shadow-sm font-extrabold" : "text-brand-cream/80 hover:text-white hover:bg-white/5"
              }`}
            >
              🎫 Online Bookings
            </button>
            {/* Owner Suite tab button */}
            <button
              onClick={() => { setActiveTab("admin"); }}
              className={`p-2.5 px-2.5 rounded-xl text-xs font-mono uppercase transition cursor-pointer flex items-center gap-1 ${
                activeTab === "admin" ? "bg-red-700 text-white" : "text-red-400 hover:bg-red-950 border border-red-900/40"
              }`}
              title="Separate Admin Access & Booking Logs"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Admin Login
            </button>
          </nav>

        </div>
      </header>

      {/* 2. DYNAMIC WORKSPACE VIEW */}
      <main className="flex-grow">
        
        {/* VIEW 1: MAIN CUSTOMER LANDING PAGE */}
        {activeTab === "dashboard" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <DashboardView onNavigate={handleNavigate} onAdminClick={() => setActiveTab("admin")} />
          </div>
        )}

        {/* VIEW 2: FOOD MENU SHOWCASE */}
        {activeTab === "menu" && (
          <MenuSection />
        )}

        {/* VIEW 3: ONLINE BOOKING SYSTEM */}
        {activeTab === "booking" && (
          <BookingSystem />
        )}


        {/* VIEW 5: ADMINISTRATIVE ACCESS SUITE (Secure table logs, day-specials settings) */}
        {activeTab === "admin" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl border">
              <span className="text-xs font-mono text-gray-500">Currently viewing: <strong className="text-red-700">Staff Control Panel</strong></span>
              <button 
                onClick={() => setActiveTab("dashboard")}
                className="text-xs font-mono font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> Return to Customer site
              </button>
            </div>
            <AdminSuite />
          </div>
        )}



      </main>

      {/* 3. SOLID HERITAGE FOOTER */}
      <footer className="bg-brand-wine-dark text-brand-cream/80 py-12 border-t border-brand-gold/20 select-none font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand description / rating */}
          <div className="md:col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <BrandLogo variant="horizontal" iconSize="sm" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              Combining grand Royal Mughal aesthetic values with rigorous culinary practices. Built around bespoke dining corners, elegant soundproof architectures, and highway comfort configurations.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-brand-gold font-mono leading-none">
              <span>Google Rank:</span>
              <strong className="font-bold underline">{GOOGLE_RATING}</strong>
            </div>
          </div>

          {/* Quick navigation anchor feeds */}
          <div className="text-left">
            <h4 className="text-xs font-mono uppercase tracking-widest text-brand-gold mb-4">Navigations</h4>
            <ul className="text-xs space-y-2 font-sans">
              <li>
                <button onClick={() => handleNavigate("dashboard")} className="hover:text-white hover:underline transition text-left cursor-pointer">
                  Diner Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate("menu")} className="hover:text-white hover:underline transition text-[#FAF6F0] text-left cursor-pointer">
                  Interactive Menus
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate("booking")} className="hover:text-white hover:underline transition text-[#FAF6F0] text-left cursor-pointer">
                  Book VIP Seats
                </button>
              </li>
            </ul>
          </div>

          {/* Address markers details */}
          <div className="text-left text-xs space-y-1">
            <h4 className="text-xs font-mono uppercase tracking-widest text-brand-gold mb-4">Contact Desk</h4>
            <p className="text-slate-200">🟢 WhatsApp: +91 99850 84847</p>
            <p className="text-slate-200">📞 Call Helpline: +91 79815 62535</p>
            <p className="text-slate-200">🟣 PhonePe / GPay: +91 70132 20053</p>
            <p className="text-slate-300">✉️ Email: reserve@havelibanquets.com</p>
            <p className="text-slate-400 leading-normal mt-2">
              📍 Opp. RTC Bus stand,<br/> Register Office Line, N.S Nagar, Markapur, AP.
            </p>
          </div>

        </div>

        {/* Co-signature credits */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-white/5 text-center text-[11px] text-slate-500 font-mono flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Haveli Banquet Hall And Restaurant. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with royal standards & authentic pride <Heart className="w-3 h-3 text-red-600 fill-red-600" />
          </p>
        </div>
      </footer>

    </div>
  );
}

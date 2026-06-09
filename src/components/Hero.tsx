/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Star, Flame, Ticket, ShieldAlert, Award, ChevronDown } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { DailyDeal } from "./AdminSuite";

export default function Hero({ onBookNowClick, onAdminClick }: { onBookNowClick: () => void; onAdminClick: () => void }) {
  const [deal, setDeal] = useState<DailyDeal>({
    dayOfWeek: "Today",
    offerTitle: "Royal Taste Festival",
    discountRate: "10% OFF on all signature Biryani choices",
    specialRecommendation: "Ulavacharu Chicken Biryani",
    activeAnnouncement: "🏰 Exclusive: Experience the traditional culinary marvel of Haveli Dum Biryani. Priority entry on online booking passes!"
  });
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1000&q=80");

  // Pull deal and image updates live from local storage
  useEffect(() => {
    const loadDeal = () => {
      const saved = localStorage.getItem("haveli_daily_deal");
      if (saved) {
        setDeal(JSON.parse(saved));
      }
      
      const savedPhotos = localStorage.getItem("haveli_gallery_photos");
      if (savedPhotos) {
        try {
          const parsed = JSON.parse(savedPhotos);
          const b = parsed.find((p: any) => p.id === "g2");
          if (b && b.url) {
            setHeroImage(b.url);
          }
        } catch (e) {}
      }
    };
    
    loadDeal();
    // Listening for updates
    window.addEventListener("storage", loadDeal);
    window.addEventListener("haveli_gallery_updated", loadDeal);
    const interval = setInterval(loadDeal, 2500); // Poll as fallback

    return () => {
      window.removeEventListener("storage", loadDeal);
      window.removeEventListener("haveli_gallery_updated", loadDeal);
      clearInterval(interval);
    };
  }, []);

  return (
    <div id="hero_landing_container" className="relative bg-brand-wine-dark overflow-hidden text-white border-b border-brand-gold/20">
      
      {/* 2. LIVE MARQUEE CAMPAIGN ANNOUNCEMENT ANCHORED BY ADMIN */}
      <div className="bg-brand-gold text-brand-wine-dark py-2 px-4 select-none relative z-10 overflow-hidden font-mono text-[11px] font-bold border-b border-brand-gold/30">
        <div className="flex animate-[pulse_3s_infinite] items-center justify-center gap-3 text-center">
          <Flame className="w-4 h-4 text-brand-wine-dark shrink-0 fill-brand-wine-dark animate-bounce" />
          <span className="tracking-wide uppercase">Live Day-Special Announcement:</span>
          <span className="font-sans font-semibold underline decoration-wavy tracking-wide text-[12px]">{deal.activeAnnouncement}</span>
        </div>
      </div>

      {/* Decorative backdrop blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: Heading, Ratings, Action and CTA (Cols: 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Elegant Subheadings with Google Rating Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
              <Award className="w-4 h-4 text-brand-gold" />
              <span className="text-brand-cream font-sans tracking-wide">
                Premium Multi-Cuisine Banquets & Diner
              </span>
              <div className="h-4 w-px bg-white/15"></div>
              <div className="flex items-center gap-1 text-brand-gold">
                <Star className="w-3 h-3 fill-brand-gold" />
                <span className="font-mono font-bold">4.0 rating</span>
              </div>
            </div>

            <div className="space-y-4">
              <BrandLogo variant="horizontal" iconSize="md" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight leading-tight text-white mt-2">
                Savor the Majestic <br className="hidden sm:block"/>
                Heritage of <span className="text-brand-gold underline decoration-brand-gold/30 select-all">Haveli</span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-sans">
              Welcome to <span className="text-white font-semibold">Haveli Restaurant And Banquet Hall</span>. Celebrated as Markapur's center of epicurean luxury, we serve authentic clay-charred tandoor starters, supreme Hyderabadi biryani, and native coastal curries within a state-of-the-art gold & burgundy themed visual space.
            </p>

            {/* Micro details row */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-white/10 py-4 max-w-xl text-xs font-mono">
              <div>
                <dt className="text-gray-400 block uppercase font-bold text-[10px]">Google Rating</dt>
                <dd className="text-brand-gold font-bold text-sm mt-0.5 font-sans">🌟 4.0/5 (383 Reviews)</dd>
              </div>
              <div>
                <dt className="text-gray-400 block uppercase font-bold text-[10px]">Today's Promotion</dt>
                <dd className="text-brand-gold font-bold text-sm mt-0.5 truncate font-sans">{deal.offerTitle}</dd>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onBookNowClick}
                className="flex items-center gap-2 px-7 py-3.5 bg-brand-gold hover:bg-brand-cream text-brand-wine-dark font-mono tracking-widest text-xs uppercase font-bold rounded-xl hover:shadow-lg hover:shadow-brand-gold/25 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <Ticket className="w-4 h-4 fill-brand-wine-dark" /> Book Pass online
              </button>
              
              <a
                href="#menu_showcase_section"
                className="flex items-center gap-1.5 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-sans text-xs tracking-wider uppercase font-semibold rounded-xl active:scale-95 transition-all duration-300"
              >
                Explore Royal Menu <ChevronDown className="w-4 h-4" />
              </a>

              <button
                onClick={onAdminClick}
                className="flex items-center gap-1.5 px-3 py-1 text-[10px] bg-red-950/40 hover:bg-red-950 text-red-400 border border-red-900/50 font-mono uppercase rounded"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Staff Core
              </button>
            </div>

          </div>

          {/* RIGHT: High visual mock showcase with royal plates (Cols: 5) */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative mx-auto max-w-sm sm:max-w-md bg-gradient-to-br from-brand-gold to-brand-gold-dark p-2 rounded-3xl shadow-2xl overflow-hidden aspect-[4/5]">
              <img
                src={heroImage}
                alt="Haveli Dum Biryani"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-2xl brightness-[0.9] saturate-110"
              />
              
              {/* Floating aesthetic tags */}
              <div className="absolute top-4 left-4 bg-brand-wine-dark text-brand-cream p-3 rounded-2xl border border-brand-gold/45 text-xs font-mono shadow-xl shrink-0 flex items-center gap-2 animate-bounce">
                <Flame className="w-4 h-4 text-brand-gold fill-brand-gold" />
                <div>
                  <span className="block font-bold">Mughlai Biryani Special</span>
                  <span className="text-[9px] text-gray-400 font-sans">Traditional Chef's Best</span>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 left-4 bg-black/75 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs">
                <p className="font-serif text-brand-gold font-semibold text-sm mb-1">State-of-the-Art Banquet Setup</p>
                <p className="text-gray-300 leading-normal font-sans text-[11px]">
                  Equipped with crystal chandeliers, soundproof partitions, acoustic panels, and dedicated dressing lounges. Markapur's choice for grand receptions.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

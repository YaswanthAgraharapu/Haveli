/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Star, Flame, Phone, MessageSquare, MapPin, Award, CheckCircle, 
  ArrowRight, UtensilsCrossed, CalendarDays, Camera, Sparkles, Send, 
  Map, ChevronLeft, ChevronRight, RefreshCw, Layers, ShieldCheck, HelpCircle
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { DailyDeal } from "./AdminSuite";
import { GOOGLE_MAPS_URL } from "../menuData";
import { motion, AnimatePresence } from "motion/react";

const DEFAULT_MOMENTS = [
  {
    id: "g1",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&q=80",
    title: "Mughal Imperial Banquet Hall",
    description: "Grand physical celebration layout featuring soundproof acoustic panels, velvet royal seating, and magnificent gold-burgundy floral decor."
  },
  {
    id: "g2",
    url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1000&q=80",
    title: "Signature Dum Biryani Platter",
    description: "Premium long-grain raw pressure basmati, slow-steamed with vintage spices and clarified butter."
  },
  {
    id: "g3",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&q=80",
    title: "Private Royalty Dining Corner",
    description: "Bespoke candlelight dining alcoves framed by wooden heritage carvings and immersive gold accent lamps."
  },
  {
    id: "g4",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80",
    title: "Breathtaking Festive Lights",
    description: "Evening visual layout welcoming high-profile corporate delegates and wedding receptions."
  }
];

interface DashboardViewProps {
  onNavigate: (tab: "dashboard" | "menu" | "booking") => void;
  onAdminClick: () => void;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  feedback: string;
  imageUrl?: string;
  createdAt: string;
}

export default function DashboardView({ onNavigate, onAdminClick }: DashboardViewProps) {
  const [momentsPhotos, setMomentsPhotos] = useState(DEFAULT_MOMENTS);
  const [activeMomentIndex, setActiveMomentIndex] = useState(0);

  // Auto transition for hero slider
  useEffect(() => {
    if (momentsPhotos.length === 0) return;
    const timer = setInterval(() => {
      setActiveMomentIndex((prev) => (prev + 1) % momentsPhotos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [momentsPhotos.length]);

  const [deal, setDeal] = useState<DailyDeal>({
    dayOfWeek: "Today",
    offerTitle: "Royal Taste Festival",
    discountRate: "10% OFF on all signature Biryani choices",
    specialRecommendation: "Ulavacharu Chicken Biryani",
    activeAnnouncement: "🏰 Exclusive: Experience the traditional culinary marvel of Haveli Dum Biryani. Priority entry on online booking passes!"
  });

  const [settings, setSettings] = useState({
    phone1: "99850 84847",
    phone2: "79815 62535",
    phone3: "70132 20053",
    timings: "11:00 AM - 11:00 PM",
    address: "Opp. RTC Bus stand, Register Office Line, N.S Nagar, Markapur, Andhra Pradesh, 523316, IN",
    googleMapsUrl: "https://maps.app.goo.gl/WLeMQ6w6LB3CdikF7",
    restaurantName: "Haveli Banquet Hall And Restaurant"
  });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  
  // Review write states
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewFeedback, setNewReviewFeedback] = useState("");
  const [newReviewImage, setNewReviewImage] = useState("");
  const [newReviewImageName, setNewReviewImageName] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Quick Celebration Event Wizard
  const [wizardEvent, setWizardEvent] = useState("wedding");
  const [wizardGuests, setWizardGuests] = useState(300);

  const loadData = async () => {
    const savedDeal = localStorage.getItem("haveli_daily_deal");
    if (savedDeal) {
      try {
        const parsed = JSON.parse(savedDeal);
        if (parsed && typeof parsed === "object") {
          setDeal({
            dayOfWeek: parsed.dayOfWeek || "Today",
            offerTitle: parsed.offerTitle || "Royal Taste Festival",
            discountRate: parsed.discountRate || "10% OFF on all signature Biryani choices",
            specialRecommendation: parsed.specialRecommendation || "Ulavacharu Chicken Biryani",
            activeAnnouncement: parsed.activeAnnouncement || "🏰 Exclusive: Experience the traditional culinary marvel of Haveli Dum Biryani"
          });
        }
      } catch (e) {
        console.warn("Error parsing deal:", e);
      }
    }

    const savedPhotos = localStorage.getItem("haveli_gallery_photos");
    if (savedPhotos) {
      try {
        const parsed = JSON.parse(savedPhotos);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMomentsPhotos(parsed.map((p: any) => ({
            id: p.id,
            url: p.url || "",
            title: p.title || "Special Experience",
            description: p.description || "Captured live inside Haveli Palace and Grand Dining."
          })));
        } else {
          setMomentsPhotos(DEFAULT_MOMENTS);
        }
      } catch (e) {
        setMomentsPhotos(DEFAULT_MOMENTS);
      }
    } else {
      setMomentsPhotos(DEFAULT_MOMENTS);
    }

    try {
      const sRes = await fetch("/api/settings");
      if (sRes.ok) {
        const sData = await sRes.json();
        if (sData && typeof sData === "object") {
          setSettings({
            phone1: sData.phone1 || "99850 84847",
            phone2: sData.phone2 || "79815 62535",
            phone3: sData.phone3 || "70132 20053",
            timings: sData.timings || "11:00 AM - 11:00 PM",
            address: sData.address || "Opp. RTC Bus stand, Register Office Line, N.S Nagar, Markapur, Andhra Pradesh, 523316, IN",
            googleMapsUrl: sData.googleMapsUrl || "https://maps.app.goo.gl/WLeMQ6w6LB3CdikF7",
            restaurantName: sData.restaurantName || "Haveli Banquet Hall And Restaurant"
          });
        }
      }
    } catch (e) {
      console.warn("Fallback settings active.");
    }

    try {
      const rRes = await fetch("/api/reviews");
      if (rRes.ok) {
        const rData = await rRes.json();
        if (Array.isArray(rData)) {
          setReviews(rData);
        }
      }
    } catch (e) {
      console.warn("Fallback reviews active.");
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData);
    window.addEventListener("haveli_gallery_updated", loadData);
    const interval = setInterval(loadData, 5000);
    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("haveli_gallery_updated", loadData);
      clearInterval(interval);
    };
  }, []);

  const totalHistoricCount = 383;
  const historicRating = 4.0;
  const newReviewsCount = reviews.length;
  const newReviewsSum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
  
  const calculatedRating = parseFloat(
    ((totalHistoricCount * historicRating + newReviewsSum) / (totalHistoricCount + newReviewsCount)).toFixed(1)
  );
  const totalReviewsCount = totalHistoricCount + newReviewsCount;

  // Image Upload handler matching constraints safely
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setReviewError("Image must keep inside 2MB for network optimizations.");
      return;
    }

    setNewReviewImageName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewReviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSuccess(null);
    setReviewError(null);

    if (!newReviewName.trim()) {
      setReviewError("We require your prestigious honor name.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newReviewName.trim(),
          rating: newReviewRating,
          feedback: newReviewFeedback.trim(),
          imageUrl: newReviewImage || undefined
        })
      });

      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
        setNewReviewName("");
        setNewReviewRating(5);
        setNewReviewFeedback("");
        setNewReviewImage("");
        setNewReviewImageName("");
        setReviewSuccess("Your premium review was catalogued successfully!");
        loadData();
      } else {
        setReviewError(data.error || "Review submission blocked.");
      }
    } catch (err) {
      setReviewError("API terminal unreachable.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Safe navigation trigger pushing states into Booking System form fields
  const handleQuickWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("haveli_wizard_preset", JSON.stringify({
      type: "banquet",
      notes: `Planning a majestic ${wizardEvent} with ${wizardGuests} esteemed invites. Please review grand setup options.`
    }));
    onNavigate("booking");
  };

  return (
    <div id="luxury_dashboard" className="space-y-24 pb-16">
      
      {/* ==========================================
          SECTION 1: MASSIVE CINEMATIC GLOSSY HERO
          ========================================== */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] rounded-[40px] overflow-hidden border border-[#D4AF37]/20 flex items-center shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-black">
        {/* Carousel Background with crossfading */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMomentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img 
                src={momentsPhotos[activeMomentIndex]?.url || DEFAULT_MOMENTS[0].url} 
                alt="Luxury Ambience"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-[0.35]"
              />
            </motion.div>
          </AnimatePresence>
          {/* Symmetrical Luxury Gradients covering edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-black/30 to-[#060608]/80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060608]/90 via-transparent to-[#060608]/90 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent pointer-events-none"></div>
        </div>

        {/* Live Promotion Announcement Banner */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-xl text-center">
          <div className="glass-panel text-[11px] font-mono font-bold tracking-[0.2em] text-[#D4AF37] px-4 py-2 rounded-full border border-[#D4AF37]/20 inline-flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="uppercase text-[9px] text-[#FFF2C2]">Live Celebration Offer:</span>
            <span className="text-white normal-case font-sans tracking-wide font-normal">{deal.discountRate}</span>
          </div>
        </div>

        {/* Hero Content Area */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text details */}
          <div className="lg:col-span-7 text-left space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#4A0E1A]/60 to-black/40 border border-[#D4AF37]/30 rounded-full text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase"
            >
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>Markapur's Pinnacle of Fine Monarchy</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl sm:text-6xl font-serif font-black leading-tight tracking-wide text-white"
            >
              Where Legacy Meets <br />
              <span className="gold-gradient-text">Five-Star Splendor</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base text-slate-300 font-sans font-light leading-relaxed max-w-xl"
            >
              Step into <strong className="font-semibold text-white">{settings.restaurantName}</strong>. Merging state-of-the-art 100% soundproof acoustic architecture with royal burgundy and gold aesthetics. We design weddings, banquets, and authentic dining events that stir emotions.
            </motion.p>

            {/* Micro Rating and dynamic maps redirect badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4 flex-wrap text-xs font-mono"
            >
              <div className="glass-panel p-3 px-4 rounded-xl border border-white/5 flex items-center gap-2">
                <div className="flex gap-0.5 text-[#D4AF37]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                  ))}
                </div>
                <span className="text-white tracking-widest text-[11px] font-bold">
                  {calculatedRating} / 5 ({totalReviewsCount} VOTES)
                </span>
              </div>

              <a 
                href={GOOGLE_MAPS_URL}
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-panel p-3 px-5 rounded-xl border border-[#D4AF37]/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] transition duration-300 flex items-center gap-2 cursor-pointer group"
              >
                <MapPin className="w-4 h-4 text-[#D4AF37] group-hover:animate-bounce" />
                <span>Redirect to Maps Location</span>
              </a>
            </motion.div>

            {/* Quick CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4 flex-wrap pt-4"
            >
              <button
                onClick={() => onNavigate("booking")}
                className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#A3791E] hover:from-[#FFF2C2] hover:to-[#D4AF37] text-black font-extrabold uppercase text-xs tracking-widest rounded-xl shadow-[0_10px_30px_rgba(212,175,55,0.25)] transition duration-300 cursor-pointer flex items-center gap-2"
              >
                <span>Book VIP Table</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate("menu")}
                className="px-8 py-4 glass-panel hover:bg-white/5 text-white font-bold uppercase text-xs tracking-widest rounded-xl border border-white/10 transition duration-300 cursor-pointer"
              >
                Explore Royal Taste
              </button>
            </motion.div>
          </div>

          {/* Right Floating Badge Column (5 cols) */}
          <div className="lg:col-span-5 relative flex flex-col justify-center items-center">
            {/* Giant Gold Monogram Icon as Background Watermark */}
            <div className="absolute w-72 h-72 bg-gradient-to-br from-[#D4AF37]/5 to-transparent blur-3xl pointer-events-none" />

            {/* Glass Review Promo Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full glass-panel p-6 rounded-3xl border border-white/10 text-left relative overflow-hidden shadow-2xl space-y-4"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#D4AF37]/5 to-transparent blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.25em] uppercase font-bold">Featured Ambience</span>
                <span className="px-2.5 py-1 text-[8px] font-mono text-emerald-400 bg-emerald-950/40 rounded-md border border-emerald-500/20 uppercase font-bold">Active Space</span>
              </div>

              <div className="aspect-video rounded-2xl overflow-hidden border border-white/5 relative">
                <img 
                  src={momentsPhotos[activeMomentIndex]?.url || DEFAULT_MOMENTS[0].url} 
                  alt="Gallery Highlights"
                  className="w-full h-full object-cover transition-transform duration-[4s]" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <p className="absolute bottom-3 left-3 text-white text-xs font-serif font-bold tracking-wide">
                  {momentsPhotos[activeMomentIndex]?.title || "Haveli Palace"}
                </p>
              </div>

              <p className="text-[11px] text-slate-400 font-sans leading-relaxed line-clamp-2">
                {momentsPhotos[activeMomentIndex]?.description || "Experience grand acoustics and rich culinary delights at Haveli Restaurant."}
              </p>

              {/* Slider steps indicators */}
              <div className="flex items-center gap-1.5 pt-2">
                {momentsPhotos.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveMomentIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === activeMomentIndex ? "w-6 bg-[#D4AF37]" : "w-1.5 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Floating rating badge */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 glass-panel p-4.5 rounded-2xl border border-[#D4AF37]/20 shadow-xl hidden sm:flex items-center gap-3 pre-element text-left"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#4A0E1A] to-stone-950 rounded-xl flex items-center justify-center border border-[#D4AF37]/30 text-[#D4AF37] text-lg font-serif">
                🏰
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase leading-none">VOTED BEST</p>
                <p className="text-xs font-serif font-bold text-white mt-0.5">Celebrations Venue</p>
                <p className="text-[9px] text-slate-400 font-sans mt-0.5">Markapur AP Region</p>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Counter Indicators Grid at footer line */}
        <div className="absolute bottom-0 inset-x-0 glass-panel border-t border-white/5 py-4.5 hidden md:block select-none bg-black/40">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-4 gap-4 text-center">
            <div className="space-y-0.5">
              <span className="text-xl font-serif font-bold tracking-tight text-white gold-gradient-text">50,000+</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 block">Guests Honored</span>
            </div>
            <div className="space-y-0.5 border-l border-white/5">
              <span className="text-xl font-serif font-bold tracking-tight text-white gold-gradient-text">380+</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 block">5-Star Reviews</span>
            </div>
            <div className="space-y-0.5 border-l border-white/5">
              <span className="text-xl font-serif font-bold tracking-tight text-white gold-gradient-text">100%</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 block">Soundproof Acoustic Hall</span>
            </div>
            <div className="space-y-0.5 border-l border-white/5">
              <span className="text-xl font-serif font-bold tracking-tight text-white gold-gradient-text">12+</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 block">Imperial Mughal Spices</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 2: SIGNATURE DINING EXPERIENCE
          ========================================== */}
      <section className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-gradient-to-tr from-[#4A0E1A] to-stone-950 p-1.5 rounded-[32px] border border-[#D4AF37]/20 shadow-[0_15px_35px_rgba(0,0,0,0.8)] overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&q=80" 
            alt="Mughal Diner Experience" 
            className="w-full h-full object-cover rounded-[26px] brightness-90 group-hover:scale-102 transition-transform duration-700" 
          />
          {/* Glass details layer */}
          <div className="absolute bottom-6 inset-x-6 glass-panel p-5 rounded-2xl border border-white/10 text-left">
            <span className="text-[9px] font-mono text-[#D4AF37] tracking-widest uppercase font-bold">Heritage Gastronomy</span>
            <p className="text-sm font-serif font-bold text-white mt-1">Authentic Charcoal Clay Oven Starters</p>
            <p className="text-[11px] text-slate-300 font-sans mt-1">Baked raw at 400°C over burning organic neem tree coal for supreme smoky profiles.</p>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-bold block">Section 02 ━ Culinary Pride</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-bold leading-tight">
              Crafted by Native Chefs, <br />
              <span className="gold-gradient-text">Served with Royal Dignity</span>
            </h2>
          </div>

          <p className="text-sm text-slate-300 font-sans font-light leading-relaxed">
            Our master chefs originate from historical culinary families, utilizing custom spice formulations ground manually each morning. We discard standard food enhancers and seed oils, opting exclusively for cold-pressed brassica oils and pure clarified cream. Savor the authentic taste legacies right here in Markapur.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="glass-panel p-4.5 rounded-2xl border border-white/5 space-y-2">
              <span className="text-base text-[#D4AF37]">🌾</span>
              <h4 className="text-xs font-serif text-white uppercase tracking-wider font-bold">Ulavacharu Secrets</h4>
              <p className="text-[11px] text-slate-400 font-sans">Our signature horse gram cream broth, simmered under slow fire for 16 consecutive hours.</p>
            </div>
            <div className="glass-panel p-4.5 rounded-2xl border border-white/5 space-y-2">
              <span className="text-base text-[#D4AF37]">🍖</span>
              <h4 className="text-xs font-serif text-white uppercase tracking-wider font-bold">Hyderabadi Raw Dum</h4>
              <p className="text-[11px] text-slate-400 font-sans">Meat layers slow-cooked raw under heavy dough seal locks, trapping each aromatic molecule.</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onNavigate("menu")}
              className="py-3 px-6 bg-gradient-to-r from-[#4A0E1A] to-[#7E1C2E] hover:from-[#7E1C2E] hover:to-[#4A0E1A] text-[#D4AF37] border border-[#D4AF37]/35 font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Explore Interactive Menu Cards</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 3: PREMIUM ACOUSTIC BANQUET SHOWCASE
          ========================================== */}
      <section className="relative py-16 text-left">
        {/* Glow behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#4A0E1A]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 space-y-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">Exclusive Events</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white font-bold leading-none">
                Bespoke Celebration Arenas
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-1">Experience state-of-the-art architectures designed purely for high-profile weddings and social feeds.</p>
            </div>
            <button
              onClick={() => onNavigate("booking")}
              className="px-5 py-2.5 bg-black/40 hover:bg-[#D4AF37]/10 text-[#D4AF37] font-mono text-xs font-medium border border-[#D4AF37]/25 rounded-xl transition duration-300 cursor-pointer"
            >
              Request Venue Rates
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gallery card 1 */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 group cursor-pointer shadow-lg relative">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" 
                  alt="Weddings" 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                />
              </div>
              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#D4AF37]">
                  <span>CAPACITY: 500 GUESTS</span>
                  <span>100% SOUNDPROOF</span>
                </div>
                <h3 className="text-base font-serif text-white font-bold group-hover:text-[#D4AF37] transition">Royal Golden Wedding Receptions</h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">Elegant acoustic banquet setting, integrated luxury lighting stages, and premium catering spreads customized to prestige families.</p>
              </div>
            </div>

            {/* Gallery card 2 */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 group cursor-pointer shadow-lg relative">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" 
                  alt="Pre-Weddings" 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                />
              </div>
              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#D4AF37]">
                  <span>CAPACITY: 200 GUESTS</span>
                  <span>CENTRAL CLINICAL AC</span>
                </div>
                <h3 className="text-base font-serif text-white font-bold group-hover:text-[#D4AF37] transition">Sangeet & engagement Rituals</h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">Spacious sound structures optimized for live musical events, traditional high-teas, and intimate family circles.</p>
              </div>
            </div>

            {/* Gallery card 3 */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 group cursor-pointer shadow-lg relative">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80" 
                  alt="Corporate meets" 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                />
              </div>
              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#D4AF37]">
                  <span>CAPACITY: 150 GUESTS</span>
                  <span>SMART PRESENTATION</span>
                </div>
                <h3 className="text-base font-serif text-white font-bold group-hover:text-[#D4AF37] transition">High-Profile Corporate Dinners</h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">Integrated high-definition presentation monitors, custom tea break modules, and clinical cleanliness certifications.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 4: FEATURED TASTE SPOTLIGHT
          ========================================== */}
      <section className="relative max-w-7xl mx-auto px-6 text-left space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono tracking-[0.2em] text-[#D4AF37] uppercase font-bold block">Royal Spotlight</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-bold">Signature Masters Platter</h2>
            <p className="text-xs text-slate-400 font-sans">Our absolute customer favorites. Fresh, authentic, and hand-prepared daily.</p>
          </div>
          <button
            onClick={() => onNavigate("menu")}
            className="px-6 py-3 bg-[#4A0E1A] hover:bg-[#7E1C2E] text-[#D4AF37] text-xs font-mono font-bold tracking-widest uppercase rounded-xl border border-[#D4AF37]/35 transition-all duration-300 cursor-pointer flex items-center gap-2"
          >
            <span>View Full Menu Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Item 1 */}
          <div className="glass-panel p-4 rounded-3xl border border-white/5 space-y-4 group hover:border-[#D4AF37]/30 transition-all duration-300 text-left bg-black/40">
            <div className="aspect-square rounded-2xl overflow-hidden relative border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&q=80" 
                alt="Biryani" 
                className="w-full h-full object-cover group-hover:scale-103 transition duration-500" 
              />
              <span className="absolute top-3 left-3 bg-[#7E1C2E] text-[#D4AF37] border border-[#D4AF37]/30 text-[9px] font-mono font-bold px-2.5 py-1 rounded-md uppercase">BEST SELLER</span>
            </div>
            <div className="space-y-1.5 px-1.5">
              <h4 className="text-sm font-serif font-bold text-white group-hover:text-[#D4AF37] transition">Ulavacharu Mutton Dum Biryani</h4>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed line-clamp-2">Exquisite local Basmati dum, combined with slow-cooked fermented horse-gram gravy broth and melting country meat chunks.</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono text-[#D4AF37]">₹ 310 - 410</span>
                <span className="text-[9px] text-[#22c55e] font-mono tracking-wider font-bold">🟢 VERIFIED TASTE</span>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="glass-panel p-4 rounded-3xl border border-white/5 space-y-4 group hover:border-[#D4AF37]/30 transition-all duration-300 text-left bg-black/40">
            <div className="aspect-square rounded-2xl overflow-hidden relative border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80" 
                alt="Tandoor starter" 
                className="w-full h-full object-cover group-hover:scale-103 transition duration-500" 
              />
              <span className="absolute top-3 left-3 bg-[#4A0E1A] text-[#D4AF37] border border-[#D4AF37]/20 text-[9px] font-mono font-bold px-2.5 py-1 rounded-md uppercase">CHEF MUSTS</span>
            </div>
            <div className="space-y-1.5 px-1.5">
              <h4 className="text-sm font-serif font-bold text-white group-hover:text-[#D4AF37] transition">Clay Charcoal Chicken Tikka</h4>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed line-clamp-2">Crispy skin starters, marinated in rich raw yogurt and hand-pounded Kashmiri chilies, baked directly on burning neem wood charcoal.</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono text-[#D4AF37]">₹ 240</span>
                <span className="text-[9px] text-[#22c55e] font-mono tracking-wider font-bold">🟢 REFINED TRADITION</span>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="glass-panel p-4 rounded-3xl border border-white/5 space-y-4 group hover:border-[#D4AF37]/30 transition-all duration-300 text-left bg-black/40">
            <div className="aspect-square rounded-2xl overflow-hidden relative border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&q=80" 
                alt="paneer" 
                className="w-full h-full object-cover group-hover:scale-103 transition duration-500" 
              />
              <span className="absolute top-3 left-3 bg-[#D4AF37]/20 text-[#FFF2C2] border border-[#D4AF37]/35 text-[9px] font-mono font-bold px-2.5 py-1 rounded-md uppercase">PREMIUM VEG</span>
            </div>
            <div className="space-y-1.5 px-1.5">
              <h4 className="text-sm font-serif font-bold text-white group-hover:text-[#D4AF37] transition">Kaju Cashewnut Paneer Butter</h4>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed line-clamp-2">Delicate cottage cheese blocks bathed in a velvety reduction of tomato concentrate, organic cashew paste and raw butter.</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono text-[#D4AF37]">₹ 220 - 240</span>
                <span className="text-[9px] text-[#22c55e] font-mono tracking-wider font-bold">🟢 VEGETARIAN HARMONY</span>
              </div>
            </div>
          </div>

          {/* Item 4 */}
          <div className="glass-panel p-4 rounded-3xl border border-white/5 space-y-4 group hover:border-[#D4AF37]/30 transition-all duration-300 text-left bg-black/40">
            <div className="aspect-square rounded-2xl overflow-hidden relative border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&q=80" 
                alt="apricot delight" 
                className="w-full h-full object-cover group-hover:scale-103 transition duration-500" 
              />
              <span className="absolute top-3 left-3 bg-[#7E1C2E] text-[#D4AF37] border border-[#D4AF37]/30 text-[9px] font-mono font-bold px-2.5 py-1 rounded-md uppercase font-bold">LEGENDARY dessert</span>
            </div>
            <div className="space-y-1.5 px-1.5">
              <h4 className="text-sm font-serif font-bold text-white group-hover:text-[#D4AF37] transition">Authentic Qubani Ka Meetha</h4>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed line-clamp-2">Dried royal apricot compote slow stewed till rich mahogany amber, topped with pure raw almond kernels and fresh organic cream.</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono text-[#D4AF37]">₹ 140</span>
                <span className="text-[9px] text-[#22c55e] font-mono tracking-wider font-bold">🟢 ROYAL FINALE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 5: GUEST TESTIMONIALS & RATING BOARD
          ========================================== */}
      <section className="relative text-left max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-8">
        
        {/* Left Testimonials list (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono tracking-[0.25em] text-[#D4AF37] uppercase font-bold block">Guest Monologues</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-bold">
              Shared Joys <br />
              <span className="gold-gradient-text">& Authentic Feedbacks</span>
            </h2>
            <p className="text-xs text-slate-400 font-sans">Read verified local reviews synchronised dynamically with our operational registers.</p>
          </div>

          <div className="space-y-4">
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.slice(0, 3).map((item) => (
                  <div key={item.id} className="glass-panel p-6 rounded-3xl border border-white/5 relative shadow-md">
                    <div className="absolute top-6 right-6 flex text-[#D4AF37]">
                      {Array.from({ length: item.rating }).map((_, rIdx) => (
                        <Star key={rIdx} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                      ))}
                    </div>

                    <div className="flex items-start gap-4">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt="Review attachment" 
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 object-cover rounded-xl border border-white/10 shrink-0" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A0E1A] to-stone-900 border border-white/10 flex items-center justify-center text-[#D4AF37] font-semibold text-sm shrink-0">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="space-y-1 text-left">
                        <cite className="not-italic text-sm font-serif font-bold text-white block">{item.name}</cite>
                        <p className="text-[11px] text-slate-400 font-mono">{new Date(item.createdAt).toLocaleDateString()} ━ Community Voter</p>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed pt-2">"{item.feedback}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-10 rounded-3xl border border-white/5 text-center text-slate-400 space-y-2">
                <span>🏰 No supplementary feedback recorded. Add yours below to initiate the chain!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Active Review Form (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-8 rounded-3xl border border-white/10 text-left bg-black/40 space-y-6 shadow-xl relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37]/5 to-transparent blur-xl pointer-events-none" />
          
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-[#D4AF37] tracking-widest uppercase font-bold block">COMMUNITY FEEDBACK</span>
            <h3 className="text-xl font-serif text-white font-bold">Publish your Experience</h3>
            <p className="text-xs text-slate-400 font-sans">Contribution adds star points instantly to our historical Google records tracker.</p>
          </div>

          {reviewSuccess && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl font-medium">
              ✨ {reviewSuccess}
            </div>
          )}

          {reviewError && (
            <div className="p-4 bg-red-950/80 border border-red-500/30 text-red-300 text-xs rounded-xl font-medium">
              ⚠️ {reviewError}
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-[#D4AF37] block mb-1">Your Honorable Name</label>
              <input 
                type="text"
                placeholder="e.g. Ramesh Kumar Markapur"
                required
                value={newReviewName}
                onChange={(e) => setNewReviewName(e.target.value)}
                className="w-full p-3 bg-white/5 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#D4AF37] block mb-1">Star Prestige Rating</label>
              <div className="flex gap-1.5 items-center bg-black/40 p-2.5 rounded-xl border border-slate-800">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReviewRating(star)}
                    className="p-1 cursor-pointer transition transform active:scale-90"
                    title={`Rate ${star} Stars`}
                  >
                    <Star className={`w-6 h-6 ${star <= newReviewRating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-slate-600"}`} />
                  </button>
                ))}
                <span className="text-[11px] font-mono text-slate-400 ml-auto font-bold uppercase">{newReviewRating} STAR HONOR</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#D4AF37] block mb-1">Candid Narrative Feedback</label>
              <textarea 
                rows={3}
                placeholder="Describe food taste, banquet space, or parking convenience..."
                required
                value={newReviewFeedback}
                onChange={(e) => setNewReviewFeedback(e.target.value)}
                className="w-full p-3 bg-white/5 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition font-sans leading-relaxed"
              />
            </div>

            {/* Standard file selector fully styled inside drag-and-drop constraints */}
            <div>
              <label className="text-[10px] font-mono uppercase text-[#D4AF37] block mb-1">Submit Ambience Photo (Optional)</label>
              <div className="relative border border-dashed border-slate-800 hover:border-[#D4AF37]/50 rounded-xl p-4.5 text-center transition cursor-pointer bg-white/5">
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Camera className="w-6 h-6 text-[#D4AF37] mx-auto opacity-75" />
                <p className="text-[11px] text-slate-300 font-bold mt-1.5">
                  {newReviewImageName ? newReviewImageName : "Drape or Select Image"}
                </p>
                <p className="text-[9px] text-slate-500 font-mono">Max size 2MB ━ High conversion ratio format</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="w-full p-3.5 bg-gradient-to-r from-[#4A0E1A] to-[#7E1C2E] hover:from-[#7E1C2E] hover:to-[#4A0E1A] text-[#D4AF37] border border-[#D4AF37]/35 font-extrabold text-xs uppercase tracking-widest rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingReview ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  <span>Configuring Records...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                  <span>Publish Sovereign Feedback</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* ==========================================
          SECTION 6: RESERVATION EXPERIENCE INLINE
          ========================================== */}
      <section className="relative max-w-4xl mx-auto px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A0E1A]/10 to-[#D4AF37]/5 rounded-[32px] blur-3xl pointer-events-none" />
        
        <div className="glass-panel p-8 sm:p-12 rounded-[32px] border border-[#D4AF37]/30 text-center relative overflow-hidden bg-black/60 shadow-2xl space-y-6">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/5 to-transparent blur-2xl pointer-events-none" />
          
          <div className="space-y-2">
            <span className="text-xs font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-bold block">Section 06 ━ Fast Reservations</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-heavy">Initiate Banquet Bookings</h2>
            <p className="text-sm text-slate-300 font-sans max-w-xl mx-auto">
              Ready to claim pricing details and block wedding or special dining slots? Choose function metrics to load our scheduling console instantly.
            </p>
          </div>

          <form onSubmit={handleQuickWizardSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto pt-4">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase font-bold">Function Category</label>
              <select 
                value={wizardEvent} 
                onChange={(e) => setWizardEvent(e.target.value)}
                className="w-full p-3 bg-stone-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              >
                <option value="wedding">Grand Royal Wedding</option>
                <option value="reception">Premium Reception Show</option>
                <option value="engagement">Engagement Rituals</option>
                <option value="anniversary">Pre-Wedding Sangeet</option>
                <option value="corporate">Corporate Gala Assembly</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase font-bold">Estimated Guests</label>
              <select 
                value={wizardGuests} 
                onChange={(e) => setWizardGuests(parseInt(e.target.value))}
                className="w-full p-3 bg-stone-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              >
                <option value="100">Intimate (Up to 100 Guests)</option>
                <option value="300">Generous (100 - 300 Guests)</option>
                <option value="500">Majestic (300 - 500 Guests)</option>
                <option value="1000">Imperial (500 - 1000 Guests)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#A3791E] hover:from-[#FFF2C2] hover:to-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest rounded-xl shadow-[0_5px_15px_rgba(212,175,55,0.2)] transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Initiate Booking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <p className="text-[10px] font-mono text-slate-500 leading-normal pt-4">
            Security advisory: Generous booking variables are saved locally and synced live across cloud firestores dynamically.
          </p>
        </div>
      </section>

    </div>
  );
}

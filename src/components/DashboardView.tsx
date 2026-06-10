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
    url: "/images/image1.jpg",
    fallback: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&q=80",
    title: "Mughal Imperial Banquet Hall",
    description: "Grand physical celebration layout featuring soundproof acoustic panels, velvet royal seating, and magnificent gold-burgundy floral decor."
  },
  {
    id: "g2",
    url: "/images/image2.jpg",
    fallback: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1000&q=80",
    title: "Signature Dum Biryani Platter",
    description: "Premium long-grain raw pressure basmati, slow-steamed with vintage spices and clarified butter."
  },
  {
    id: "g3",
    url: "/images/image3.jpg",
    fallback: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&q=80",
    title: "Private Royalty Dining Corner",
    description: "Bespoke candlelight dining alcoves framed by wooden heritage carvings and immersive gold accent lamps."
  },
  {
    id: "g4",
    url: "/images/image4.jpg",
    fallback: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80",
    title: "Breathtaking Festive Lights",
    description: "Evening visual layout welcoming high-profile corporate delegates and wedding receptions."
  },
  {
    id: "g5",
    url: "/images/image5.jpg",
    fallback: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=1000&q=80",
    title: "Gourmet Table Reception",
    description: "Immersive tablescapes dressed with traditional royal brass cutlery and organic petal aesthetics."
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const urlPath = target.src;
    const matched = DEFAULT_MOMENTS.find(m => urlPath.endsWith(m.url) || urlPath === m.url);
    if (matched?.fallback) {
      target.src = matched.fallback;
    }
  };

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
                onError={handleImageError}
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
                <span>Book Table Reservation</span>
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
                  onError={handleImageError}
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
      <section className="relative max-w-4xl mx-auto px-6 text-center space-y-6 py-4">
        <div className="space-y-4">
          <span className="text-xs font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-bold block">Culinary Pride</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white font-bold leading-tight">
            Crafted by Native Chefs, <br />
            <span className="gold-gradient-text">Served with Royal Dignity</span>
          </h2>
        </div>

        <p className="text-sm text-slate-300 font-sans font-light leading-relaxed max-w-2xl mx-auto">
          Our master chefs originate from historical culinary families, utilizing custom spice formulations ground manually each morning. We discard standard food enhancers and seed oils, opting exclusively for cold-pressed brassica oils and pure clarified cream. Savor the authentic taste legacies right here in Markapur.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-2xl mx-auto text-left">
          <div className="glass-panel p-4.5 rounded-2xl border border-white/5 space-y-2 bg-stone-950/20">
            <span className="text-base text-[#D4AF37]">🌾</span>
            <h4 className="text-xs font-serif text-white uppercase tracking-wider font-bold">Ulavacharu Secrets</h4>
            <p className="text-[11px] text-slate-400 font-sans">Our signature horse gram cream broth, simmered under slow fire for 16 consecutive hours.</p>
          </div>
          <div className="glass-panel p-4.5 rounded-2xl border border-white/5 space-y-2 bg-stone-950/20">
            <span className="text-base text-[#D4AF37]">🍖</span>
            <h4 className="text-xs font-serif text-white uppercase tracking-wider font-bold">Hyderabadi Raw Dum</h4>
            <p className="text-[11px] text-slate-400 font-sans">Meat layers slow-cooked raw under heavy dough seal locks, trapping each aromatic molecule.</p>
          </div>
        </div>

        <div className="pt-4 flex justify-center">
          <button
            onClick={() => onNavigate("menu")}
            className="py-3 px-6 bg-gradient-to-r from-[#4A0E1A] to-[#7E1C2E] hover:from-[#7E1C2E] hover:to-[#4A0E1A] text-[#D4AF37] border border-[#D4AF37]/35 font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md animate-pulse"
          >
            <span>Explore Interactive Menu Cards</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>
      </section>

      {/* ==========================================
          SECTION 5: GUEST TESTIMONIALS & RATING BOARD
          ========================================== */}
      <section className="relative text-left max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-8 font-sans">
        
        {/* Left Testimonials list (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono tracking-[0.25em] text-[#D4AF37] uppercase font-bold block">Guest Monologues</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-bold">
              Shared Joys & <br />
              <span className="gold-gradient-text">Google Maps Feedbacks</span>
            </h2>
            <p className="text-xs text-slate-400 font-sans">Read verified authentic reviews on Google Maps directly synchronized with our operations.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                id: "gr1",
                name: "Ravi Teja Bandla",
                time: "2 weeks ago",
                rating: 5,
                feedback: "The best banquet hall in Markapur without a doubt! Very spacious, premium acoustic damping, and authentic Mughal starters. The staff treated us with extreme royal hospitality.",
                initials: "RT"
              },
              {
                id: "gr2",
                name: "Dr. Lakshmi Prasad",
                time: "1 month ago",
                rating: 5,
                feedback: "We hosted our engagement reception ceremony here at Haveli. Outstanding central air conditioning and magnificent gold lighting. The Hyderabadi Raw Dum Biryani is incredibly flavorful and authentic.",
                initials: "LP"
              },
              {
                id: "gr3",
                name: "Anil Kumar Yadav",
                time: "3 months ago",
                rating: 5,
                feedback: "Mouth-watering Ulavacharu soup and slow-steamed starters. Extremely hygienic and luxurious premium family environment. Clean washrooms and abundant vehicle parking spaces.",
                initials: "AY"
              }
            ].map((item) => (
              <div key={item.id} className="glass-panel p-6 rounded-3xl border border-white/5 relative shadow-md bg-stone-950/20">
                <div className="absolute top-6 right-6 flex items-center gap-1">
                  <span className="text-[10px] font-mono text-[#D4AF37] tracking-wider uppercase bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Google Verified
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A0E1A] to-[#1e1416] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold text-sm shrink-0">
                    {item.initials}
                  </div>

                  <div className="space-y-1 text-left">
                    <cite className="not-italic text-sm font-serif font-bold text-white block">{item.name}</cite>
                    <div className="flex text-[#D4AF37] py-1">
                      {Array.from({ length: item.rating }).map((_, rIdx) => (
                        <Star key={rIdx} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">{item.time} ━ Local Guide</p>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed pt-2">"{item.feedback}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <a 
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#D4AF37] hover:text-[#FFF2C2] hover:underline"
            >
              <span>Read more verified reviews on Google Maps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Active Review Form (5 cols) - NOW REDIRECT TO GOOGLE MAPS CARD */}
        <div className="lg:col-span-5 glass-panel p-8 rounded-3xl border border-[#D4AF37]/35 text-center bg-black/60 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent blur-xl pointer-events-none" />
          
          <div className="mx-auto w-16 h-16 rounded-full bg-slate-900 border border-[#D4AF37]/35 flex items-center justify-center text-3xl">
            📍
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.25em] uppercase font-bold block">GOOGLE MAPS PLATFORM</span>
            <h3 className="text-xl font-serif text-white font-heavy">Redirect Review Pathway</h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              We have partnered directly with Google reviews. Direct client-side local submissions are now fully routed to our official Google Maps profile.
            </p>
          </div>

          <div className="p-4 bg-amber-950/20 border border-[#D4AF37]/20 rounded-2xl text-left space-y-1.5">
            <p className="text-[10px] font-mono font-extrabold text-[#D4AF37] uppercase flex items-center gap-1.5">
              <span>🌟</span> WHY SHARE ON GOOGLE MAPS?
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Google reviews are permanent, verified, and immensely support our local Andhra culinary heritage group to thrive.
            </p>
          </div>

          <div className="pt-2">
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center p-4 bg-[#800E14] hover:bg-[#800E14]/90 text-[#EAC775] font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(128,14,20,0.4)] hover:scale-[1.01]"
            >
              Share Review on Google Maps
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Star, Flame, Phone, MessageSquare, MapPin, Award, CheckCircle, Smartphone, ArrowRight, UtensilsCrossed, CalendarDays, Camera, Sparkles, Send, Map, ChevronLeft, ChevronRight } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { DailyDeal } from "./AdminSuite";

const DEFAULT_MOMENTS = [
  {
    id: "g1",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    title: "Haveli Grand Royal Banquet Table",
    description: "A breathtaking perspective of our long dining hall table setting, fully adorned with pristine plateware and framed by majestic warm-glowing brick-pillar architectures."
  },
  {
    id: "g2",
    url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80",
    title: "Signature Chicken Dum Biryani Platter",
    description: "A luscious high-angle platter layout showcasing steaming bowls of our premium, authentic long-grain aromatic Chicken Dum Biryani cooked under traditional raw pressure."
  },
  {
    id: "g3",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    title: "Mandala Heritage Dining Corner",
    description: "An exquisite private seating nook backed by our magnificent, yellow-gold handcrafted floral mandala wood carving and warm historic ambient spotlighting."
  },
  {
    id: "g4",
    url: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=800&q=80",
    title: "Real Guest Celebrations & Family Feasts",
    description: "Candid moments of our beloved guests sharing joyous stories and celebrating high-quality traditional meals together at our spacious royal banquet tables."
  },
  {
    id: "g5",
    url: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&q=80",
    title: "Our Professional Stewards & Serving Team",
    description: "Meet our smart, courteous, and professionally trained hospitality waiters who stand ready with high pride to serve your family a memorable dining feast."
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
  // Moments from owner gallery running live
  const [momentsPhotos, setMomentsPhotos] = useState(DEFAULT_MOMENTS);

  // State for active moment in the promo ad slideshow
  const [activeMomentIndex, setActiveMomentIndex] = useState(0);

  // Auto motion (slideshow) transition effect
  useEffect(() => {
    if (momentsPhotos.length === 0) return;
    const timer = setInterval(() => {
      setActiveMomentIndex((prev) => (prev + 1) % momentsPhotos.length);
    }, 4500); // changes every 4.5 seconds
    return () => clearInterval(timer);
  }, [momentsPhotos.length]);

  const [deal, setDeal] = useState<DailyDeal>({
    dayOfWeek: "Today",
    offerTitle: "Royal Taste Festival",
    discountRate: "10% OFF on all signature Biryani choices",
    specialRecommendation: "Ulavacharu Chicken Biryani",
    activeAnnouncement: "🏰 Exclusive: Experience the traditional culinary marvel of Haveli Dum Biryani. Priority entry on online booking passes!"
  });

  // Dynamic system settings loaded live from server db.json (falls back dynamically)
  const [settings, setSettings] = useState({
    phone1: "99850 84847",
    phone2: "79815 62535",
    phone3: "70132 20053",
    timings: "11:00 AM - 11:00 PM",
    address: "Opp. RTC Bus stand, Register Office Line, N.S Nagar, Markapur, Andhra Pradesh, 523316, IN",
    googleMapsUrl: "https://www.google.com/maps/place/Haveli+Banquet+Hall+And+Restaurant/@15.7336518,79.2661507,17z",
    restaurantName: "Haveli Restaurant And Banquet Hall"
  });

  const [featuredImage, setFeaturedImage] = useState("https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1000&q=80");

  // Customer reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Review form states
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewFeedback, setNewReviewFeedback] = useState("");
  const [newReviewImage, setNewReviewImage] = useState("");
  const [newReviewImageName, setNewReviewImageName] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Load and poll server live
  const loadData = async () => {
    // 1. Fetch live daily deals from localStorage (standard across app)
    const savedDeal = localStorage.getItem("haveli_daily_deal");
    if (savedDeal) {
      setDeal(JSON.parse(savedDeal));
    }

    // 2. Load and refresh featured gallery image and moments slideshow photos
    const savedPhotos = localStorage.getItem("haveli_gallery_photos");
    if (savedPhotos) {
      try {
        const parsed = JSON.parse(savedPhotos);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMomentsPhotos(parsed.map((p: any) => ({
            id: p.id,
            url: p.url || "",
            title: p.title || "Customer Special Experience",
            description: p.description || "A candid moment of happiness captured live inside Haveli Restaurant and Banquet Hall."
          })));
        } else {
          setMomentsPhotos(DEFAULT_MOMENTS);
        }
        const b = parsed.find((p: any) => p.id === "g2");
        if (b && b.url) {
          setFeaturedImage(b.url);
        }
      } catch (e) {
        setMomentsPhotos(DEFAULT_MOMENTS);
      }
    } else {
      setMomentsPhotos(DEFAULT_MOMENTS);
    }

    // 3. Fetch live settings from backend server
    try {
      const sRes = await fetch("/api/settings");
      if (sRes.ok) {
        const sData = await sRes.json();
        setSettings(sData);
      }
    } catch (e) {
      console.warn("Fallback settings active.");
    }

    // 4. Fetch live customer reviews from backend server
    try {
      const rRes = await fetch("/api/reviews");
      if (rRes.ok) {
        const rData = await rRes.json();
        setReviews(rData);
      }
    } catch (e) {
      console.warn("Fallback reviews active.");
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData);
    window.addEventListener("haveli_gallery_updated", loadData);
    const interval = setInterval(loadData, 3000); // Polling every 3s for perfect cloud synchro!

    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("haveli_gallery_updated", loadData);
      clearInterval(interval);
    };
  }, []);

  // Compute weighted live rating (Historic weighted average of 383 reviews at 4.0, combined with dynamic reviews)
  const totalHistoricCount = 383;
  const historicRating = 4.0;
  const newReviewsCount = reviews.length;
  const newReviewsSum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
  
  const calculatedRating = parseFloat(
    ((totalHistoricCount * historicRating + newReviewsSum) / (totalHistoricCount + newReviewsCount)).toFixed(1)
  );
  const totalReviewsCount = totalHistoricCount + newReviewsCount;

  // Handle local file selection -> read as base64 data URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setReviewError("Image size must be smaller than 2MB.");
      return;
    }

    setNewReviewImageName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewReviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit modern rating and image review directly to website
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSuccess(null);
    setReviewError(null);

    if (!newReviewName.trim()) {
      setReviewError("Please provide your name.");
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
        setReviewSuccess("Review submitted! Thank you for contributing maps-style media and real-time rating points!");
        loadData();
      } else {
        setReviewError(data.error || "Could not publish your review.");
      }
    } catch (err) {
      setReviewError("Server communication failed.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div id="dashboard_view" className="space-y-10 animate-fade-in pb-12">
      
      {/* 1. TOP LIVE OFFERS CAMPAIGN ALERT MARQUEE */}
      <div className="bg-[#800E14] text-[#EAC775] py-3 px-4 select-none rounded-2xl font-mono text-[11px] font-bold border-b-2 border-[#EAC775]/30 shadow-lg">
        <div className="flex animate-[pulse_3.5s_infinite] items-center justify-center gap-3 text-center flex-wrap">
          <Flame className="w-5 h-5 text-[#EAC775] shrink-0 fill-[#EAC775] animate-bounce" />
          <span className="tracking-widest uppercase text-[10px]">LIVE CAMPAIGNS & ANNOUNCEMENTS:</span>
          <span className="font-sans font-semibold decoration-amber-500 tracking-wide text-[12px] text-white">
            {deal.activeAnnouncement}
          </span>
        </div>
      </div>

      {/* 2. ABOUT HAVELI & WELCOME BANNER BOARD */}
      <div className="bg-gradient-to-br from-[#3e0508] via-[#800E14] to-[#3e0508] rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-[#EAC775]/30 relative overflow-hidden text-white">
        {/* Aesthetic background mesh blobs */}
        <div className="absolute top-[-50px] right-[-50px] w-72 h-72 bg-[#EAC775]/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-50px] left-[-30px] w-64 h-64 bg-[#EAC775]/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Brand Presentation Columns (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 border border-white/10 text-xs text-brand-gold flex-wrap">
              <Award className="w-4 h-4 text-[#EAC775] shrink-0" />
              <span className="text-white font-sans tracking-wide">
                Premium Multi-Cuisine Dining & Banquets
              </span>
              <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
              <div className="flex items-center gap-1 text-[#EAC775]">
                <Star className="w-3.5 h-3.5 fill-[#EAC775]" />
                <span className="font-mono font-bold text-[11px]">{calculatedRating} Rating ({totalReviewsCount} Reviews)</span>
              </div>
              <div className="h-4 w-px bg-white/20"></div>
              <a 
                href="https://maps.app.goo.gl/RphkTuJU2HMz9HeV6" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-bold hover:underline"
                title="View Restaurant on Google Maps"
              >
                <Map className="w-3.5 h-3.5 animate-pulse" />
                <span>Google Maps</span>
              </a>
            </div>

            <div className="space-y-2">
              <BrandLogo variant="horizontal" iconSize="md" />
              <div className="text-lg text-[#EAC775]/90 font-serif italic mt-1.5 font-medium tracking-wide">
                హవేలి ఫ్యామిలీ రెస్టారెంట్ & ఫంక్షన్ హాల్
              </div>
              <h1 className="text-2xl sm:text-4.5xl font-serif tracking-tight leading-tight text-white mt-1">
                A Grand Heritage of Epicurean <br /> Luxury of Markapur
              </h1>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-sans max-w-xl">
              At <span className="text-[#EAC775] font-bold">{settings.restaurantName}</span>, traditional culinary formulas meet bespoke hospitality standards. Indulge in authentic clay-charred tandoor appetizers, royal Hyderabadi biryani formulations, and rich coastal spices served within our beautifully designed burgundy and gold themed spaces.
            </p>

            <div className="pt-3 border-t border-white/10 max-w-lg mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-brand-gold font-mono">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 align-top shrink-0 text-[#EAC775]" />
                <span className="leading-snug text-slate-300 font-sans">
                  📍 {settings.address}
                </span>
              </div>
              <a 
                href="https://maps.app.goo.gl/RphkTuJU2HMz9HeV6" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#EAC775] hover:bg-white text-[#800E14] hover:text-[#0b1528] rounded-xl font-bold font-sans text-xs shadow-md transition-all sm:shrink-0 whitespace-nowrap active:scale-[0.98]"
              >
                <Map className="w-4 h-4" /> Navigate on Google Maps
              </a>
            </div>
          </div>

          {/* Right Plate customer photos slider running in black-and-white (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between mt-4 lg:mt-0 animate-fade-in">
            {/* Header displaying Moments label in elegant italic display */}
            <div className="flex items-center justify-between mb-2 px-1 select-none">
              <span className="font-serif italic text-2xl text-[#EAC775] tracking-widest lowercase block">
                *moments*
              </span>
              <span className="text-[9px] font-mono uppercase text-slate-400 font-bold tracking-widest">
                by happy customers
              </span>
            </div>

            {/* Main Interactive Black-and-White Crop Box */}
            <div className="aspect-[4/3] bg-gradient-to-br from-[#EAC775] to-[#9E761E] p-1 rounded-3xl shadow-lg relative overflow-hidden group">
              {momentsPhotos.length > 0 && (
                <>
                  <img
                    src={momentsPhotos[activeMomentIndex]?.url || DEFAULT_MOMENTS[0].url}
                    alt={momentsPhotos[activeMomentIndex]?.title || DEFAULT_MOMENTS[0].title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain bg-[#0c1528] rounded-2xl grayscale transition-all duration-700 ease-in-out brightness-90 group-hover:brightness-100"
                  />
                  
                  {/* Back / Previous navigation button */}
                  <button 
                    onClick={() => setActiveMomentIndex((prev) => (prev === 0 ? momentsPhotos.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#800E14]/85 hover:bg-[#800E14] text-[#EAC775] border border-[#EAC775]/40 flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105 shadow-md group/btn cursor-pointer z-10"
                    title="Back / Previous Moment"
                  >
                    <ChevronLeft className="w-5 h-5 transition-transform group-hover/btn:-translate-x-0.5" />
                  </button>

                  {/* Front / Next navigation button */}
                  <button 
                    onClick={() => setActiveMomentIndex((prev) => (prev === momentsPhotos.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#800E14]/85 hover:bg-[#800E14] text-[#EAC775] border border-[#EAC775]/40 flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105 shadow-md group/btn cursor-pointer z-10"
                    title="Front / Next Moment"
                  >
                    <ChevronRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-0.5" />
                  </button>

                  {/* Overlay Label */}
                  <div className="absolute top-4 left-4 bg-[#800E14]/90 backdrop-blur-md text-[#EAC775] text-[10px] uppercase font-mono font-bold tracking-widest px-3 py-1.5 rounded-lg border border-[#EAC775]/30 shadow-md flex items-center gap-1.5 select-none">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#EAC775] animate-ping"></span>
                    <span>{momentsPhotos[activeMomentIndex]?.title || "Haveli Moments"}</span>
                  </div>

                  {/* Text caption overlay describing diner experiences */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-5 pt-12 text-left rounded-b-2xl">
                    <span className="text-[9px] font-mono text-[#EAC775] tracking-widest uppercase block mb-1 font-semibold leading-none">
                      Diner Story #{activeMomentIndex + 1}
                    </span>
                    <p className="text-[11px] text-zinc-200 font-sans leading-relaxed line-clamp-2">
                      {momentsPhotos[activeMomentIndex]?.description || momentsPhotos[activeMomentIndex]?.description || ""}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Side-by-Side cropped photo indicators in a box for quick overview */}
            <div className="grid grid-cols-5 gap-2 mt-3 select-none">
              {momentsPhotos.map((item, index) => (
                <button
                  key={item.id || index}
                  onClick={() => setActiveMomentIndex(index)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 transform active:scale-95 cursor-pointer ${
                    index === activeMomentIndex 
                      ? "border-[#EAC775] scale-102 shadow-md ring-2 ring-[#EAC775]/25" 
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  title={item.title || `View Moment #${index + 1}`}
                >
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale brightness-95" 
                  />
                  {/* Overlay small helper counter inside the cropped box */}
                  <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                    <span className={`text-[10px] font-mono font-black ${
                      index === activeMomentIndex ? "text-[#EAC775] text-xs" : "text-white"
                    }`}>
                      #{index + 1}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION PORTAL CARD DRIVERS - CHOOSE TO EXPLORE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Drive Card 1: Interactive Menu (High CTA focus) */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 flex flex-col justify-between hover:border-[#EAC775]/65 hover:shadow-xl transition-all duration-300 text-left group">
          <div>
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-5 group-hover:scale-110 transition">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-serif font-black text-gray-900 group-hover:text-[#800E14] transition">
              Rich Food Menu & Prices
            </h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Explore our traditional culinary listings with exact corrected pricing, categorizations, and popular recommendations from Chef's special.
            </p>
            {/* Offer micro banner */}
            <div className="mt-4 p-2.5 bg-brand-gold/10 inline-block rounded-lg border border-[#EAC775]/20 text-[#800E14] font-mono text-[10px] font-bold">
              🔥 SPECIAL DEALS: {deal.offerTitle} ({deal.discountRate})
            </div>
          </div>
          <button 
            onClick={() => onNavigate("menu")}
            className="mt-6 flex items-center justify-center gap-1.5 w-full py-3 bg-[#0b1528] hover:bg-[#EAC775] text-white hover:text-brand-wine-dark text-xs uppercase tracking-wider font-bold rounded-xl shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            Explore Menu & Prices <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Drive Card 2: Home Delivery Details (CALL & REGISTER focus) */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 flex flex-col justify-between hover:border-[#128C7E]/40 hover:shadow-xl transition-all duration-300 text-left group">
          <div>
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-5 group-hover:scale-110 transition">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-lg font-serif font-black text-gray-900">
              🏡 Home Delivery Calling
            </h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Order warm traditional basmati biryanis, authentic starters, curries, and drinks directly to your home steps in Markapur region.
            </p>
            {/* Call Instructions list */}
            <ul className="mt-4 space-y-1.5 text-[11px] font-sans text-gray-600">
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                <span>Call and Register your address: <strong className="text-gray-900 font-bold">{settings.phone2}</strong></span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Pre-pay instantly using PhonePe / GPay numbers.</span>
              </li>
            </ul>
          </div>
          <a
            href={`tel:+91${settings.phone2.replace(/\s+/g, '')}`}
            className="mt-6 flex items-center justify-center gap-1.5 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-bold rounded-xl shadow-xs hover:shadow-md transition-all duration-300"
          >
            📞 Call & Order: {settings.phone2}
          </a>
        </div>

        {/* Drive Card 3: Online Passes/Booking system */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 flex flex-col justify-between hover:border-brand-gold/65 hover:shadow-xl transition-all duration-300 text-left group">
          <div>
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-5 group-hover:scale-110 transition">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-serif font-black text-gray-900">
              🎫 Table & Banquet Passes
            </h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Need reserved seats, priority dining corner entry, or planning a soundproof banquet hall event? Generate a digital entry pass online instantly!
            </p>
            {/* Realtime database status */}
            <div className="mt-4 p-2 bg-purple-50 inline-block lg:block rounded-lg border border-purple-100/50 text-[10px] text-purple-800 font-mono">
              ⚡ LIVE ACCESS: Interfacing Firestore Cloud Database
            </div>
          </div>
          <button 
            onClick={() => onNavigate("booking")}
            className="mt-6 flex items-center justify-center gap-1.5 w-full py-3 bg-[#0b1528] hover:bg-[#EAC775] text-white hover:text-brand-wine-dark text-xs uppercase tracking-wider font-bold rounded-xl shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            Reserve Table Online <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 4. SOLID HOME DELIVERY PRE-PAY EXPRESSWAYS & INFO */}
      <div className="bg-amber-50/70 rounded-3xl p-6 sm:p-8 border border-[#EAC775]/25 text-left grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left Callout column */}
        <div className="md:col-span-4 space-y-3">
          <div className="bg-[#800E14] text-[#EAC775] inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider">
            ⚡ Direct Dispatch
          </div>
          <h2 className="text-2xl font-serif font-black text-[#800E14] tracking-tight leading-snug">
            Express Home Delivery Desk
          </h2>
          <p className="text-xs text-gray-600 font-sans leading-relaxed">
            Fresh recipes cooked with absolute hygiene and dispatched right inside Markapur in hot case carriers.
          </p>
          
          <div className="flex flex-col gap-1.5 pt-1.5">
            <span className="text-[11px] font-mono font-bold text-gray-500 uppercase block">Registered Phone Lines</span>
            <div className="text-[#0d1c31] font-serif font-bold text-2xl leading-none tracking-tight">
              +91 {settings.phone2}
            </div>
          </div>
        </div>

        {/* Center UPI Credentials Column */}
        <div className="md:col-span-4 bg-white p-5 rounded-2xl border border-[#EAC775]/25 shadow-sm space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-[#EAC775]" />
            <span>Official UPI Pre-Pay Details</span>
          </h3>
          
          <div className="space-y-3 text-xs">
            {/* PhonePe Info */}
            <div className="flex items-center justify-between p-2.5 bg-purple-50/60 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2">
                <span className="bg-[#5f259f] text-white font-black text-[9px] p-1.5 py-1 rounded font-mono leading-none">PhonePe</span>
                <span className="font-mono text-[11px] font-bold text-gray-800">{settings.phone3}</span>
              </div>
              <span className="text-[9px] font-mono text-purple-700 font-bold uppercase">Pre-Payments</span>
            </div>

            {/* Google Pay / WhatsApp Info */}
            <div className="flex items-center justify-between p-2.5 bg-green-50/50 rounded-xl border border-green-100">
              <div className="flex items-center gap-2">
                <span className="bg-[#25D366] text-white font-black text-[9px] p-1.5 py-1 rounded font-mono leading-none">WhatsApp</span>
                <span className="font-mono text-[11px] font-bold text-gray-800">{settings.phone1}</span>
              </div>
              <span className="text-[9px] font-mono text-green-700 font-bold uppercase">Order Registers</span>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 font-sans leading-snug">
            💡 For complete trust audit records, any transaction executed during active delivery dispatch coordinates will reflect instantly in the administrative audit logs!
          </p>
        </div>

        {/* Right CTA column */}
        <div className="md:col-span-4 space-y-3 h-full flex flex-col justify-center">
          <a
            href={`tel:+91${settings.phone2.replace(/\s+/g, '')}`}
            className="flex items-center justify-center gap-1.5 w-full py-3.5 bg-[#800E14] hover:bg-[#800E14]/85 text-white text-xs uppercase tracking-widest font-bold rounded-xl shadow-md active:scale-95 transition-all text-center"
          >
            📞 Call Delivery ({settings.phone2.split(' ')[0]})
          </a>
          
          <a
            href={`https://wa.me/91${settings.phone1.replace(/\s+/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs uppercase tracking-widest font-bold rounded-xl shadow-md active:scale-95 transition-all text-center"
          >
            <MessageSquare className="w-4 h-4 fill-white text-transparent shrink-0" /> WhatsApp Register
          </a>
        </div>

      </div>

      {/* 5. ⭐ MAPS-STYLE CUSTOMER REVIEWS & RATINGS UPLOAD SECTION */}
      <div id="reviews_section" className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8 text-left space-y-8">
        
        {/* Review header summary with maps layout */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-mono text-[10px] uppercase font-bold tracking-wider">
              ⭐ Google Maps & Local Reviews
            </span>
            <h2 className="text-2xl font-serif text-slate-900 font-black mt-1.5">
              Customer Feedbacks & Food Photos
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Submit your experience, real ratings, and attach pictures of any aspect ratio below.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-center shrink-0">
              <span className="text-3.5xl font-mono font-black text-[#800E14] leading-none block">
                {calculatedRating}
              </span>
              <span className="text-[10px] text-gray-400 font-sans tracking-wide block mt-1">out of 5.0</span>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div>
              <div className="flex items-center text-amber-500 gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`w-4 h-4 ${s <= Math.round(calculatedRating) ? "fill-amber-500" : "text-gray-300"}`} 
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-800 mt-1">{totalReviewsCount} Customer Reviews verified</p>
            </div>
          </div>
        </div>

        {/* Form to submit review with optional aspect ratio image upload */}
        <form onSubmit={handleReviewSubmit} className="bg-gradient-to-br from-slate-50/50 to-slate-100/50 p-5 rounded-2.5xl border border-slate-200/60 text-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-slate-900">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="font-serif font-bold text-base">Write a Review & Add Live Photos</h3>
          </div>

          {reviewSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-xl font-medium">
              ✅ {reviewSuccess}
            </div>
          )}
          {reviewError && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 text-xs rounded-xl font-medium">
              ⚠️ {reviewError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reviewer Name */}
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-500 font-bold block mb-1">Your Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                required
                value={newReviewName}
                onChange={(e) => setNewReviewName(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:border-[#800E14] focus:outline-none focus:ring-1 focus:ring-[#800E14]"
              />
            </div>

            {/* Star selector */}
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-500 font-bold block mb-1">Star Rating <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-1.5 py-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReviewRating(star)}
                    className="cursor-pointer transition-transform duration-200 hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= newReviewRating ? "text-amber-500 fill-amber-500" : "text-slate-300"}`}
                    />
                  </button>
                ))}
                <span className="text-xs font-mono font-bold text-gray-500 ml-2">({newReviewRating} / 5)</span>
              </div>
            </div>
          </div>

          {/* Feedback (optional) */}
          <div>
            <label className="text-[10px] font-mono uppercase text-gray-500 font-bold block mb-1">Feedback Comments <span className="text-gray-400 font-normal">(Optional)</span></label>
            <textarea
              placeholder="Tell other food-lovers about the food taste, prices, cleanliness, and environment..."
              rows={3}
              value={newReviewFeedback}
              onChange={(e) => setNewReviewFeedback(e.target.value)}
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:border-[#800E14] focus:outline-none focus:ring-1 focus:ring-[#800E14]"
            />
          </div>

          {/* Aspect-ratio image attachment */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase text-gray-500 font-bold block mb-1">Attach Food or Seating Photos <span className="text-gray-400 font-normal">(Optional, any aspect ratio)</span></label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 p-2.5 px-4 bg-[#800E14]/10 border border-[#800E14]/25 hover:bg-[#800E14]/15 rounded-lg text-xs font-bold text-[#800E14] cursor-pointer transition">
                <Camera className="w-4 h-4 text-[#800E14]" />
                <span>Choose Media File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {newReviewImageName && (
                <span className="text-xs font-mono text-gray-500 bg-gray-100 p-1.5 px-3 rounded-md max-w-xs truncate border">
                  📎 {newReviewImageName}
                </span>
              )}
            </div>

            {newReviewImage && (
              <div className="mt-3.5 max-w-sm rounded-xl overflow-hidden border p-1 bg-white inline-block">
                <span className="text-[9px] font-mono text-gray-400 block px-1.5 mb-1">Image Aspect Ratio Confirmed</span>
                <img
                  src={newReviewImage}
                  alt="Review attachment preview"
                  referrerPolicy="no-referrer"
                  className="max-h-[160px] w-auto max-w-full rounded-lg object-contain bg-slate-50 border"
                />
              </div>
            )}
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={isSubmittingReview}
            className="px-5 py-2.5 bg-[#800E14] hover:bg-[#800E14]/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center justify-center gap-1.5 disabled:opacity-55 cursor-pointer"
          >
            {isSubmittingReview ? (
              <span>Publishing Review...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Live Review</span>
              </>
            )}
          </button>
        </form>

        {/* Separated Ratings Sections based on user feedback layout instructions */}
        <div className="space-y-8 pt-2">
          
          {/* Section A: Spacious Photo-Based Experiences */}
          {reviews.filter(rev => rev.imageUrl).length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#800E14] flex items-center gap-1.5 border-b pb-2">
                📸 Customer Food & Venue Photos (Spacious Gallery)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
                {reviews.filter(rev => rev.imageUrl).map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-3xl border border-[#EAC775]/35 p-6 flex flex-col justify-between hover:shadow-lg hover:border-[#EAC775] transition-all duration-350 text-left relative shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                        <span className="font-serif font-black text-sm text-slate-900">{rev.name}</span>
                        <span className="text-[10px] font-mono text-gray-400">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center text-amber-500 gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-4 h-4 ${s <= rev.rating ? "fill-amber-500 text-amber-500" : "text-gray-200"}`} 
                          />
                        ))}
                      </div>

                      {rev.feedback && (
                        <p className="text-xs text-slate-650 leading-relaxed font-sans italic mb-4">
                          "{rev.feedback}"
                        </p>
                      )}

                      {/* Spacious Google Maps styled customers food uploads */}
                      <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-1.5 shadow-xs">
                        <img
                          src={rev.imageUrl}
                          alt="Customer food upload"
                          referrerPolicy="no-referrer"
                          className="max-w-full h-auto max-h-[240px] object-contain rounded-xl hover:scale-103 transition duration-300"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section B: Compact Text-Only Ratings (No Image) */}
          {reviews.filter(rev => !rev.imageUrl).length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b pb-2">
                💬 Verbal Ratings & Feedbacks (Compact Feed)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
                {reviews.filter(rev => !rev.imageUrl).map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-slate-50/70 rounded-xl border border-slate-150 p-3 hover:bg-white transition-all duration-200 text-left"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-sans font-bold text-[11px] text-gray-800 truncate block max-w-[80px]" title={rev.name}>
                        {rev.name}
                      </span>
                      <span className="text-[8px] font-mono text-gray-400 shrink-0">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center text-amber-500 gap-0.5 mb-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`w-2.5 h-2.5 ${s <= rev.rating ? "fill-amber-500 text-amber-500" : "text-gray-200"}`} 
                        />
                      ))}
                    </div>

                    {rev.feedback ? (
                      <p className="text-[10px] text-gray-550 leading-snug font-sans italic line-clamp-2" title={rev.feedback}>
                        "{rev.feedback}"
                      </p>
                    ) : (
                      <span className="text-[9px] text-gray-450 italic font-mono uppercase tracking-wider">Rating Only</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 6. QUICK BRAND STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
        <div className="bg-slate-100 p-4 rounded-2xl text-center border shadow-xs">
          <span className="text-[9px] font-mono text-gray-500 uppercase block">Overall Rating</span>
          <span className="text-xl font-serif text-[#800E14] font-black mt-1 block">⭐ {calculatedRating} Stars</span>
        </div>
        <div className="bg-slate-100 p-4 rounded-2xl text-center border shadow-xs">
          <span className="text-[9px] font-mono text-gray-500 uppercase block">Region Priority</span>
          <span className="text-xl font-serif text-[#800E14] font-black mt-1 block">🏡 Markapur</span>
        </div>
        <div className="bg-slate-100 p-4 rounded-2xl text-center border shadow-xs">
          <span className="text-[9px] font-mono text-gray-500 uppercase block">Active Deal Promotion</span>
          <span className="text-xl font-serif text-[#800E14] font-black mt-1 block truncate">🔥 {deal.offerTitle}</span>
        </div>
        <div className="bg-slate-100 p-4 rounded-2xl text-center border shadow-xs">
          <span className="text-[9px] font-mono text-gray-500 uppercase block">Restaurant Timings</span>
          <span className="text-xs font-serif text-[#800E14] font-black mt-1.5 block leading-normal">{settings.timings}</span>
        </div>
      </div>

    </div>
  );
}

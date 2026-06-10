/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Gift, CalendarDays, CheckCircle, Trash2, Calendar, Clock, 
  Users, HelpCircle, PhoneCall, Sparkles, Navigation, Send,
  BookmarkCheck, PlusCircle, ShieldCheck, Mail, ArrowRight, Printer, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface Booking {
  code: string;
  type: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  timeSlot: string;
  guestsCount: number;
  notes: string;
  address?: string;
  orderDishes?: string;
  paymentOption?: string;
  createdAt: string;
  status: string;
}

export default function BookingSystem() {
  const [bookingType, setBookingType] = useState<"dining" | "banquet" | "delivery">("dining");
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [receipt, setReceipt] = useState<Booking | null>(null);
  const [errorWord, setErrorWord] = useState<string | null>(null);
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Core Form parameters aligned with high-end customer values
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    timeSlot: "12:30 PM - Lunch Peak",
    guestsCount: 2,
    notes: "",
    address: "",
    orderDishes: ""
  });

  const fetchBookings = async () => {
    // Priority 1: Pull from the persistent REST server
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setActiveBookings(data);
          return;
        }
      }
    } catch (err) {
      console.warn("Express reservations server silent. Utilizing physical client cache.");
    }

    // Priority 2: Standard fast local caching fallback
    const local = localStorage.getItem("haveli_bookings");
    if (local) {
      try {
        setActiveBookings(JSON.parse(local));
      } catch (e) {
        setActiveBookings([]);
      }
    }
  };

  useEffect(() => {
    fetchBookings();
    
    // Check if hero wizard or dashboard wizard has preset details loaded
    const wizardPreset = localStorage.getItem("haveli_wizard_preset");
    if (wizardPreset) {
      try {
        const parsed = JSON.parse(wizardPreset);
        if (parsed.type === "banquet") {
          setBookingType("banquet");
          setFormData(prev => ({
            ...prev,
            guestsCount: 150,
            notes: parsed.notes || ""
          }));
        }
        localStorage.removeItem("haveli_wizard_preset");
      } catch (e) {
        // Safe skip
      }
    }

    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const saveLog = async (logMsg: string) => {
    const logItem = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      details: logMsg,
      category: "Booking System"
    };

    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logItem)
      });
    } catch (e) {
      // Fallback
    }

    const prevLogsStr = localStorage.getItem("haveli_admin_logs") || "[]";
    try {
      const prevLogs = JSON.parse(prevLogsStr);
      localStorage.setItem("haveli_admin_logs", JSON.stringify([logItem, ...prevLogs]));
    } catch (e) {}
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuestsSlider = (val: number) => {
    setFormData(prev => ({
      ...prev,
      guestsCount: val
    }));
  };

  const getWhatsAppMessageText = (b: Booking) => {
    let msg = `*HAVELI BANQUETS & RESERVATION DIRECTIVE*\n`;
    msg += `----------------------------------------\n`;
    msg += `Greetings! I have successfully generated a luxury system reservation pass on the Haveli Monarchy web module. Please review active parameters:\n\n`;
    msg += `👑 *Guest Name:* ${b.name}\n`;
    msg += `💳 *Pass Code:* \`${b.code}\`\n`;
    msg += `📅 *Target Date:* ${b.date}\n`;
    msg += `⏰ *Time Slot:* ${b.timeSlot}\n`;
    
    if (b.type === "delivery") {
      msg += `📍 *Delivery Address:* ${b.address}\n`;
      msg += `🍽️ *Dishes Listed:* ${b.orderDishes}\n`;
    } else {
      msg += `👥 *Estimated Cover Count:* ${b.guestsCount} Invitation seats\n`;
    }
    
    msg += `📝 *Soverign directives:* ${b.notes || "None"}\n\n`;
    msg += `Please acknowledge with a five-star stamp approval and release current tariff details. Thank you!`;
    return encodeURIComponent(msg);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorWord(null);

    // Dynamic Validations
    if (!formData.name.trim()) {
      return setErrorWord("We require your honorable guest name.");
    }
    if (!formData.phone.trim()) {
      return setErrorWord("Mobile hotline is vital for VIP seat confirmation.");
    }
    if (!formData.date) {
      return setErrorWord("Please pick a grand calendar target date.");
    }

    let reservationCode = "";
    let newBooking: Booking;
    let logoMessage = "";

    if (bookingType === "delivery") {
      if (!formData.address.trim()) {
        return setErrorWord("Doorstep delivery address in Markapur is required.");
      }
      if (!formData.orderDishes.trim()) {
        return setErrorWord("Please state which gourmet dishes/items you desire.");
      }
      reservationCode = `HV-DL-${Math.floor(100000 + Math.random() * 900000)}`;
      
      newBooking = {
        code: reservationCode,
        type: "delivery",
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || "N/A",
        date: formData.date,
        timeSlot: formData.timeSlot,
        guestsCount: 0,
        address: formData.address.trim(),
        orderDishes: formData.orderDishes.trim(),
        paymentOption: "Pay on Delivery (Cash/UPI)",
        notes: formData.notes.trim() || "None",
        createdAt: new Date().toISOString(),
        status: "Confirmed"
      };

      logoMessage = `New Doorstep Delivery Dispatched: Code ${reservationCode} for ${formData.name}. Value: [${formData.orderDishes}].`;
    } else {
      const guestsLimit = bookingType === "dining" ? 20 : 600;
      const guestsMin = bookingType === "dining" ? 1 : 25;

      if (formData.guestsCount < guestsMin) {
        return setErrorWord(`For luxury Banquet Hall spaces, we require a minimum attendance of ${guestsMin} invitations.`);
      }

      reservationCode = `HV-${bookingType === "dining" ? "DT" : "BH"}-${Math.floor(100000 + Math.random() * 900000)}`;
      
      newBooking = {
        code: reservationCode,
        type: bookingType,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || "N/A",
        date: formData.date,
        timeSlot: formData.timeSlot,
        guestsCount: formData.guestsCount,
        notes: formData.notes.trim() || "None",
        createdAt: new Date().toISOString(),
        status: "Confirmed"
      };

      logoMessage = `New VIP Reservation registered. Code ${reservationCode} under name ${formData.name} for ${formData.guestsCount} seats on ${formData.date}.`;
    }

    // Server-side logging integration
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooking)
      });
    } catch (err) {
      console.warn("Server side bookings database unready, persisting locally inside client caches.");
    }

    const updatedBookings = [newBooking, ...activeBookings];
    setActiveBookings(updatedBookings);
    localStorage.setItem("haveli_bookings", JSON.stringify(updatedBookings));

    saveLog(logoMessage);
    setReceipt(newBooking);
    
    // Trigger majestic overlay success reveal
    setSuccessAnimation(true);

    // Reset Form Fields cleanly
    setFormData({
      name: "",
      phone: "",
      email: "",
      date: "",
      timeSlot: bookingType === "delivery" ? "Immediate (30-45 mins)" : "12:30 PM - Lunch Peak",
      guestsCount: bookingType === "dining" ? 2 : 50,
      notes: "",
      address: "",
      orderDishes: ""
    });
  };

  const cancelBooking = async (code: string) => {
    if (!confirm("Are you sure you wish to dissolve this royal pass? Checkpoints will be flushed.")) return;
    
    const filtered = activeBookings.filter(b => b.code !== code);
    setActiveBookings(filtered);
    localStorage.setItem("haveli_bookings", JSON.stringify(filtered));
    saveLog(`VIP Reservation Revoked: Code ${code}.`);
    
    if (receipt?.code === code) {
      setReceipt(null);
    }
  };

  return (
    <div id="booking_dashboard" className="py-20 text-left relative overflow-hidden">
      
      {/* Background radial spotlights */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#4A0E1A]/10 rounded-full blur-[125px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 space-y-12 relative z-10">
        
        {/* Architectural Header */}
        <div className="border-b border-white/5 pb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#4A0E1A]/60 to-stone-900 border border-[#D4AF37]/20 rounded-full text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase">
            <Gift className="w-4 h-4 text-[#D4AF37]" />
            <span>VIP Priority Access Gate</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-black tracking-wide leading-tight">
            Seat & Hall Reservation Lounge
          </h2>
          <p className="text-xs text-slate-400 font-sans max-w-2xl leading-relaxed">
            Organize pristine wedding displays inside our sound-isolated gold banquet chambers, lock in candlelit private suite booths, or queue instant luxury basmati deliveries locally in Markapur.
          </p>
        </div>

        {/* Master Booking Frame Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Booking Interface Form (7 Columns) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-10 rounded-[32px] border border-white/10 shadow-2xl relative bg-black/45 space-y-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D4AF37]/5 to-transparent blur-2xl pointer-events-none" />
            
            {/* Elegant luxury Category Switch tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-black/60 p-2.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setBookingType("dining");
                  setFormData(prev => ({ ...prev, guestsCount: 2, timeSlot: "12:30 PM - Lunch Peak" }));
                }}
                className={`py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest font-extrabold transition duration-300 cursor-pointer ${
                  bookingType === "dining" 
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#A3791E] text-black shadow-md" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                🍽️ Table Dine-In
              </button>

              <button
                type="button"
                onClick={() => {
                  setBookingType("banquet");
                  setFormData(prev => ({ ...prev, guestsCount: 150, timeSlot: "Supreme Evening Muhurtham (04:00 PM - 11:30 PM)" }));
                }}
                className={`py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest font-extrabold transition duration-300 cursor-pointer ${
                  bookingType === "banquet" 
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#A3791E] text-black shadow-md" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                🏰 Banquet Palace
              </button>

              <button
                type="button"
                onClick={() => {
                  setBookingType("delivery");
                  setFormData(prev => ({ ...prev, guestsCount: 0, timeSlot: "Immediate (30-45 mins)" }));
                }}
                className={`py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest font-extrabold transition duration-300 cursor-pointer ${
                  bookingType === "delivery" 
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#A3791E] text-black shadow-md" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                🚗 Delivery (COD)
              </button>
            </div>

            {/* Error Indicators */}
            {errorWord && (
              <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorWord}</span>
              </div>
            )}

            {/* Core input segments */}
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#D4AF37] block mb-1">Honorable Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Anand Satya Markapur"
                    required
                    className="w-full text-xs sm:text-sm p-3.5 bg-white/5 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition font-sans"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#D4AF37] block mb-1">Mobile Hotline Contact *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 99850 84847"
                    required
                    className="w-full text-xs sm:text-sm p-3.5 bg-white/5 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#D4AF37] block mb-1">Email Coordinator Receipt</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. client@gmail.com (Optional)"
                    className="w-full text-xs sm:text-sm p-3.5 bg-white/5 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition font-sans"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#D4AF37] block mb-1">
                    {bookingType === "delivery" ? "Arrival Date *" : "Target Celebration Date *"}
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full text-xs sm:text-sm p-3.5 bg-white/5 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition font-sans text-stone-300"
                  />
                </div>
              </div>

              {/* Time Slot and Guests Selection fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#D4AF37] block mb-1">Preferred Time Coordinate Slot</label>
                  <input
                    type="text"
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    list="time-elements-list"
                    placeholder="Click or type e.g. 07:30 PM, Lunch Peak"
                    required
                    className="w-full text-xs sm:text-sm p-3.5 bg-white/5 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition font-sans"
                  />
                  <datalist id="time-elements-list">
                    {bookingType === "delivery" ? (
                      <>
                        <option value="Immediate (30-45 mins)" />
                        <option value="12:30 PM - Lunch Peak" />
                        <option value="02:00 PM" />
                        <option value="07:30 PM - Dinner Session" />
                        <option value="09:00 PM" />
                      </>
                    ) : bookingType === "dining" ? (
                      <>
                        <option value="12:00 PM - Lunch Session" />
                        <option value="12:30 PM - Lunch Peak" />
                        <option value="01:30 PM" />
                        <option value="07:00 PM - Dinner Session Starters" />
                        <option value="08:00 PM - Prime Hour" />
                        <option value="09:30 PM" />
                      </>
                    ) : (
                      <>
                        <option value="Morning Reception (07:00 AM - 02:00 PM)" />
                        <option value="Supreme Evening Muhurtham (04:00 PM - 11:30 PM)" />
                        <option value="All-Day Imperial Celebration (24 Hours Custom)" />
                      </>
                    )}
                  </datalist>
                </div>

                <div>
                  {bookingType === "delivery" ? (
                    <div>
                      <label className="text-[10px] font-mono uppercase text-[#D4AF37] block mb-1">Tariff Collection Method</label>
                      <span className="w-full text-xs p-3.5 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-emerald-400 font-mono inline-flex items-center gap-1.5 font-bold">
                        🟢 PAY ON DELIVERY (CASH / INSTANT UPI)
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-mono uppercase text-[#D4AF37]">Seat / Invitation Scale</label>
                        <span className="text-[11px] font-mono text-black font-extrabold bg-[#D4AF37] px-2 py-0.5 rounded-md">
                          {formData.guestsCount} Invites / Covers
                        </span>
                      </div>
                      <div className="pt-1.5">
                        <input
                          type="range"
                          min={bookingType === "dining" ? 1 : 25}
                          max={bookingType === "dining" ? 20 : 600}
                          step={bookingType === "dining" ? 1 : 10}
                          value={formData.guestsCount}
                          onChange={(e) => handleGuestsSlider(Number(e.target.value))}
                          className="w-full accent-[#D4AF37] h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                          <span>{bookingType === "dining" ? "1 Table Min" : "25 Invites Min"}</span>
                          <span>{bookingType === "dining" ? "20 Cover Max" : "600 VIP Seats Max"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery coordinates fields */}
              {bookingType === "delivery" && (
                <div className="space-y-4 border-t border-slate-800 pt-5 mt-5">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-[#D4AF37] block mb-1">Candid Doorstep Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. Register Office Line, Ward 12, Markapur AP"
                      required
                      className="w-full text-xs sm:text-sm p-3.5 bg-white/5 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-[#D4AF37] block mb-1">Dishes & Packs List *</label>
                    <textarea
                      name="orderDishes"
                      rows={2}
                      value={formData.orderDishes}
                      onChange={handleInputChange}
                      placeholder="e.g. 2 Family Pack Mutton Dum Biryani, 1 Chicken Tikka, 3 Butter Naan..."
                      required
                      className="w-full text-xs sm:text-sm p-3.5 bg-white/5 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition font-sans leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Special Directives */}
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Chef Directives & Accompanying Demands</label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder={
                    bookingType === "delivery"
                      ? "Custom routing landmarks or contactless direct instructions..."
                      : bookingType === "dining"
                        ? "List children highchair requirements, raw spice limits, or special birthday lighting requests..."
                        : "Describe decoration theme split (Mughal Royal / Vintage White), pure veg catering setups, stage layout, etc..."
                  }
                  className="w-full text-xs sm:text-sm p-3.5 bg-white/5 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition font-sans leading-relaxed"
                />
              </div>

              {/* Submit CTA button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#A3791E] hover:from-[#FFF2C2] hover:to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition duration-300 shadow-[0_5px_20px_rgba(212,175,55,0.2)] cursor-pointer"
              >
                {bookingType === "delivery" 
                  ? "🚗 Generate Delivery Dispatch Link (Pay on Doorstep)" 
                  : `🔒 lock In Royal ${bookingType === "dining" ? "Table Unit" : "Grand Palace Chambers"}`}
              </button>

            </form>

          </div>

          {/* Right Sidebar Receipts & History Tracker (5 Columns) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Voucher popup on successful submit */}
            <AnimatePresence>
              {receipt && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8 sm:p-10 rounded-[35px] border-2 border-[#D4AF37] bg-gradient-to-b from-[#23040A] to-black text-[#FAF6F0] shadow-[0_15px_40px_rgba(0,0,0,0.85)] relative overflow-hidden"
                >
                  {/* Voucher design circles cuts */}
                  <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-[#060608] rounded-full border-r border-[#D4AF37] z-10" />
                  <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-[#060608] rounded-full border-l border-[#D4AF37] z-10" />
                  
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#FFF2C2] via-[#D4AF37] to-[#FFF2C2]" />

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[8px] font-mono font-bold tracking-[0.25em] text-[#D4AF37] uppercase bg-black/55 px-3 py-1.5 rounded-lg border border-[#D4AF37]/20 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                      <span>Sovereign Pass Issued</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">STATUS: CONFIRMED</span>
                  </div>

                  <div className="space-y-6 text-left">
                    <div className="border-b border-white/5 pb-4.5">
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">Client Coordinator Name</span>
                      <cite className="not-italic text-lg font-serif font-black text-white block mt-1">{receipt.name}</cite>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pb-4.5 border-b border-white/5 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Pass Ticket Code</span>
                        <span className="text-[#D4AF37] font-semibold text-sm tracking-widest block mt-0.5">{receipt.code}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Service Type</span>
                        <span className="text-white text-xs font-bold block mt-0.5 uppercase">
                          {receipt.type === "dining" ? "🍽️ DINE VIP" : receipt.type === "banquet" ? "🏰 Palace Hall" : "🚗 Delivery pack"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pb-4.5 border-b border-white/5 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Calendar Date</span>
                        <span className="text-white block mt-0.5">{receipt.date}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Arrival Slot</span>
                        <span className="text-white block text-xs truncate mt-0.5">{receipt.timeSlot}</span>
                      </div>
                    </div>

                    {receipt.type !== "delivery" ? (
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-400 font-sans">Sovereign Cover Count:</span>
                        <span className="text-[#D4AF37] font-bold text-sm bg-[#4A0E1A] px-3 py-1.5 rounded-lg">
                          {receipt.guestsCount} Invitation seats
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3.5 text-xs font-sans">
                        <div className="bg-white/5 p-3 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-[9px] font-mono text-[#D4AF37] uppercase block font-bold leading-none">DOORSTEP DELIVERY LOCATION:</span>
                          <span className="text-[#FAF6F0] block leading-relaxed text-xs">{receipt.address}</span>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-[9px] font-mono text-[#D4AF37] uppercase block font-bold leading-none">ORDER PACK HIGHLIGHTS:</span>
                          <span className="text-[#FAF6F0] block leading-relaxed text-xs">{receipt.orderDishes}</span>
                        </div>
                      </div>
                    )}

                    <div className="bg-black/60 p-3.5 rounded-xl border border-slate-800/80 text-[10px] font-mono text-slate-400 italic">
                      Special directives: "{receipt.notes}"
                    </div>

                    {/* Dynamic Action items */}
                    <div className="pt-4 flex flex-col sm:flex-row gap-2.5">
                      <a
                        href={`https://wa.me/919985084847?text=${getWhatsAppMessageText(receipt)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-black font-sans font-extrabold text-xs uppercase tracking-wider rounded-xl text-center shadow-lg transition duration-200 flex items-center justify-center gap-2"
                      >
                        <span>🟢 Confirm on WhatsApp</span>
                      </a>
                      <button
                        onClick={() => window.print()}
                        className="p-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-slate-800 cursor-pointer text-xs font-mono font-semibold flex items-center justify-center gap-1.5"
                      >
                        <Printer className="w-4 h-4" /> Print pass
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* active bookings list view (frosted list structure) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">Preserved Local Sessions ({activeBookings.length})</h4>
                <span className="text-[10px] text-slate-500 font-mono">Live synchronization online</span>
              </div>

              {activeBookings.length > 0 ? (
                <div className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
                  {activeBookings.map((b) => (
                    <div 
                      key={b.code} 
                      className="glass-panel p-4.5 rounded-2xl border border-slate-800 space-y-3 relative text-left bg-black/35 hover:border-white/10 transition-colors"
                    >
                      <button
                        onClick={() => cancelBooking(b.code)}
                        className="absolute top-4.5 right-4.5 p-2 bg-red-950/20 hover:bg-red-950 text-red-400 hover:text-white rounded-lg border border-red-900/30 transition-colors cursor-pointer"
                        title="Cancel this Reservation Code"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-1 max-w-[85%]">
                        <cite className="not-italic text-sm font-serif font-bold text-white block truncate">{b.name}</cite>
                        <div className="flex items-center flex-wrap gap-2 text-[10px] font-mono text-slate-400 mt-1">
                          <span className="text-[#D4AF37] font-semibold">{b.code}</span>
                          <span>|</span>
                          <span className="uppercase text-[9px]">{b.type === "dining" ? "🍽️ Dining" : b.type === "banquet" ? "🏰 Banquet" : "🚗 Delivery"}</span>
                          <span>|</span>
                          <span>{b.date}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-900/80 pt-2 text-left">
                        <span>Arrival Slot: <strong className="text-slate-300 font-normal">{b.timeSlot}</strong></span>
                        {b.type !== "delivery" && <span>{b.guestsCount} Invites</span>}
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center text-slate-500 text-xs font-mono">
                  No active reservation vouchers logged in current browser session cache. Set up coordinates to log one!
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

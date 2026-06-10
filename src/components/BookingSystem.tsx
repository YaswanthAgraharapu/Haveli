/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Calendar, Clock, Users, Gift, CheckCircle, Trash2, Ticket, Sparkles, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface Booking {
  code: string;
  type: "dining" | "banquet" | "delivery";
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
  status: "Confirmed" | "Pending Approval" | "Completed" | "Out for Delivery";
}

export default function BookingSystem() {
  const [bookingType, setBookingType] = useState<"dining" | "banquet" | "delivery">("dining");
  const [restaurantHours, setRestaurantHours] = useState("11:00 AM - 11:00 PM");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    timeSlot: "12:30 PM - Lunch",
    guestsCount: 2,
    notes: "",
    address: "",
    orderDishes: ""
  });
  
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [receipt, setReceipt] = useState<Booking | null>(null);
  const [errorWord, setErrorWord] = useState<string | null>(null);
  
  // Operational dynamic settings loaded live to pull owner's customized WhatsApp number
  const [settings, setSettings] = useState({
    phone1: "99850 84847",
    phone2: "79815 62535",
    phone3: "70132 20053",
    timings: "11:00 AM - 11:00 PM",
    address: "Opp. RTC Bus stand, Register Office Line, N.S Nagar, Markapur, Andhra Pradesh, 523316, IN",
    googleMapsUrl: "https://maps.app.goo.gl/WLeMQ6w6LB3CdikF7",
    restaurantName: "Haveli Banquet Hall And Restaurant"
  });

  const getWhatsAppMessageText = (b: Booking) => {
    const divider = "==========================";
    if (b.type === "delivery") {
      return `🏰 *New Delivery Order - Haveli* 🏰\n${divider}\n*Code:* ${b.code}\n*Name:* ${b.name}\n*Phone:* ${b.phone || 'N/A'}\n*Date:* ${b.date}\n*Arrival Slot:* ${b.timeSlot}\n*Address:* ${b.address || 'N/A'}\n*Dishes:* ${b.orderDishes || 'N/A'}\n*Notes:* ${b.notes || 'None'}\n${divider}\nPlease confirm and deploy this delivery order! Thank you.`;
    } else if (b.type === "dining") {
      return `🏰 *New Dine-In Table Booking* 🏰\n${divider}\n*Code:* ${b.code}\n*Name:* ${b.name}\n*Phone:* ${b.phone || 'N/A'}\n*Date:* ${b.date}\n*Time Slot:* ${b.timeSlot}\n*Guests:* ${b.guestsCount} Persons\n*Notes:* ${b.notes || 'None'}\n${divider}\nPlease block the premium table slots. Thank you.`;
    } else {
      return `🏰 *New Banquet Hall Booking* 🏰\n${divider}\n*Code:* ${b.code}\n*Name:* ${b.name}\n*Phone:* ${b.phone || 'N/A'}\n*Date:* ${b.date}\n*Time Slot:* ${b.timeSlot}\n*Estimated Invites:* ${b.guestsCount} guests\n*Notes:* ${b.notes || 'None'}\n${divider}\nPlease evaluate and record this catering event! Thank you.`;
    }
  };

  const getWhatsAppLink = (b: Booking) => {
    const rawMsg = getWhatsAppMessageText(b);
    const cleanPhone = settings.phone1.replace(/\s+/g, "");
    return `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(rawMsg)}`;
  };

  // Sync with Express backend and Firestore
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        const sorted = [...data].sort((a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setActiveBookings(sorted);
        localStorage.setItem("haveli_bookings", JSON.stringify(sorted));
      } else {
        throw new Error();
      }
    } catch (e) {
      const saved = localStorage.getItem("haveli_bookings");
      if (saved) {
        setActiveBookings(JSON.parse(saved));
      }
    }
  };

  // Load existing bookings on mount and sync on tick
  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 10000);

    const savedTimings = localStorage.getItem("haveli_timings");
    if (savedTimings) {
      setRestaurantHours(savedTimings);
    }

    // Fetch live system configuration settings
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const sData = await res.json();
          if (sData && sData.phone1) {
            setSettings(sData);
          }
        }
      } catch (err) {
        console.warn("Could not fetch live settings for WhatsApp integration", err);
      }
    };
    fetchSettings();

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuestsSlider = (val: number) => {
    setFormData(prev => ({ ...prev, guestsCount: val }));
  };

  const saveLog = (message: string) => {
    const savedLogs = localStorage.getItem("haveli_logs") || "[]";
    const logs = JSON.parse(savedLogs);
    logs.unshift({
      id: `log-${Date.now()}`,
      time: new Date().toISOString(),
      message
    });
    localStorage.setItem("haveli_logs", JSON.stringify(logs));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorWord(null);

    // Validations
    if (!formData.name.trim()) return setErrorWord("Please provide a contact name.");
    if (!formData.phone.trim()) return setErrorWord("Please provide a mobile phone number for confirmations.");
    if (!formData.date) return setErrorWord("Please specify a date.");

    let reservationCode = "";
    let logoMessage = "";
    let newBooking: Booking;

    if (bookingType === "delivery") {
      if (!formData.address.trim()) {
        return setErrorWord("Home delivery requires a valid location address.");
      }
      if (!formData.orderDishes.trim()) {
        return setErrorWord("Please specify the recipes/items you want to order.");
      }
      reservationCode = `HV-DL-${Math.floor(100000 + Math.random() * 900000)}`;
      
      newBooking = {
        code: reservationCode,
        type: "delivery",
        name: formData.name,
        phone: formData.phone,
        email: formData.email || "N/A",
        date: formData.date,
        timeSlot: formData.timeSlot,
        guestsCount: 0,
        address: formData.address,
        orderDishes: formData.orderDishes,
        paymentOption: "Pay on Delivery (Cash/UPI)",
        notes: formData.notes || "None",
        createdAt: new Date().toISOString(),
        status: "Confirmed"
      };

      logoMessage = `New Delivery Order Registered: Code ${reservationCode} under name ${formData.name} for Pay on Delivery. Address: ${formData.address}.`;
    } else {
      const guestsLimit = bookingType === "dining" ? 20 : 600;
      const guestsMin = bookingType === "dining" ? 1 : 25;

      if (formData.guestsCount < guestsMin) {
        return setErrorWord(`For Banquet Hall bookings, we require a minimum attendance of ${guestsMin} guests.`);
      }

      reservationCode = `HV-${bookingType === "dining" ? "DT" : "BH"}-${Math.floor(100000 + Math.random() * 900000)}`;
      
      newBooking = {
        code: reservationCode,
        type: bookingType,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || "N/A",
        date: formData.date,
        timeSlot: formData.timeSlot,
        guestsCount: formData.guestsCount,
        notes: formData.notes || "None",
        createdAt: new Date().toISOString(),
        status: "Confirmed"
      };

      logoMessage = `New Reservation Created: Code ${reservationCode} under name ${formData.name} for ${formData.guestsCount} guests on ${formData.date}.`;
    }

    // Live backend synchronization
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooking)
      });
    } catch (err) {
      console.warn("Backend update offline, operating on fallback caching", err);
    }

    // Local storage replicate
    const updatedBookings = [newBooking, ...activeBookings];
    setActiveBookings(updatedBookings);
    localStorage.setItem("haveli_bookings", JSON.stringify(updatedBookings));

    // Save logs for admin
    saveLog(logoMessage);

    setReceipt(newBooking);
    
    // Reset form fields
    setFormData({
      name: "",
      phone: "",
      email: "",
      date: "",
      timeSlot: bookingType === "delivery" ? "Immediate (30-45 mins)" : "12:30 PM - Lunch",
      guestsCount: bookingType === "dining" ? 2 : 50,
      notes: "",
      address: "",
      orderDishes: ""
    });
  };

  const cancelBooking = async (code: string) => {
    const filtered = activeBookings.filter(b => b.code !== code);
    setActiveBookings(filtered);
    localStorage.setItem("haveli_bookings", JSON.stringify(filtered));
    saveLog(`Reservation Cancelled: Code ${code}.`);
  };

  return (
    <div id="booking_system" className="py-16 bg-[#FAF6F0]/30 border-b border-[#EAC775]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Decorative Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex justify-center items-center gap-1.5 text-[#EAC775] mb-2">
            <Gift className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] font-semibold">Seat Reservation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#0b1528] tracking-wide mb-3">
            Royal Booking Portal
          </h2>
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#EAC775] to-transparent mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 font-sans">
            Secure premium dining lounges or organize multi-course golden wedding events inside our soundproof high-capacity gold banquet hall. Instant online approvals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Interactive Form (Cols: 7) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EAC775]/30 p-6 sm:p-8 shadow-xl">
            
            {/* Booking type switcher */}
            <div className="flex bg-[#0b1528]/5 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setBookingType("dining");
                  setFormData(prev => ({ ...prev, guestsCount: 2, timeSlot: "12:30 PM - Lunch" }));
                }}
                className={`flex-1 py-3 text-xs uppercase font-mono tracking-wider font-bold rounded-lg transition-all ${
                  bookingType === "dining" ? "bg-[#0b1528] text-[#FAF6F0] shadow" : "text-[#0b1528]/70 hover:text-[#0b1528]"
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
                className={`flex-1 py-3 text-xs uppercase font-mono tracking-wider font-bold rounded-lg transition-all ${
                  bookingType === "banquet" ? "bg-[#0b1528] text-[#FAF6F0] shadow" : "text-[#0b1528]/70 hover:text-[#0b1528]"
                }`}
              >
                🏰 Banquet Hall
              </button>
              <button
                type="button"
                onClick={() => {
                  setBookingType("delivery");
                  setFormData(prev => ({ ...prev, guestsCount: 0, timeSlot: "Immediate (30-45 mins)" }));
                }}
                className={`flex-1 py-3 text-xs uppercase font-mono tracking-wider font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  bookingType === "delivery" ? "bg-[#0b1528] text-[#FAF6F0] shadow" : "text-[#0b1528]/70 hover:text-[#0b1528]"
                }`}
              >
                🚗 Delivery (COD)
              </button>
            </div>

            {/* Error Indicator */}
            {errorWord && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 text-red-600 text-xs font-sans font-medium border border-red-100 flex items-center gap-2">
                <span className="shrink-0 font-bold">⚠️</span> {errorWord}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono uppercase text-gray-500 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="E.g. Sri Rama Rao"
                    required
                    className="w-full text-sm p-3 rounded-lg border border-gray-200 focus:border-[#EAC775] focus:outline-none focus:ring-1 focus:ring-[#EAC775] transition"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-gray-500 block mb-1">Mobile Hotline *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="E.g. +91 99850 84847"
                    required
                    className="w-full text-sm p-3 rounded-lg border border-gray-200 focus:border-[#EAC775] focus:outline-none focus:ring-1 focus:ring-[#EAC775] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono uppercase text-gray-500 block mb-1">
                    {bookingType === "delivery" ? "Delivery Date *" : "Reservation Date *"}
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full text-sm p-3 rounded-lg border border-gray-200 focus:border-[#EAC775] focus:outline-none focus:ring-1 focus:ring-[#EAC775] transition-all bg-white text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-gray-500 block mb-1">
                    {bookingType === "delivery" ? "Desired Arrival Schedule" : "Preferred Time Slot (Type any custom time)"}
                  </label>
                  <input
                    type="text"
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    list="time-slots-list"
                    placeholder="E.g. 01:30 PM, 08:15 PM, 04:00 PM, etc."
                    className="w-full text-sm p-3 rounded-lg border border-gray-200 focus:border-[#EAC775] bg-white text-gray-700 focus:outline-none transition font-sans"
                    required
                  />
                  <datalist id="time-slots-list">
                    {bookingType === "delivery" ? (
                      <>
                        <option value="Immediate (30-45 mins)" />
                        <option value="12:30 PM - Lunch" />
                        <option value="01:30 PM - Late Lunch" />
                        <option value="05:00 PM - Teatime" />
                        <option value="07:30 PM - Dinner Peak" />
                        <option value="08:30 PM - Dinner Late" />
                        <option value="10:00 PM - Night Snacks" />
                      </>
                    ) : bookingType === "dining" ? (
                      <>
                        <option value="11:30 AM" />
                        <option value="12:00 PM - Early Lunch" />
                        <option value="12:30 PM - Lunch Peak" />
                        <option value="01:00 PM" />
                        <option value="01:30 PM - Afternoon Feast" />
                        <option value="02:00 PM" />
                        <option value="02:30 PM" />
                        <option value="07:00 PM - Early Dinner" />
                        <option value="07:30 PM" />
                        <option value="08:00 PM" />
                        <option value="08:30 PM - Dinner Peak" />
                        <option value="09:00 PM" />
                        <option value="09:30 PM" />
                        <option value="10:00 PM - Late Night Bite" />
                        <option value="10:30 PM" />
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
              </div>

              <div>
                {bookingType === "delivery" ? (
                  <div>
                    <label className="text-[11px] font-mono uppercase text-gray-500 block mb-1">Payment Method</label>
                    <div className="p-3 bg-amber-50 border border-[#EAC775]/30 rounded-lg text-xs font-mono font-bold text-amber-800 flex items-center gap-1.5 shadow-sm">
                      💵 Cash/UPI/swipe card on Delivery
                    </div>
                  </div>
                ) : (
                  /* Dynamically Styled Attendance Slider */
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-mono uppercase text-gray-500">Attendance Size</label>
                      <span className="text-xs font-bold text-[#EAC775] font-mono bg-[#0b1528] px-2 py-0.5 rounded shadow">
                        {bookingType === "dining" ? `${formData.guestsCount} Persons` : `${formData.guestsCount} Invites`}
                      </span>
                    </div>
                    <div className="pt-2">
                      <input
                        type="range"
                        min={bookingType === "dining" ? 1 : 25}
                        max={bookingType === "dining" ? 20 : 600}
                        step={bookingType === "dining" ? 1 : 10}
                        value={formData.guestsCount}
                        onChange={(e) => handleGuestsSlider(Number(e.target.value))}
                        className="w-full accent-[#EAC775] h-2 bg-gray-200 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] font-mono text-gray-400 mt-1">
                        <span>{bookingType === "dining" ? "1 Table" : "Min: 25 invites"}</span>
                        <span>{bookingType === "dining" ? "Max: 20 head" : "Max: 600 cap"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {bookingType === "delivery" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase block mb-1 text-[#EAC775] font-bold">Delivery Location Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter doorstep address in Markapur town limits"
                      required
                      className="w-full text-sm p-3 rounded-lg border border-gray-200 focus:border-[#EAC775] focus:outline-none focus:ring-1 focus:ring-[#EAC775] transition bg-[#FAF6F0]/20"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono uppercase block mb-1 text-[#EAC775] font-bold">List Dishes to Order *</label>
                    <textarea
                      name="orderDishes"
                      rows={2}
                      value={formData.orderDishes}
                      onChange={handleInputChange}
                      placeholder="E.g. 1 Chicken Biryani Family Pack, 1 Apollo Paneer, 2 Butter Naan..."
                      required
                      className="w-full text-sm p-3 rounded-lg border border-gray-200 focus:border-[#EAC775] focus:outline-none focus:ring-1 focus:ring-[#EAC775] transition"
                    ></textarea>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-mono uppercase text-gray-500 block mb-1">
                  {bookingType === "delivery" ? "Special Delivery Directives" : "Special Chef Directives & Notes"}
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder={
                    bookingType === "delivery"
                      ? "Describe route landmarks or contactless instructions (e.g., leave with security)..."
                      : bookingType === "dining" 
                        ? "Mention any children constraints, raw spice level demands, or birthday balloons requests..."
                        : "Briefly outline catering preferences (VEG/NON-VEG split ratio), floral stage requirements, or sound setup requirements..."
                  }
                  className="w-full text-sm p-3 rounded-lg border border-gray-200 focus:border-[#EAC775] focus:outline-none focus:ring-1 focus:ring-[#EAC775] transition"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0b1528] to-[#12223c] font-bold text-xs uppercase tracking-widest text-[#FAF6F0] hover:shadow-lg focus:outline-none transition border-b-4 border-[#EAC775]"
              >
                {bookingType === "delivery" ? "🚀 Dispatch Home Delivery (Pay on Delivery)" : `Confirm Royal ${bookingType === "dining" ? "Table" : "Banquet Room"} Booking`}
              </button>
            </form>
          </div>

          {/* Sidebar Receipts & active bookings (Cols: 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Voucher popup on successful submit */}
            <AnimatePresence>
              {receipt && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#0b1528] text-[#FAF6F0] p-6 rounded-2xl border-2 border-[#EAC775] shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-1 bg-[#EAC775] text-[#0b1528] text-[9px] font-mono uppercase tracking-wider rounded-bl">
                    {receipt.type === "delivery" ? "Delivery Dispatch" : "Active Token"}
                  </div>
                  
                  {/* Voucher design circles */}
                  <div className="absolute left-[-10px] top-1/2 w-5 h-5 bg-[#FAF6F0] rounded-full"></div>
                  <div className="absolute right-[-10px] top-1/2 w-5 h-5 bg-[#FAF6F0] rounded-full"></div>

                  <div className="flex items-center gap-2 text-[#EAC775] mb-3">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                      {receipt.type === "delivery" ? "Golden Order Dispatched" : "Imperial Pass Issued"}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-serif text-[#FAF6F0] mb-1">Haveli Guest Receipt</h3>
                  <p className="text-[10px] font-mono text-gray-400 border-b border-white/10 pb-3 mb-3">
                    Client Name: <span className="text-white font-sans font-medium">{receipt.name}</span>
                  </p>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">ORDER/TICKET CODE:</span>
                      <span className="text-[#EAC775] font-bold">{receipt.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-sans">Booking Category:</span>
                      <span className="uppercase font-sans font-medium text-[#EAC775]">
                        {receipt.type === "delivery" ? "🚗 HOME DELIVERY" : receipt.type === "dining" ? "🍽️ Table Dining" : "🏰 Banquet Event"}
                      </span>
                    </div>
                    {receipt.type === "delivery" && (
                      <div className="flex flex-col gap-0.5 border-b border-white/5 pb-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400 font-sans">Payment Method:</span>
                          <span className="text-amber-400 font-sans font-bold">💵 Cash / UPI on Delivery</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-500 font-sans">PhonePe/GPay UPI:</span>
                          <span className="text-[#EAC775] font-mono font-bold">70132 20053</span>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-sans">Scheduled Date:</span>
                      <span className="text-white font-sans">{receipt.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-sans">Arrival Slot:</span>
                      <span className="text-white text-[11px] truncate">{receipt.timeSlot}</span>
                    </div>
                    {receipt.type !== "delivery" && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-sans">Cover Count:</span>
                        <span className="text-white font-semibold">{receipt.guestsCount} Heads</span>
                      </div>
                    )}

                    {receipt.type === "delivery" && receipt.address && (
                      <div className="border-t border-white/10 pt-2 text-[11px]">
                        <span className="text-slate-400 block pb-1">DELIVERY ADDRESS:</span>
                        <span className="text-emerald-300 font-sans block leading-normal bg-white/5 p-2 rounded">{receipt.address}</span>
                      </div>
                    )}

                    {receipt.type === "delivery" && receipt.orderDishes && (
                      <div className="pt-2 text-[11px]">
                        <span className="text-slate-400 block pb-1">RECIPES ORDERED:</span>
                        <span className="text-emerald-300 font-sans block leading-normal bg-white/5 p-2 rounded">{receipt.orderDishes}</span>
                      </div>
                    )}

                    <div className="border-t border-white/10 pt-2 text-[10px] text-gray-400 italic">
                      Special directions: {receipt.notes}
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-3 rounded-lg mt-4 text-xs text-gray-200 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="font-bold font-mono text-[10px] uppercase">WhatsApp Notification Ready</span>
                    </div>
                    <p className="leading-relaxed text-[11px] text-gray-300">
                      Please click the WhatsApp button below to instantly secure and notify the owner with your booking code and reservation details.
                    </p>
                    
                    <a
                      href={getWhatsAppLink(receipt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full text-center text-xs font-bold font-sans tracking-wide text-white bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl shadow-lg border border-emerald-400/30 transition-all active:scale-[0.98] mt-1"
                    >
                      <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.4.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.864-9.849.002-2.63-1.023-5.101-2.883-6.963C16.586 1.96 14.12 1.06 11.48 1.06c-5.44 0-9.866 4.414-9.87 9.852l-.001 2.044c.003 1.638.484 3.2 1.392 4.591l-.993 3.627 3.73-.977zm11.218-4.504c-.312-.156-1.848-.911-2.134-1.015-.286-.105-.495-.156-.704.156-.21.312-.813.105-.996.312-.183.21-.365.209-.677.052-.313-.156-1.32-.486-2.515-1.551-.93-.83-1.557-1.856-1.74-2.167-.182-.313-.019-.481.137-.636.141-.14.312-.365.468-.547.156-.183.209-.313.313-.521.104-.209.052-.391-.026-.547-.078-.156-.704-1.7-.964-2.324-.254-.608-.51-.527-.704-.527h-.6c-.21 0-.547.079-.834.391-.286.313-1.1 1.074-1.1 2.617 0 1.542 1.121 3.031 1.277 3.24.156.208 2.203 3.364 5.337 4.717.745.322 1.328.514 1.785.659.749.238 1.432.204 1.971.124.6-.09 1.847-.756 2.11-.1446.262-.73.262-1.355.183-1.459-.078-.105-.286-.156-.599-.312z" />
                      </svg>
                      Notify Owner via WhatsApp
                    </a>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg mt-3 text-[10px] text-gray-400 space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <Sparkles className="w-3.5 h-3.5 text-[#EAC775]" />
                      <span className="font-bold">Dispatch Status</span>
                    </div>
                    <p className="leading-normal">
                      {receipt.type === "delivery"
                        ? "Your delivery driver is being assigned. Please keep payment ready. You can pay via Cash or UPI." 
                        : "Bring this screen or mention the booking code at the reception desk for priority entry."}
                    </p>
                  </div>

                  <button
                    onClick={() => setReceipt(null)}
                    className="w-full text-center text-xs font-bold font-mono tracking-widest text-[#0b1528] bg-[#EAC775] py-2 rounded-lg mt-4 hover:brightness-110 active:scale-95 transition cursor-pointer"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List of active bookings for guest management */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase text-[#0b1528] mb-4 flex items-center justify-between border-b pb-2">
                <span>Active Passes / Orders ({activeBookings.length})</span>
                <Ticket className="w-4.5 h-4.5 text-gray-400" />
              </h3>

              {activeBookings.length === 0 ? (
                <div className="text-center py-8 px-4 text-gray-400">
                  <div className="text-2xl mb-2">🍽️</div>
                  <p className="text-xs leading-normal">No active table reservations. Your booked tokens will persist here in real-time.</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                  {activeBookings.map((b) => (
                    <div key={b.code} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl relative group hover:border-[#EAC775]/50 transition">
                      
                      {/* Control buttons list */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Notify on WhatsApp */}
                        <a
                          href={getWhatsAppLink(b)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-600 transition-colors"
                          title="Send/Re-notify owner over WhatsApp"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.4.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.864-9.849.002-2.63-1.023-5.101-2.883-6.963C16.586 1.96 14.12 1.06 11.48 1.06c-5.44 0-9.866 4.414-9.87 9.852l-.001 2.044c.003 1.638.484 3.2 1.392 4.591l-.993 3.627 3.73-.977zm11.218-4.504c-.312-.156-1.848-.911-2.134-1.015-.286-.105-.495-.156-.704.156-.21.312-.813.105-.996.312-.183.21-.365.209-.677.052-.313-.156-1.32-.486-2.515-1.551-.93-.83-1.557-1.856-1.74-2.167-.182-.313-.019-.481.137-.636.141-.14.312-.365.468-.547.156-.183.209-.313.313-.521.104-.209.052-.391-.026-.547-.078-.156-.704-1.7-.964-2.324-.254-.608-.51-.527-.704-.527h-.6c-.21 0-.547.079-.834.391-.286.313-1.1 1.074-1.1 2.617 0 1.542 1.121 3.031 1.277 3.24.156.208 2.203 3.364 5.337 4.717.745.322 1.328.514 1.785.659.749.238 1.432.204 1.971.124.6-.09 1.847-.756 2.11-.1446.262-.73.262-1.355.183-1.459-.078-.105-.286-.156-.599-.312z" />
                          </svg>
                        </a>

                        {/* Cancel Booking */}
                        <button
                          onClick={() => cancelBooking(b.code)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title="Cancel Booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold font-mono uppercase ${
                          b.type === "delivery" 
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-350" 
                            : b.type === "dining" 
                              ? "bg-amber-50 text-[#0b1528] border border-[#EAC775]/30" 
                              : "bg-purple-100 text-purple-950 border border-purple-200"
                        }`}>
                          {b.type === "delivery" ? "Delivery (COD)" : b.type === "dining" ? "DineIn" : "Banquet"}
                        </span>
                        <span className="text-xs font-mono font-bold text-gray-700">{b.code}</span>
                        
                        <span className={`text-[8px] font-bold font-mono py-0.5 px-1 rounded-full ${
                          b.status === "Out for Delivery" 
                            ? "bg-teal-100 text-teal-800 animate-pulse" 
                            : b.status === "Completed" 
                              ? "bg-gray-150 text-gray-500" 
                              : "bg-amber-100 text-amber-800"
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <p className="font-semibold text-gray-800">
                          {b.name} 
                          {b.type !== "delivery" && <span className="font-normal text-[10px] text-gray-400"> ({b.guestsCount} heads)</span>}
                        </p>
                        {b.type === "delivery" && b.orderDishes && (
                          <p className="text-indigo-800 font-sans text-[11px] bg-slate-100 p-1.5 rounded my-1">
                            📦 Items: <span className="text-slate-800 font-medium">{b.orderDishes}</span>
                          </p>
                        )}
                        <p className="text-gray-500 font-mono text-[10px]">Date: {b.date} | Slot: {b.timeSlot}</p>
                        {b.type === "delivery" && b.address && (
                          <p className="text-slate-500 font-sans text-[10px] truncate">📍 Address: {b.address}</p>
                        )}
                      </div>

                      {/* Small inline note identifier */}
                      {b.notes && b.notes !== "None" && (
                        <div className="bg-white p-1.5 rounded text-[10px] italic text-slate-400 leading-normal mt-1.5 border border-slate-100 truncate">
                          Note: "{b.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Location Card */}
            <div className="bg-gradient-to-br from-[#0b1528] to-[#12223c] p-5 rounded-2xl text-white shadow relative overflow-hidden border border-white/10">
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                <MapPin className="w-32 h-32" />
              </div>
              <h4 className="font-serif text-[#EAC775] text-base mb-1.5">Location & Contact</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3.5">
                Opp. RTC Bus stand, Register Office Line, N.S Nagar,<br/>
                Markapur, Andhra Pradesh, PIN 523316.
              </p>
              
              <div className="flex flex-col gap-2 border-t border-white/10 pt-3 text-[11px] text-slate-400">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="block text-[#EAC775] font-mono leading-none font-bold uppercase mb-0.5">📞 DELIVERY HELPLINE</span>
                    <span className="text-slate-200 font-mono font-bold tracking-wide">79815 62535</span>
                  </div>
                  <div>
                    <span className="block text-emerald-400 font-mono leading-none font-bold uppercase mb-0.5">🟢 WHATSAPP HOTLINE</span>
                    <span className="text-slate-200 font-mono font-bold tracking-wide">99850 84847</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-2">
                  <div>
                    <span className="block text-[#EAC775] font-mono leading-none font-bold uppercase mb-0.5">🟣 PHONEPE / GPAY</span>
                    <span className="text-slate-200 font-mono font-bold tracking-wide">70132 20053</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-mono leading-none uppercase mb-0.5">TIMINGS</span>
                    <span className="text-slate-200 font-sans">{restaurantHours}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

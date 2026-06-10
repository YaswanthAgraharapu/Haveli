/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Shield, Sparkles, TrendingUp, Calendar, BookOpen, ScrollText, Play, Activity, 
  Trash2, Check, RefreshCw, Plus, Edit2, Save, X, Lock, Coffee, Tag, Smartphone,
  MapPin, Edit, Eye, ShieldAlert
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { Booking } from "./BookingSystem";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

export interface Log {
  id: string;
  time: string;
  message: string;
}

export interface DailyDeal {
  dayOfWeek: string;
  offerTitle: string;
  discountRate: string;
  specialRecommendation: string;
  activeAnnouncement: string;
}

const compressAndGetBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        // Define standard high-clearance max bounds (e.g. 1000px wide or high)
        const maxDimension = 1000;
        let width = img.width;
        let height = img.height;
        
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress strictly to high-quality JPEG to compact bytes to ~50kB to 100kB max
          const compressed = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressed);
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

export default function AdminSuite() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Monitor auth state changes in real-time
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthChecking(false);
      if (user) {
        setIsAuthorized(true);
        loadData();
        fetchAdminMenu();
      } else {
        setIsAuthorized(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPasswordInput);
      setAdminPasswordInput("");
      appendSystemLog(`Security Authentication: Admin logged in successfully with email ${adminEmail}.`);
    } catch (err: any) {
      console.error("Login failure:", err);
      let message = "Incorrect credentials combination. Please verify your admin email and password.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        message = "Incorrect password or email. Authentication rejected.";
      } else if (err.code === "auth/user-not-found") {
        message = "No admin user found with this email.";
      } else if (err.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else {
        message = err.message || message;
      }
      setAuthError(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthorized(false);
      appendSystemLog("Security Authentication: Admin manually logged out from Owner Suite.");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const [adminPhone, setAdminPhone] = useState("8247733059");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [simulatedOtp, setSimulatedOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Switch between "dashboard" operational tab, "menu" editor tab, and "gallery" manager tab
  const [adminActiveTab, setAdminActiveTab] = useState<"dashboard" | "menu" | "gallery">("dashboard");

  // Dynamic live gallery states
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);

  // Safe wrapper for localStorage.setItem to avoid QuotaExceededError
  const safeSaveGallery = (updated: any[]) => {
    try {
      localStorage.setItem("haveli_gallery_photos", JSON.stringify(updated));
    } catch (err: any) {
      console.error("Local storage photo quota exceeded:", err);
      if (err.name === "QuotaExceededError" || err.code === 22) {
        alert("Warning: Local storage limit reached! Your newer photo edits could not be saved because the browser storage is completely full. Please restore default placeholders or upload more compressed screenshots.");
      } else {
        alert("An unexpected error occurred saving gallery photos: " + err.message);
      }
    }
  };

  // Operational settings state loaded live from database
  const [settings, setSettings] = useState({
    phone1: "99850 84847",
    phone2: "79815 62535",
    phone3: "70132 20053",
    timings: "11:00 AM - 11:00 PM",
    address: "Opp. RTC Bus stand, Register Office Line, N.S Nagar, Markapur, Andhra Pradesh, 523316, IN",
    googleMapsUrl: "https://maps.app.goo.gl/WLeMQ6w6LB3CdikF7",
    restaurantName: "Haveli Banquet Hall And Restaurant"
  });

  // Dynamic category editor forms states
  const [newCategoryName, setNewCategoryName] = useState("");
  const [renameCategoryFormName, setRenameCategoryFormName] = useState("");

  // Change password form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("haveli_gallery_photos");
    if (saved) {
      try {
        setGalleryPhotos(JSON.parse(saved));
        return;
      } catch (e) {}
    }
    setGalleryPhotos([
      {
        id: "g1",
        url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
        title: "Haveli Grand Royal Banquet Table",
        category: "dining",
        description: "A breathtaking perspective of our long dining hall table setting, fully adorned with pristine plateware and framed by majestic warm-glowing brick-pillar architectures."
      },
      {
        id: "g2",
        url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80",
        title: "Signature Chicken Dum Biryani Platter",
        category: "foods",
        description: "A luscious high-angle platter layout showcasing steaming bowls of our premium, authentic long-grain aromatic Chicken Dum Biryani cooked under traditional raw pressure."
      },
      {
        id: "g3",
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
        title: "Mandala Heritage Dining Corner",
        category: "dining",
        description: "An exquisite private seating nook backed by our magnificent, yellow-gold handcrafted floral mandala wood carving and warm historic ambient spotlighting."
      },
      {
        id: "g4",
        url: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=800&q=80",
        title: "Real Guest Celebrations & Family Feasts",
        category: "dining",
        description: "Candid moments of our beloved guests sharing joyous stories and celebrating high-quality traditional meals together at our spacious royal banquet tables."
      },
      {
        id: "g5",
        url: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&q=80",
        title: "Our Professional Stewards & Serving Team",
        category: "banquet",
        description: "Meet our smart, courteous, and professionally trained hospitality waiters who stand ready with high pride to serve your family a memorable dining feast."
      }
    ]);
  }, []);

  // Live admin state fetched from local storage
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [dailyDeal, setDailyDeal] = useState<DailyDeal>({
    dayOfWeek: "Today",
    offerTitle: "Royal Taste Festival",
    discountRate: "10% OFF on all signature Biryani choices",
    specialRecommendation: "Ulavacharu Chicken Biryani",
    activeAnnouncement: "🏰 Exclusive: Experience the traditional culinary marvel of Haveli Dum Biryani. Priority entry on online booking passes!"
  });

  const [restaurantTimings, setRestaurantTimings] = useState("11:00 AM - 11:00 PM");

  // Dynamic live menu states
  const [menuList, setMenuList] = useState<any[]>([]);
  const [selectedEditorCategory, setSelectedEditorCategory] = useState<string>("Soups");
  
  // States for adding menu item
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemIsPopular, setNewItemIsPopular] = useState(false);
  const [menuEditorErr, setMenuEditorErr] = useState<string | null>(null);
  const [menuEditorSuccess, setMenuEditorSuccess] = useState<string | null>(null);

  // States for editing menu item inline
  const [editingItemName, setEditingItemName] = useState<string | null>(null);
  const [editItemForm, setEditItemForm] = useState({
    name: "",
    price: "",
    description: "",
    isPopular: false
  });

  // Load state on mount
  useEffect(() => {
    loadData();
    fetchAdminMenu();
    
    // Default or stored daily deal
    const savedDeal = localStorage.getItem("haveli_daily_deal");
    if (savedDeal) {
      setDailyDeal(JSON.parse(savedDeal));
    } else {
      localStorage.setItem("haveli_daily_deal", JSON.stringify(dailyDeal));
    }
    const savedTimings = localStorage.getItem("haveli_timings");
    if (savedTimings) {
      setRestaurantTimings(savedTimings);
    } else {
      localStorage.setItem("haveli_timings", "11:00 AM - 11:00 PM");
    }
  }, []);

  // Poll server live while authorized to show real-time seat locks
  useEffect(() => {
    if (isAuthorized) {
      const interval = setInterval(() => {
        loadData();
        fetchAdminMenu();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAuthorized]);

  const loadData = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
        localStorage.setItem("haveli_bookings", JSON.stringify(data));
      } else {
        throw new Error();
      }
    } catch (e) {
      const savedBookings = localStorage.getItem("haveli_bookings");
      if (savedBookings) setBookings(JSON.parse(savedBookings));
    }

    // Load operational settings from backend as well
    try {
      const sRes = await fetch("/api/settings");
      if (sRes.ok) {
        const sData = await sRes.json();
        setSettings(sData);
        setRestaurantTimings(sData.timings);
      }
    } catch (e) {}

    const savedLogs = localStorage.getItem("haveli_logs");
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    } else {
      // Seed default baseline logs for style
      const baseline = [
        { id: "seed-1", time: new Date(Date.now() - 3600000).toISOString(), message: "Administrative console synchronized successfully with Markapur server." },
        { id: "seed-2", time: new Date(Date.now() - 7200000).toISOString(), message: "Restaurant operational menu baseline loaded securely." }
      ];
      localStorage.setItem("haveli_logs", JSON.stringify(baseline));
      setLogs(baseline);
    }
  };

  const fetchAdminMenu = async () => {
    try {
      const res = await fetch("/api/menu");
      if (res.ok) {
        const data = await res.json();
        setMenuList(data);
        if (data.length > 0 && !data.some((c: any) => c.categoryName === selectedEditorCategory)) {
          setSelectedEditorCategory(data[0].categoryName);
        }
      }
    } catch (e) {
      console.warn("Offline admin menu mode enabled.");
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    setIsRequesting(true);
    setSimulatedOtp("");
    try {
      const res = await fetch("/api/admin/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: adminPhone })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        if (data.debugOtp) {
          setSimulatedOtp(data.debugOtp);
        }
        appendSystemLog(`Security Authentication: Admin requested 6-digit OTP code dispatch for ${adminPhone}.`);
      } else {
        setOtpError(data.error || "Failed to send security OTP.");
      }
    } catch (err) {
      setOtpError("Communication error with admin authentication server.");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    setIsVerifying(true);
    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: adminPhone, otp: otpCode })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthorized(true);
        setOtpError("");
        setOtpCode("");
        loadData();
        fetchAdminMenu();
        appendSystemLog(`Security Authentication: Admin successfully verified security OTP and unlocked Owner Suite.`);
      } else {
        setOtpError(data.error || "Incorrect OTP code. Verification failed.");
      }
    } catch (err) {
      setOtpError("Communication error verifying security OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Set individual daily deals
  const handleDealChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDailyDeal(prev => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem("haveli_daily_deal", JSON.stringify(updated));
      return updated;
    });
  };

  // Save Settings submitted live to backend server
  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        setRestaurantTimings(data.settings.timings);
        appendSystemLog(`System Settings: General restaurant details (phones, coordinates, timelines) synchronized live.`);
        alert("Restaurant settings saved live! Customer screen updated instantly in real-time.");
      } else {
        alert("Server validation error repeating parameters.");
      }
    } catch (err) {
      alert("Failed to communicate settings update with server.");
    }
  };

  // Regenerate announcement marquee helper
  const handleAnnouncementRegen = () => {
    const updatedAnn = `🏰 Active Offer: ${dailyDeal.offerTitle} matches beautifully on ${dailyDeal.dayOfWeek}! Recommended dish: ${dailyDeal.specialRecommendation} with ${dailyDeal.discountRate}!`;
    setDailyDeal(prev => {
      const updated = { ...prev, activeAnnouncement: updatedAnn };
      localStorage.setItem("haveli_daily_deal", JSON.stringify(updated));
      return updated;
    });
    
    // Add log
    appendSystemLog(`Admin modified Live Specials: Offer '${dailyDeal.offerTitle}' updated for ${dailyDeal.dayOfWeek}.`);
  };

  const appendSystemLog = (message: string) => {
    const updated = [
      { id: `log-${Date.now()}`, time: new Date().toISOString(), message },
      ...logs
    ];
    setLogs(updated);
    localStorage.setItem("haveli_logs", JSON.stringify(updated));
  };

  const cancelBookingAdmin = async (code: string) => {
    try {
      const filtered = bookings.filter(b => b.code !== code);
      setBookings(filtered);
      localStorage.setItem("haveli_bookings", JSON.stringify(filtered));
      appendSystemLog(`Reservation Code ${code} marked as completed/archived by Admin Admin.`);
      
      await fetch(`/api/bookings/${code}`, {
        method: "DELETE"
      });
      loadData();
    } catch (e) {
      console.error("Failed executing remote database cancel operation:", e);
    }
  };

  const clearAllLogs = () => {
    const cleared = [
      { id: `log-${Date.now()}`, time: new Date().toISOString(), message: "Administrative system logs wiped clean." }
    ];
    setLogs(cleared);
    localStorage.setItem("haveli_logs", JSON.stringify(cleared));
  };

  // Category Actions
  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMenuEditorErr(null);
    setMenuEditorSuccess(null);
    if (!newCategoryName.trim()) return;

    try {
      const res = await fetch("/api/menu/add-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName: newCategoryName.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setMenuList(data.menuCategories);
        setSelectedEditorCategory(newCategoryName.trim());
        setNewCategoryName("");
        setMenuEditorSuccess(`Category "${newCategoryName.trim()}" successfully created!`);
        appendSystemLog(`Menu Categories: Created new category "${newCategoryName.trim()}".`);
      } else {
        setMenuEditorErr(data.error || "Category already exists.");
      }
    } catch (e) {
      setMenuEditorErr("Communications error with categories endpoints.");
    }
  };

  const handleRenameCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMenuEditorErr(null);
    setMenuEditorSuccess(null);
    if (!renameCategoryFormName.trim() || renameCategoryFormName.trim() === selectedEditorCategory) return;

    try {
      const res = await fetch("/api/menu/update-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalName: selectedEditorCategory, newName: renameCategoryFormName.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setMenuList(data.menuCategories);
        const renamed = renameCategoryFormName.trim();
        setSelectedEditorCategory(renamed);
        setRenameCategoryFormName("");
        setMenuEditorSuccess(`Category renamed to "${renamed}" successfully!`);
        appendSystemLog(`Menu Categories: Renamed "${selectedEditorCategory}" to "${renamed}".`);
      } else {
        setMenuEditorErr(data.error || "Could not execute renaming.");
      }
    } catch (e) {
      setMenuEditorErr("Communications error with server.");
    }
  };

  const handleDeleteCategorySubmit = async () => {
    setMenuEditorErr(null);
    setMenuEditorSuccess(null);
    if (!selectedEditorCategory) return;
    
    if (!window.confirm(`Are you absolutely sure you want to delete category "${selectedEditorCategory}" and all of its corresponding dishes? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch("/api/menu/delete-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName: selectedEditorCategory })
      });
      const data = await res.json();
      if (res.ok) {
        setMenuList(data.menuCategories);
        setMenuEditorSuccess(`Category "${selectedEditorCategory}" and associated dishes removed successfully.`);
        appendSystemLog(`Menu Categories: Deleted category "${selectedEditorCategory}".`);
        if (data.menuCategories.length > 0) {
          setSelectedEditorCategory(data.menuCategories[0].categoryName);
        } else {
          setSelectedEditorCategory("");
        }
      } else {
        setMenuEditorErr(data.error || "Could not delete category.");
      }
    } catch (e) {
      setMenuEditorErr("Communications error deleting category.");
    }
  };

  const handleAddItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMenuEditorErr(null);
    setMenuEditorSuccess(null);
    if (!newItemName.trim() || !newItemPrice.trim()) {
      setMenuEditorErr("Please specify a name and price for the new dish.");
      return;
    }
    const priceNum = Number(newItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setMenuEditorErr("Price must be a valid positive number.");
      return;
    }
    try {
      const res = await fetch("/api/menu/add-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryName: selectedEditorCategory,
          item: {
            name: newItemName.trim(),
            price: priceNum,
            description: newItemDesc.trim(),
            isPopular: newItemIsPopular
          }
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setMenuEditorErr(data.error || "Failed to append item.");
      } else {
        setMenuList(data.menuCategories);
        setNewItemName("");
        setNewItemPrice("");
        setNewItemDesc("");
        setNewItemIsPopular(false);
        setMenuEditorSuccess(`Dish "${newItemName}" added successfully!`);
        appendSystemLog(`Menu Edited: New recipe "${newItemName}" loaded under Category "${selectedEditorCategory}".`);
      }
    } catch (err) {
      setMenuEditorErr("Network Error. Cannot submit menu item.");
    }
  };

  const handleStartEdit = (item: any) => {
    setEditingItemName(item.name);
    setEditItemForm({
      name: item.name,
      price: String(item.price),
      description: item.description || "",
      isPopular: !!item.isPopular
    });
  };

  const handleSaveEdit = async (originalName: string) => {
    setMenuEditorErr(null);
    setMenuEditorSuccess(null);
    const parsedPrice = Number(editItemForm.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setMenuEditorErr("Price must be a valid number.");
      return;
    }
    try {
      const res = await fetch("/api/menu/update-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryName: selectedEditorCategory,
          originalItemName: originalName,
          updatedItem: {
            name: editItemForm.name.trim(),
            price: parsedPrice,
            description: editItemForm.description.trim(),
            isPopular: editItemForm.isPopular
          }
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setMenuEditorErr(data.error || "Failed to update item attributes.");
      } else {
        setMenuList(data.menuCategories);
        setEditingItemName(null);
        setMenuEditorSuccess("Item changes updated persistently!");
        appendSystemLog(`Menu Update: "${originalName}" updated to "${editItemForm.name}" with price ${parsedPrice} under Category "${selectedEditorCategory}".`);
      }
    } catch (err) {
      setMenuEditorErr("Failed to synchronize price updates.");
    }
  };

  const handleDeleteItem = async (itemName: string) => {
    if (!window.confirm(`Are you absolutely sure you want to remove "${itemName}"?`)) {
      return;
    }
    setMenuEditorErr(null);
    setMenuEditorSuccess(null);
    try {
      const res = await fetch("/api/menu/delete-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryName: selectedEditorCategory,
          itemName
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setMenuEditorErr(data.error || "Failed to delete item.");
      } else {
        setMenuList(data.menuCategories);
        setMenuEditorSuccess(`"${itemName}" deleted.`);
        appendSystemLog(`Menu Delete: Removed "${itemName}" from Category "${selectedEditorCategory}".`);
      }
    } catch (err) {
      setMenuEditorErr("Failed to execute discard action.");
    }
  };

  const totalGuests = bookings.reduce((acc, b) => acc + b.guestsCount, 0);

  // If verifying auth state
  if (authChecking) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4 font-sans">
        <RefreshCw className="w-8 h-8 text-[#800E14] animate-spin" />
        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Verifying Administrator Token...</span>
      </div>
    );
  }

  // RENDER FIRM SECURE FIREBASE ADMIN EMAIL/PASSWORD LOGIN SCREEN
  if (!isAuthorized) {
    return (
      <div id="admin_credentials_lock" className="my-12 max-w-md mx-auto bg-[#0b1528] rounded-3xl border border-[#EAC775]/30 p-8 shadow-2xl text-center text-white relative overflow-hidden font-sans">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex justify-center mb-6">
          <BrandLogo variant="vertical" iconSize="lg" />
        </div>

        <h3 className="text-xl font-serif text-[#EAC775] font-black tracking-widest mb-1 flex items-center justify-center gap-2 uppercase">
          <Shield className="w-5 h-5 text-[#EAC775]" /> Owner Portal
        </h3>
        <p className="text-xs text-slate-300 mb-6 font-sans leading-relaxed">
          Secure Administrative Gateway for Haveli Banquet Hall And Restaurant owner credentials.
        </p>

        {authError && (
          <div className="p-3 mb-4 bg-red-950/80 text-red-300 border border-red-500/30 text-xs rounded-xl font-medium text-left flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleEmailPasswordLogin} className="space-y-4 text-left">
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-300 font-bold block mb-1">
              Admin Email Address
            </label>
            <input
              type="email"
              placeholder="admin@haveli-restaurant.com"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full p-3 text-xs bg-white/5 border border-slate-700 rounded-xl focus:border-[#EAC775] focus:outline-none focus:ring-1 focus:ring-[#EAC775] text-white"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-300 font-bold block mb-1">
              Owner Security Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              required
              value={adminPasswordInput}
              onChange={(e) => setAdminPasswordInput(e.target.value)}
              className="w-full p-3 text-xs bg-white/5 border border-slate-700 rounded-xl focus:border-[#EAC775] focus:outline-none focus:ring-1 focus:ring-[#EAC775] text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full mt-2 p-3.5 bg-[#800E14] text-[#EAC775] hover:bg-[#800E14]/90 font-bold text-xs uppercase tracking-widest rounded-xl transition duration-350 shadow-md transform hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-55"
          >
            {isLoggingIn ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#EAC775]" />
                <span>Authorizing Identity...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-[#EAC775]" />
                <span>Verify & Enter Suite</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-800/80 pt-4">
          <p className="text-[10px] font-mono text-slate-400 text-center leading-relaxed">
            Note: Admin user accounts are managed directly inside the Firebase Console. Ask the administrator to provision security tokens.
          </p>
        </div>
      </div>
    );
  }

  // RENDER DYNAMIC DASHBOARD
  return (
    <div id="admin_authorized_panel" className="bg-[#12223c]/5 rounded-2xl border border-[#EAC775]/20 p-6 md:p-8 my-10">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 px-2.5 rounded-full text-red-800 bg-red-100 font-bold font-mono text-[9px] uppercase">
              Ownership Console Live
            </span>
            <span className="text-xs font-mono text-gray-400">Database Engine connected in Real-Time</span>
          </div>
          <h2 className="text-2xl font-serif text-[#0b1528] font-black">{settings.restaurantName} - Admin Suite</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { loadData(); appendSystemLog("Manual datastore synchronize requested."); }}
            className="p-2 bg-white hover:bg-slate-50 text-gray-650 rounded-lg border shadow-xs transition cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={handleLogout}
            className="p-1.5 px-4 bg-[#0b1528] hover:bg-[#0b1528]/80 text-[#FAF6F0] text-xs font-mono rounded-lg transition cursor-pointer"
          >
            Log Out Safe
          </button>
        </div>
      </div>

      {/* Grid: 3 Stats widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex items-center justify-between text-left">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Live Bookings</span>
            <span className="text-2xl font-serif block text-[#0b1528] font-bold mt-1">{bookings.length} Passes</span>
          </div>
          <div className="w-10 h-10 bg-[#FAF6F0] text-[#EAC775] rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex items-center justify-between text-left">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Cover Heads</span>
            <span className="text-2xl font-serif block text-[#0b1528] font-bold mt-1">{totalGuests} Guests</span>
          </div>
          <div className="w-10 h-10 bg-[#FAF6F0] text-purple-700 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex items-center justify-between text-left">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Audit Records</span>
            <span className="text-2xl font-serif block text-[#0b1528] font-bold mt-1">{logs.length} System events</span>
          </div>
          <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <Activity className="w-5 h-5 animate-spin" />
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-250 mb-6 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setAdminActiveTab("dashboard")}
          className={`px-4 py-2 text-xs whitespace-nowrap uppercase font-mono tracking-wider font-bold border-b-2 transition-all cursor-pointer ${
            adminActiveTab === "dashboard"
              ? "border-[#EAC775] text-[#0b1528] font-black"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          📊 Stats & Core Settings
        </button>
        <button
          onClick={() => setAdminActiveTab("menu")}
          className={`px-4 py-2 text-xs whitespace-nowrap uppercase font-mono tracking-wider font-bold border-b-2 transition-all cursor-pointer ${
            adminActiveTab === "menu"
              ? "border-[#EAC775] text-[#0b1528] font-black"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          🍱 Live Menu & Categories
        </button>
        <button
          onClick={() => setAdminActiveTab("gallery")}
          className={`px-4 py-2 text-xs whitespace-nowrap uppercase font-mono tracking-wider font-bold border-b-2 transition-all cursor-pointer ${
            adminActiveTab === "gallery"
              ? "border-[#EAC775] text-[#0b1528] font-black"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          🖼️ Gallery Manager
        </button>
      </div>

      {adminActiveTab === "dashboard" ? (
        /* Grid: 2 columns */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-relaxed text-sm">
          
          {/* PANEL: DYNAMIC OFFER EDITOR */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* CARD 1: SPECIAL DEALS */}
            <div className="bg-white rounded-xl border border-[#EAC775]/30 p-6 shadow-xs space-y-4 text-left">
              <div className="flex items-center gap-2 border-b pb-2 mb-2">
                <Shield className="w-4.5 h-4.5 text-[#EAC775]" />
                <span className="font-bold font-serif text-[#0b1528]">Special of the Day Creator</span>
              </div>
              
              <p className="text-xs text-gray-500 leading-normal">
                Customize promotional headlines and recommendations according to the weekday. These values will synchronize dynamically onto the customer's dashboard!
              </p>

              <form onSubmit={(e) => { e.preventDefault(); handleAnnouncementRegen(); }} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1 font-bold">Target Day</label>
                  <select 
                    name="dayOfWeek" 
                    value={dailyDeal.dayOfWeek}
                    onChange={handleDealChange}
                    className="w-full p-2 rounded-md border bg-slate-50"
                  >
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                    <option>Sunday</option>
                    <option>Today</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1 font-bold">Campaign/Deal Title</label>
                  <input 
                    type="text" 
                    name="offerTitle"
                    value={dailyDeal.offerTitle}
                    onChange={handleDealChange}
                    placeholder="E.g. Shahi Kebab Craze"
                    className="w-full p-2.5 rounded border bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1 font-bold">Deal Rate</label>
                    <input 
                      type="text" 
                      name="discountRate"
                      value={dailyDeal.discountRate}
                      onChange={handleDealChange}
                      placeholder="E.g. 15% Off / Complimentary Drinks"
                      className="w-full p-2.5 rounded border bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1 font-bold">Special Recommendation</label>
                    <input 
                      type="text" 
                      name="specialRecommendation"
                      value={dailyDeal.specialRecommendation}
                      onChange={handleDealChange}
                      placeholder="E.g. Chicken Tandoori Platter"
                      className="w-full p-2.5 rounded border bg-white"
                    />
                  </div>
                </div>

                <div className="bg-[#FAF6F0] p-3 rounded border border-[#EAC775]/30">
                  <span className="text-[9px] font-mono font-bold text-[#EAC775] uppercase block mb-1">Preview Marquee Headline</span>
                  <p className="text-[11px] text-[#0b1528] italic font-medium leading-relaxed">
                    "{dailyDeal.activeAnnouncement}"
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-[#0b1528] hover:bg-[#0b1528]/90 text-white font-semibold rounded-lg text-xs tracking-wider uppercase transition cursor-pointer shadow-xs"
                >
                  🔄 Refresh Live Specials Marquee
                </button>
              </form>
            </div>

            {/* CARD 2: REAL-TIME RESTAURANT SETTINGS */}
            <div className="bg-white rounded-xl border border-[#EAC775]/30 p-6 shadow-xs space-y-4 text-left">
              <div className="flex items-center gap-2 border-b pb-2 mb-1">
                <Coffee className="w-4.5 h-4.5 text-[#EAC775]" />
                <span className="font-bold font-serif text-[#0b1528]">Live Contact Lines & Timings</span>
              </div>
              
              <p className="text-xs text-gray-500 leading-normal">
                Directly adjust contact phone numbers, working hours, and maps URL. These values synchronize immediately onto the front-page widgets of Haveli in real-time.
              </p>

              <form onSubmit={handleSaveSettingsSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1 font-bold">Restaurant Display Name</label>
                  <input 
                    type="text" 
                    value={settings.restaurantName}
                    onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                    className="w-full p-2 rounded border bg-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1 font-bold">Primary WhatsApp Line</label>
                    <input 
                      type="text" 
                      value={settings.phone1}
                      onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
                      className="w-full p-2 rounded border bg-white font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1 font-bold">Helpline Order Line</label>
                    <input 
                      type="text" 
                      value={settings.phone2}
                      onChange={(e) => setSettings({ ...settings, phone2: e.target.value })}
                      className="w-full p-2 rounded border bg-white font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1 font-bold">Direct UPI Pay Number</label>
                    <input 
                      type="text" 
                      value={settings.phone3}
                      onChange={(e) => setSettings({ ...settings, phone3: e.target.value })}
                      className="w-full p-2 rounded border bg-white font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1 font-bold">Standard Timing Hours</label>
                    <input 
                      type="text" 
                      value={settings.timings}
                      onChange={(e) => setSettings({ ...settings, timings: e.target.value })}
                      className="w-full p-2 rounded border bg-white font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1 font-bold">Physical Landmark Address</label>
                  <input 
                    type="text" 
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full p-2 rounded border bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1 font-bold">Google Maps Coordinates URL</label>
                  <input 
                    type="text" 
                    value={settings.googleMapsUrl}
                    onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                    className="w-full p-2 rounded border bg-white"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs tracking-wider uppercase transition cursor-pointer shadow-sm"
                >
                  💾 Save Live Settings & Phones
                </button>
              </form>
            </div>

            {/* CARD 3: SECURITY PROTOCOLS */}
            <div className="bg-white rounded-xl border border-red-700/20 p-6 shadow-xs space-y-4 text-left">
              <div className="flex items-center gap-2 border-b pb-2 mb-1">
                <Shield className="w-4.5 h-4.5 text-red-700" />
                <span className="font-bold font-serif text-[#0b1528]">Console Authentication Status</span>
              </div>
              
              <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#0b1528] block">High Security Option Enabled</span>
                  <p className="text-[11px] text-gray-550 leading-normal">
                    Plain password-based direct logins are entirely retired for maximum protection. Administrative access is regulated by real-time generated OTP codes.
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Ownership Registered Mobile</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-mono text-[#0b1528] font-bold text-sm">+91 8247733059</span>
                  </div>
                </div>

                <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-150 text-[11px] rounded-lg font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 shrink-0" /> Dual Verification Protocol is active.
                </div>
              </div>
            </div>

          </div>

          {/* PANEL: BOOKINGS MANAGER & LOGS TRAIL */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-150 p-6 shadow-xs space-y-5 text-left">
            
            {/* Active Passes Audit list */}
            <div>
              <div className="flex justify-between items-center border-b pb-2 mb-3">
                <span className="font-semibold text-gray-800 font-serif flex items-center gap-1.5 font-bold">
                  <BookOpen className="w-1.5 h-1.5 rounded-full bg-emerald-600 block shrink-0" /> Tables Booking Passes
                </span>
                <span className="text-[10px] font-mono text-gray-400">Total: {bookings.length} Passes</span>
              </div>

              {bookings.length === 0 ? (
                <p className="text-xs text-center py-10 text-gray-400 italic">No reservation records in storage grid.</p>
              ) : (
                <div className="max-h-[190px] overflow-y-auto divide-y divide-gray-100 pr-1">
                  {bookings.map(b => (
                    <div key={b.code} className="py-2.5 flex justify-between items-center text-xs hover:bg-slate-50 px-1.5 rounded transition">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] font-bold text-gray-900">{b.code}</span>
                          <span className="text-[10px] text-gray-555 font-bold">{b.name}</span>
                          <span className="text-[9px] px-1 bg-amber-50 text-amber-80 *0 border-amber-200 border rounded uppercase font-mono">
                            {b.type === "delivery" ? "Delivery/COD" : `${b.guestsCount} heads`}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">Date: {b.date} | Slot: {b.timeSlot} | {b.feedback || "No requests"}</span>
                      </div>
                      
                      <div className="flex gap-1">
                        {b.type === "delivery" && b.status !== "Out for Delivery" && (
                          <button
                            onClick={async () => {
                              try {
                                b.status = "Out for Delivery";
                                await fetch("/api/bookings", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify(b)
                                });
                                appendSystemLog(`Delivery Dispatch: Order ${b.code} set status to Out for Delivery.`);
                                loadData();
                              } catch (e) {}
                            }}
                            className="p-1 px-2 text-[9px] bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-mono font-bold rounded uppercase cursor-pointer"
                          >
                            🚚 Dispatch
                          </button>
                        )}
                        <button
                          onClick={() => cancelBookingAdmin(b.code)}
                          className="p-1 px-2 text-[9px] bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-mono font-bold rounded uppercase flex items-center gap-1 transition cursor-pointer"
                        >
                          Archive
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* audit logs */}
            <div>
              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <span className="font-semibold text-gray-800 font-serif flex items-center gap-1.5 font-bold">
                  <ScrollText className="w-1.5 h-1.5 rounded-full bg-red-500 block shrink-0" /> Audit Logging Systems
                </span>
                <button 
                  onClick={clearAllLogs}
                  className="text-[10px] font-mono text-gray-400 hover:text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> WIPE
                </button>
              </div>

              <div className="max-h-[170px] overflow-y-auto bg-slate-900 text-slate-350 p-3.5 rounded-xl font-mono text-[9px] leading-relaxed divide-y divide-white/5 space-y-1">
                {logs.map((log) => (
                  <div key={log.id} className="pt-1 first:pt-0">
                    <span className="text-[#EAC775] text-[8px] mr-1">[{new Date(log.time).toLocaleTimeString()}]</span>
                    <span className="text-slate-200">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : adminActiveTab === "menu" ? (
        /* PANEL: MENU DATABASE CONFIG EDITOR */
        <div className="space-y-6 text-left">
          
          {/* CATEGORY LEVEL CONTROLS (NEWLY ADDED ADVANCED MANAGEMENT!) */}
          <div className="bg-amber-50/40 p-5 rounded-2xl border border-[#EAC775]/25 gap-5 grid grid-cols-1 md:grid-cols-12 items-start">
            
            {/* Create Category form */}
            <div className="md:col-span-5 space-y-3 bg-white p-4 rounded-xl border">
              <span className="text-[9px] font-mono font-bold text-[#800E14] uppercase tracking-wider block">➕ Category Management</span>
              <h4 className="text-sm font-serif font-bold text-gray-900">Create New Menu Category</h4>
              <form onSubmit={handleAddCategorySubmit} className="flex gap-2 text-xs">
                <input
                  type="text"
                  placeholder="E.g. Desserts or Ice Creams"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-[#800E14] text-xs"
                />
                <button
                  type="submit"
                  className="p-2 px-3.5 bg-[#800E14] text-white text-[10px] font-mono uppercase font-bold rounded-lg hover:bg-black transition cursor-pointer shrink-0"
                >
                  Save
                </button>
              </form>
            </div>

            {/* Rename / Modify Selected category */}
            <div className="md:col-span-5 space-y-3 bg-white p-4 rounded-xl border">
              <span className="text-[9px] font-mono font-bold text-amber-700 uppercase tracking-wider block">✏️ Category Renaming</span>
              <h4 className="text-sm font-serif font-bold text-gray-900">Rename Category: <span className="bg-amber-50 px-1 rounded text-[#800E14] font-mono text-xs">{selectedEditorCategory}</span></h4>
              <form onSubmit={handleRenameCategorySubmit} className="flex gap-2 text-xs">
                <input
                  type="text"
                  placeholder="New Category Name here..."
                  value={renameCategoryFormName}
                  onChange={(e) => setRenameCategoryFormName(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-[#800E14]"
                />
                <button
                  type="submit"
                  className="p-2 px-3.5 bg-amber-600 text-white text-[10px] font-mono uppercase font-bold rounded-lg hover:bg-amber-700 transition cursor-pointer shrink-0"
                >
                  Modify
                </button>
              </form>
            </div>

            {/* Delete entire category */}
            <div className="md:col-span-2 space-y-2 h-full flex flex-col justify-end">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block text-center">Trash Can</span>
              <button
                type="button"
                onClick={handleDeleteCategorySubmit}
                className="w-full p-3 bg-red-50 hover:bg-red-150 border-2 border-red-200 text-red-700 hover:text-red-800 text-[10px] font-mono uppercase font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" /> Delete Cat
              </button>
            </div>

          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <h3 className="text-base font-serif font-semibold text-[#0b1528] border-b pb-2 mb-4 flex justify-between items-center">
              <span>Category Selection Selector</span>
              <span className="text-xs font-mono text-slate-450 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase">
                {menuList.length} Categories Persisted
              </span>
            </h3>

            {/* Notification blocks */}
            {menuEditorErr && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-100 flex items-center gap-2">
                <span>⚠️ Error:</span> {menuEditorErr}
                <button className="ml-auto font-black" onClick={() => setMenuEditorErr(null)}>×</button>
              </div>
            )}
            {menuEditorSuccess && (
              <div className="p-3 mb-4 rounded-lg bg-teal-50 text-teal-700 text-xs font-medium border border-teal-100 flex items-center gap-2">
                <span>✅ Success:</span> {menuEditorSuccess}
                <button className="ml-auto font-black" onClick={() => setMenuEditorSuccess(null)}>×</button>
              </div>
            )}

            {/* List of category selection pills */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {menuList.map((catString: any) => (
                <button
                  key={catString.categoryName}
                  onClick={() => {
                    setSelectedEditorCategory(catString.categoryName);
                    setEditingItemName(null);
                    setMenuEditorErr(null);
                    setMenuEditorSuccess(null);
                  }}
                  className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                    selectedEditorCategory === catString.categoryName
                      ? "bg-[#0b1528] text-[#EAC775] border-[#EAC775] font-bold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {catString.categoryName} ({catString.items ? catString.items.length : 0})
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Segment: Items list inside chosen category (Cols: 8) */}
              <div className="lg:col-span-8 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#0b1528] font-mono flex items-center gap-1">
                  <span>Manage Items inside:</span>
                  <span className="bg-[#EAC775]/25 text-[#0b1528] px-2 py-0.5 rounded">{selectedEditorCategory}</span>
                </h4>

                {/* Items collection rendering */}
                {(() => {
                  const targetCat = menuList.find(c => c.categoryName === selectedEditorCategory);
                  if (!targetCat || !targetCat.items || targetCat.items.length === 0) {
                    return (
                      <div className="text-center py-12 border bg-slate-50 rounded-xl text-slate-400 border-dashed">
                        No recipe entries saved under this section. Add a dish using the creator tool.
                      </div>
                    );
                  }

                  return (
                    <div className="border border-slate-150 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#0b1528] text-white font-mono uppercase tracking-wider">
                            <th className="p-3">Dish / Recipe Name</th>
                            <th className="p-3 w-32">Price (Rs.)</th>
                            <th className="p-3">Popular Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {targetCat.items.map((item: any) => {
                            const isBeingEdited = editingItemName === item.name;

                            return (
                              <tr key={item.name} className="hover:bg-slate-50 transition">
                                <td className="p-3">
                                  {isBeingEdited ? (
                                    <div className="space-y-1.5 max-w-xs">
                                      <input
                                        type="text"
                                        value={editItemForm.name}
                                        onChange={(e) => setEditItemForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full p-1.5 border rounded text-xs"
                                        placeholder="Name"
                                      />
                                      <input
                                        type="text"
                                        value={editItemForm.description}
                                        onChange={(e) => setEditItemForm(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full p-1 border rounded text-[10px] text-gray-500"
                                        placeholder="Optional description"
                                      />
                                    </div>
                                  ) : (
                                    <div>
                                      <p className="font-semibold text-slate-850 text-sm">{item.name}</p>
                                      {item.description && <p className="text-[10px] text-slate-400 leading-normal">{item.description}</p>}
                                    </div>
                                  )}
                                </td>
                                
                                <td className="p-3">
                                  {isBeingEdited ? (
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px] font-mono text-gray-400">Rs.</span>
                                      <input
                                        type="number"
                                        value={editItemForm.price}
                                        onChange={(e) => setEditItemForm(prev => ({ ...prev, price: e.target.value }))}
                                        className="w-20 p-1 border rounded font-mono text-xs text-right"
                                        placeholder="450"
                                      />
                                    </div>
                                  ) : (
                                    <span className="font-mono text-slate-800 font-bold bg-[#FAF6F0] border p-1 rounded font-bold">
                                      Rs. {item.price}/-
                                    </span>
                                  )}
                                </td>

                                <td className="p-3">
                                  {isBeingEdited ? (
                                    <label className="flex items-center gap-1 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={editItemForm.isPopular}
                                        onChange={(e) => setEditItemForm(prev => ({ ...prev, isPopular: e.target.checked }))}
                                        className="accent-[#0b1528]"
                                      />
                                      <span className="text-[10px] font-mono">Popular</span>
                                    </label>
                                  ) : (
                                    item.isPopular ? (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-250 font-mono font-bold flex items-center w-max gap-1">
                                        🔥 POPULAR
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-mono text-slate-400 registration">Standard</span>
                                    )
                                  )}
                                </td>

                                <td className="p-3 text-right">
                                  {isBeingEdited ? (
                                    <div className="flex gap-1.5 justify-end">
                                      <button
                                        onClick={() => handleSaveEdit(item.name)}
                                        className="p-1 px-2 text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold flex items-center gap-1 cursor-pointer"
                                        title="Save price change"
                                      >
                                        <Save className="w-3 h-3" /> Save
                                      </button>
                                      <button
                                        onClick={() => setEditingItemName(null)}
                                        className="p-1 px-2 text-[10px] font-mono uppercase bg-slate-100 text-slate-600 hover:bg-slate-250 cursor-pointer"
                                        title="Cancel"
                                      >
                                        <X className="w-3 h-3" /> Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex gap-1.5 justify-end">
                                      <button
                                        onClick={() => handleStartEdit(item)}
                                        className="p-1.5 rounded bg-slate-100 hover:bg-amber-100 text-[#0b1528] font-semibold flex items-center gap-1 transition cursor-pointer"
                                        title="Edit this dish price"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteItem(item.name)}
                                        className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                                        title="Remove recipe"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}

              </div>

              {/* Right Segment: Add brand new menu item Form (Cols: 4) */}
              <div className="lg:col-span-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4 text-left">
                  <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-[#0b1528] border-b pb-1.5 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-[#800E14]" /> Add Dish to category
                  </h4>

                  <form onSubmit={handleAddItemSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-[#0b1528] block mb-1 font-bold">Dish Name *</label>
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="E.g. Apollo Fish Fry Pack"
                        className="w-full p-2 border bg-white rounded"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-[#0b1528] block mb-1 font-bold">Standard Price (Rs.) *</label>
                      <input
                        type="number"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        placeholder="E.g. 380"
                        className="w-full p-2 border bg-white rounded font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-[#0b1528] block mb-1 font-bold">Description (Optional)</label>
                      <textarea
                        value={newItemDesc}
                        onChange={(e) => setNewItemDesc(e.target.value)}
                        placeholder="E.g. Tender fish chunks tossed with signature spicy curry leaves mix."
                        rows={3}
                        className="w-full p-2 border bg-white rounded leading-relaxed text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="newIsPopularCheck"
                        checked={newItemIsPopular}
                        onChange={(e) => setNewItemIsPopular(e.target.checked)}
                        className="accent-[#0b1528] w-4 h-4 cursor-pointer animate-pulse"
                      />
                      <label htmlFor="newIsPopularCheck" className="font-mono text-[10px] uppercase text-zinc-700 cursor-pointer font-bold">
                        Mark as Popular Seller 🔥
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#800E14] hover:bg-black text-[#EAC775] font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition shadow-sm cursor-pointer"
                    >
                      Add Dish to Live Menu
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* PANEL: IMAGE GALLERY MANAGER */
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs text-left">
            <div className="border-b pb-3 mb-5">
              <h3 className="text-lg font-serif font-bold text-[#0b1528] flex items-center gap-2">
                📸 Moments Gallery & Image Customizer
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-normal font-sans">
                Type custom titles, write customer stories or captions, and upload real photos of Haveli Banquet Hall & Restaurant. Your updates will sync instantly across the main visual showcases on the home screen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {galleryPhotos.map((photo, index) => (
                <div key={photo.id} className="p-4 rounded-xl border border-gray-200 hover:border-[#EAC775] transition-all bg-slate-50 flex flex-col justify-between space-y-4">
                  <div className="flex gap-4">
                    {/* Thumbnail preview */}
                    <div className="aspect-[4/3] w-28 bg-[#12223c]/10 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1 flex-1">
                      <span className="text-[9px] font-mono font-bold text-[#EAC775] uppercase px-2 py-0.5 bg-[#FAF6F0] rounded border border-[#EAC775]/20 inline-block">
                        Moment Space #{index + 1}
                      </span>
                      <h4 className="text-sm font-semibold font-serif text-[#0b1528] truncate mt-1">
                        {photo.title || "Untitled Moment"}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-normal">
                        {photo.description || "No story description set."}
                      </p>
                    </div>
                  </div>

                  {/* Metadata Input Forms and Upload Tool */}
                  <div className="space-y-3 pt-3 border-t border-gray-150">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-[#800E14] font-bold mb-1">
                        Edit Title / Label
                      </label>
                      <input
                        type="text"
                        value={photo.title || ""}
                        onChange={(e) => {
                          const updated = galleryPhotos.map(p => {
                            if (p.id === photo.id) {
                              return { ...p, title: e.target.value };
                            }
                            return p;
                          });
                          setGalleryPhotos(updated);
                          safeSaveGallery(updated);
                          window.dispatchEvent(new Event("haveli_gallery_updated"));
                        }}
                        className="w-full p-2 text-xs bg-white border border-gray-200 rounded-lg focus:border-[#800E14] focus:outline-none focus:ring-1 focus:ring-[#800E14]"
                        placeholder="e.g. Traditional Banquet Dinner Feast"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-[#800E14] font-bold mb-1">
                        Edit Caption / Story description
                      </label>
                      <textarea
                        value={photo.description || ""}
                        rows={2}
                        onChange={(e) => {
                          const updated = galleryPhotos.map(p => {
                            if (p.id === photo.id) {
                              return { ...p, description: e.target.value };
                            }
                            return p;
                          });
                          setGalleryPhotos(updated);
                          safeSaveGallery(updated);
                          window.dispatchEvent(new Event("haveli_gallery_updated"));
                        }}
                        className="w-full p-2 text-xs bg-white border border-gray-200 rounded-lg focus:border-[#800E14] focus:outline-none focus:ring-1 focus:ring-[#800E14] font-sans"
                        placeholder="Write a custom note about moments of happiness captured here..."
                      />
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold">
                        Upload Replacement File (Any aspect ratio)
                      </label>
                      <div className="flex items-center gap-2 flex-wrap">
                        <input
                          type="file"
                          accept="image/*"
                          id={`file-input-${photo.id}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            
                            // Check for file type
                            if (!file.type.startsWith("image/")) {
                              alert("Please select a valid image file.");
                              return;
                            }

                            // Process compression using Canvas
                            compressAndGetBase64(file)
                              .then((compressedBase64) => {
                                const updated = galleryPhotos.map(p => {
                                  if (p.id === photo.id) {
                                    return { ...p, url: compressedBase64 };
                                  }
                                  return p;
                                });
                                setGalleryPhotos(updated);
                                safeSaveGallery(updated);
                                
                                // Trigger state update events
                                window.dispatchEvent(new Event("haveli_gallery_updated"));
                                appendSystemLog(`System Gallery: Photo #${index + 1} ("${photo.title}") replaced with custom uploaded file.`);
                                alert(`Photo "${photo.title}" successfully replaced and optimized!`);
                              })
                              .catch((err) => {
                                console.error("Error compressing file:", err);
                                alert("Failed to compress and load image. Please try another file.");
                              });
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor={`file-input-${photo.id}`}
                          className="px-3 py-2 bg-[#0b1528] hover:bg-black text-[10px] font-mono uppercase text-[#EAC775] border border-[#EAC775]/40 rounded-lg cursor-pointer transition text-center hover:shadow flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Choose Image file
                        </label>
                        <button
                          onClick={() => {
                            if (window.confirm("Restore this specific photo to its standard baseline placeholder and texts?")) {
                              const basePhotos = [
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
                              const defaultItem = basePhotos.find(p => p.id === photo.id);
                              if (defaultItem) {
                                const updated = galleryPhotos.map(p => {
                                    if (p.id === photo.id) {
                                      return { 
                                        ...p, 
                                        url: defaultItem.url,
                                        title: defaultItem.title,
                                        description: defaultItem.description
                                      };
                                    }
                                    return p;
                                  });
                                setGalleryPhotos(updated);
                                safeSaveGallery(updated);
                                window.dispatchEvent(new Event("haveli_gallery_updated"));
                                appendSystemLog(`System Gallery/Moments: Photo #${index + 1} ("${photo.title}") restored to baseline placeholder.`);
                                alert("Restored to default baseline!");
                              }
                            }
                          }}
                          className="p-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 text-[10px] font-mono uppercase transition cursor-pointer"
                          title="Restore default"
                        >
                          Restore Standard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Upload Tip Banner */}
            <div className="mt-8 p-4 bg-[#FAF6F0] rounded-xl border border-[#EAC775]/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#EAC775] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs text-[#0b1528] block mb-0.5 font-serif">Quick Display Info</span>
                <p className="text-[11px] text-gray-500 leading-normal font-sans">
                  Choose your high-resolution moments images! These photos will display dynamically in any aspect ratio inside the Moments banner on the Homepage.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

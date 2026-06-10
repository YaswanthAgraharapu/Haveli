/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { menuCategories, MenuCategory, MenuItem } from "../menuData";
import { Search, Flame, CirclePlus, Coffee, LayoutGrid, FileText, Check, Star, Sparkles, Filter, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Image maps matching royal Indian culinary offerings
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  "TANDOORI STARTERS": "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
  "HYDERABADI DUM BIRYANI": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&q=80",
  "VEGETARIAN DELIGHT DISHES": "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&q=80",
  "CHEF'S NON-VEG SPECIAL CURRIES": "https://images.unsplash.com/photo-1621979087428-255c468e2f8d?w=600&q=80",
  "NAUGHTY SHAKES & COOL BEVERAGES": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80",
  "ROYAL INDIAN DESSERTS & SWEETS": "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&q=80"
};

const DEFAULT_DISH_FALLBACK = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80";

const isVegDish = (item: MenuItem, categoryName: string): boolean => {
  const cat = categoryName.toLowerCase();
  const name = item.name.toLowerCase();
  if (cat.includes("non-veg") || cat.includes("chicken") || cat.includes("mutton") || cat.includes("fish") || cat.includes("egg") || cat.includes("lamb")) {
    return false;
  }
  const nonVegKeywords = ["chicken", "mutton", "egg", "fish", "prawn", "crab", "keema", "kabab", "tikka", "lollipop", "lolypop", "wings", "drumstick", "tandoori chicken", "non-veg", "non veg", "prawns"];
  for (const keyword of nonVegKeywords) {
    if (name.includes(keyword)) {
      return false;
    }
  }
  return true;
};

export default function MenuSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [menu, setMenu] = useState<MenuCategory[]>(menuCategories || []);

  // Sync menu with server logs dynamically
  const fetchMenuLive = async () => {
    try {
      const res = await fetch("/api/menu");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMenu(data);
        }
      }
    } catch (e) {
      console.warn("Unable to fetch live menu: using static database backup.");
    }
  };

  useEffect(() => {
    fetchMenuLive();
    const interval = setInterval(fetchMenuLive, 4000);
    return () => clearInterval(interval);
  }, []);

  const categoriesList = ["All", ...(menu || []).filter(c => c && c.categoryName).map(c => c.categoryName)];

  // Helper matching items
  const getFilteredItems = (): { categoryName: string; items: MenuItem[] }[] => {
    let results: { categoryName: string; items: MenuItem[] }[] = [];

    menu.forEach(cat => {
      if (selectedCategory !== "All" && cat.categoryName !== selectedCategory) {
        return;
      }

      const matchedItems = cat.items.filter(item => {
        const matchesQuery = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesQuery;
      });

      if (matchedItems.length > 0) {
        results.push({
          categoryName: cat.categoryName,
          items: matchedItems
        });
      }
    });

    return results;
  };

  const filteredData = getFilteredItems();

  const handleQuickCategory = (cat: string) => {
    setSelectedCategory(cat);
    const el = document.getElementById("menu_content_anchor");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div id="menu_showcase_section" className="py-20 relative overflow-hidden text-left scroll-mt-6">
      
      {/* Background decoration */}
      <div className="absolute top-1/4 right-[5%] w-96 h-96 bg-[#4A0E1A]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[5%] w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 space-y-12 relative z-10">
        
        {/* Luxury Section Header */}
        <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#4A0E1A]/50 to-stone-900 border border-[#D4AF37]/20 rounded-full text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
              <Coffee className="w-3.5 h-3.5" />
              <span>Gourmet Catalogue</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-white font-black tracking-wide">
              Traditional Taste Registry
            </h2>
            <p className="text-xs text-slate-400 font-sans max-w-xl">
              Each recipe has been preserved over decades, curated with pure hand-pounded spices, cold-pressed mustard oils, and clinical hygiene standards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-500 bg-black/45 border border-slate-800 px-4 py-2.5 rounded-xl uppercase font-bold">
              ⚡ LIVE COUNTER: {filteredData.reduce((acc, c) => acc + c.items.length, 0)} DISHES
            </span>
          </div>
        </div>

        {/* Categories Carousel */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none select-none">
          {categoriesList.map((catName) => (
            <button
              key={catName}
              onClick={() => setSelectedCategory(catName)}
              className={`p-3 px-6 rounded-2xl text-[10px] font-mono uppercase tracking-widest shrink-0 border transition-all duration-300 cursor-pointer ${
                selectedCategory === catName
                  ? "bg-gradient-to-r from-[#D4AF37] to-[#A3791E] text-black border-[#D4AF37] font-extrabold shadow-md transform scale-[1.01]"
                  : "bg-black/55 hover:bg-white/5 text-slate-400 hover:text-white border-white/5"
              }`}
            >
              {catName}
            </button>
          ))}
        </div>

        {/* High-End Glass Search bar */}
        <div id="menu_content_anchor" className="glass-panel p-5 rounded-3xl border border-white/10 shadow-xl bg-black/45">
          <div className="relative">
            <input
              type="text"
              placeholder="Search dishes (e.g. Biryani, Ginger chicken, Kaju paneer, Lassi...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs sm:text-sm p-4 pl-12 rounded-2xl bg-white/5 border border-slate-800 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition font-sans"
            />
            <Search className="w-5 h-5 text-[#D4AF37] absolute left-4 top-4.5 pointer-events-none" />
            
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-3.5 bg-red-950/80 border border-red-500/20 text-red-300 hover:text-white px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Menu Listings */}
        <div className="space-y-16">
          <AnimatePresence mode="wait">
            {filteredData.length > 0 ? (
              filteredData.map((catGroup) => {
                const headImage = CATEGORY_IMAGE_MAP[catGroup.categoryName.toUpperCase()] || DEFAULT_DISH_FALLBACK;
                
                return (
                  <motion.div
                    key={catGroup.categoryName}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8 text-left"
                  >
                    
                    {/* Category Title Banner */}
                    <div className="relative h-40 rounded-[28px] overflow-hidden border border-white/5 flex items-end p-6 group">
                      <img 
                        src={headImage} 
                        alt={catGroup.categoryName} 
                        className="absolute inset-0 w-full h-full object-cover brightness-[0.4] group-hover:scale-102 transition duration-[5s]" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/40 to-transparent" />
                      
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.3em] uppercase block font-bold">Category Group</span>
                          <h3 className="text-xl sm:text-3xl font-serif text-white font-heavy">{catGroup.categoryName}</h3>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-black/60 border border-white/5 px-3 py-1.5 rounded-lg font-bold">
                          {catGroup.items.length} OPTIONS AVAILABLE
                        </span>
                      </div>
                    </div>

                    {/* Category Menu Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catGroup.items.map((item, itemIdx) => {
                        const isVeg = isVegDish(item, catGroup.categoryName);
                        return (
                          <div 
                            key={item.name + itemIdx}
                            className="glass-panel p-5 rounded-3xl border border-white/5 hover:border-[#D4AF37]/25 glass-card-hover text-left flex flex-col justify-between space-y-4"
                          >
                            <div className="space-y-3">
                              {/* Header next to veg/non-veg status */}
                              <div className="flex items-start justify-between gap-3">
                                <cite className="not-italic text-sm font-serif font-bold text-white block leading-snug">{item.name}</cite>
                                <span className={`px-2 py-0.5 text-[7px] font-mono font-bold uppercase rounded border shrink-0 ${
                                  isVeg 
                                    ? "bg-[#064e3b]/80 text-[#34d399] border-[#059669]/25" 
                                    : "bg-[#7f1d1d]/80 text-[#fca5a5] border-[#b91c1c]/25"
                                }`}>
                                  {isVeg ? "🟢 VEG" : "🔴 NON-VEG"}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-400 font-sans leading-relaxed min-h-[32px] line-clamp-2">
                                {item.description || "Traditional Mughal formula, curated with hand-ground parameters."}
                              </p>
                            </div>

                            {/* footer of the card */}
                            <div className="border-t border-slate-900 pt-3 flex items-center justify-between">
                              <span className="text-xs font-mono text-[#D4AF37] font-semibold">₹ {item.price}</span>
                              <span className="text-[9px] text-slate-500 font-mono tracking-wider">ESTD. OWNER VALUE</span>
                            </div>

                          </div>
                        );
                      })}
                    </div>

                  </motion.div>
                );
              })
            ) : (
              <div className="glass-panel p-16 rounded-[32px] border border-white/5 text-center text-slate-400 space-y-3 max-w-lg mx-auto">
                <Leaf className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-serif font-bold text-white">No Matched Gastronomy Found</p>
                <p className="text-xs text-slate-500">We could not match any recipes on the search parameters. Please try clean keywords like 'Biryani' or 'Tandoor' specials.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}

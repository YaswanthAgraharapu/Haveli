/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { menuCategories, MenuCategory, MenuItem } from "../menuData";
import { Search, Flame, CirclePlus, Coffee, LayoutGrid, FileText, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function MenuSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [menu, setMenu] = useState<MenuCategory[]>(menuCategories);

  // Sync menu with server
  const fetchMenuLive = async () => {
    try {
      const res = await fetch("/api/menu");
      if (res.ok) {
        const data = await res.json();
        setMenu(data);
      }
    } catch (e) {
      console.warn("Unable to fetch live menu: using static database backup.");
    }
  };

  useEffect(() => {
    fetchMenuLive();
    const interval = setInterval(fetchMenuLive, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filter out distinct category names
  const categoriesList = ["All", ...menu.map(c => c.categoryName)];

  // Helper filter logic
  const getFilteredItems = (): { categoryName: string; items: MenuItem[] }[] => {
    let results: { categoryName: string; items: MenuItem[] }[] = [];

    menu.forEach(cat => {
      // Direct category filter match
      if (selectedCategory !== "All" && cat.categoryName !== selectedCategory) {
        return;
      }

      // Filter individual items
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
    // Smooth scroll down to internal anchor
    const el = document.getElementById("menu_content_anchor");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div id="menu_showcase_section" className="py-16 bg-[#FAF6F0]/40 border-b border-[#EAC775]/25 relative scroll-mt-6">
      
      {/* Visual background accents */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-amber-200/10 rounded-full blur-xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Curated menu title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 pb-5 border-b border-gray-250/25">
          <div>
            <div className="flex items-center gap-1.5 text-[#EAC775] mb-2 font-mono text-xs font-semibold uppercase tracking-widest">
              <Coffee className="w-5 h-5" />
              <span>Premium Dining Registry</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#0b1528] tracking-wide">
              Traditional Multi-Cuisine Menu
            </h2>
            <p className="text-sm text-gray-500 mt-1 font-sans">
              Corrected OCR specifications precisely registered to protect authentic pricing. Use Search to filter.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href="#seo_analyst_section"
              className="flex items-center gap-1.5 bg-slate-900/5 hover:bg-[#EAC775]/25 text-[#0b1528] px-4.5 py-2.5 rounded-lg border border-[#EAC775]/25 text-xs font-mono font-bold transition"
            >
              <FileText className="w-4 h-4" /> Download Markdown/JSON Menu
            </a>
          </div>
        </div>

        {/* Global Toolbar: Search bar & Quick actions */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAC775]/20 shadow-md mb-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search bar */}
          <div className="relative md:col-span-8">
            <input
              type="text"
              placeholder="Search dishes (e.g. Ulavacharu, Mutton Biryani, Cashewnut paneer, lassi...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs sm:text-sm p-3.5 pl-10 rounded-xl border border-gray-200 focus:border-[#EAC775] focus:outline-none focus:ring-1 focus:ring-[#EAC775] transition"
            />
            <Search className="w-4.5 h-4.5 text-[#EAC775] absolute left-3.5 top-4 pointer-events-none" />
          </div>

          {/* Quick Clear controls */}
          <div className="flex gap-2 justify-end md:col-span-4">
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-xs text-red-600 hover:underline px-3 py-1 bg-red-50 border border-red-150 rounded-lg shrink-0"
              >
                Clear Search
              </button>
            )}
            <span className="text-xs font-mono text-gray-400 bg-slate-50 border px-3.5 py-2.5 rounded-lg">
              Found: {filteredData.reduce((acc, c) => acc + c.items.length, 0)} Items
            </span>
          </div>
        </div>

        {/* Categories Pills bar (H-Scrolling list) */}
        <div className="mb-10 overflow-x-auto pb-3 flex items-center gap-2 px-1 select-none whitespace-nowrap scrollbar-thin">
          {categoriesList.map(catName => (
            <button
              key={catName}
              onClick={() => setSelectedCategory(catName)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition ${
                selectedCategory === catName
                  ? "bg-[#0b1528] text-[#FAF6F0] shadow-md border-b-2 border-[#EAC775]"
                  : "bg-white text-gray-600 border border-slate-200 hover:bg-[#FAF6F0] hover:text-[#0b1528]"
              }`}
            >
              {catName === "All" ? "🏡 Complete Catalog" : catName}
            </button>
          ))}
        </div>

        {/* Dynamic Items Listing Grid view (Bento Style card templates) */}
        <div id="menu_content_anchor" className="space-y-12 scroll-mt-6">
          <AnimatePresence mode="popLayout">
            {filteredData.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed text-gray-400"
              >
                <div className="text-3xl mb-2">🍽️</div>
                <h4 className="text-base text-gray-700 font-serif">No matches found for your search.</h4>
                <p className="text-xs mt-1 leading-normal max-w-sm mx-auto">Try typing another recipe, or select "Complete Catalog" to reset all categories.</p>
              </motion.div>
            ) : (
              filteredData.map((cat, catIdx) => (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIdx * 0.04 }}
                  key={cat.categoryName}
                  className="space-y-4"
                >
                  {/* Category Title Header */}
                  <div className="flex items-center gap-3 border-l-4 border-[#EAC775] pl-3">
                    <h3 className="text-xl font-serif text-[#0b1528] font-bold tracking-wide">
                      {cat.categoryName}
                    </h3>
                    <span className="text-[10px] font-mono text-gray-400 bg-white border border-gray-200 rounded-full px-2.5 py-0.5">
                      {cat.items.length} items
                    </span>
                  </div>

                  {/* Gri layout of individual menu cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {cat.items.map((item, itemIdx) => (
                      <div
                        key={`${item.name}-${itemIdx}`}
                        className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 hover:border-[#EAC775]/50 hover:shadow-lg transition-all duration-300 flex justify-between items-start gap-4 shadow-sm relative overflow-hidden group"
                      >
                        {item.isPopular && (
                          <div className="absolute top-0 right-0 bg-[#0b1528] text-[#EAC775] text-[8px] font-bold font-mono uppercase tracking-widest px-2 py-1 rounded-bl border-l border-b border-[#EAC775]/20 animate-pulse flex items-center gap-1">
                            <Flame className="w-3 h-3 text-[#EAC775] fill-[#EAC775]" /> Star Choice
                          </div>
                        )}

                        <div className="space-y-1 text-left">
                          <h4 className="font-serif font-bold text-[#0b1528] text-base leading-tight">
                            {item.name}
                          </h4>
                          
                          <p className="text-xs text-gray-500 leading-relaxed font-sans max-w-sm">
                            {item.description || "Freshly simmered multi-cuisine delicacy featuring local herbs and fine culinary standards."}
                          </p>

                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[10px] font-mono uppercase text-[#EAC775] font-semibold bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#EAC775]/20">
                              {cat.categoryName === "Indian Breads" || cat.categoryName === "Beverages" ? "Vegetarian" : cat.categoryName.includes("Veg") && !cat.categoryName.includes("Non-Veg") ? "Vegetarian" : "Non-Vegetarian"}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">Markapur Cuisine</span>
                          </div>
                        </div>

                        {/* Cost tags */}
                        <div className="text-right shrink-0 flex flex-col items-end justify-between h-full pt-1.5">
                          <span className="text-[#0b1528] font-mono font-bold text-base bg-[#FAF6F0] hover:bg-[#EAC775]/25 border border-[#EAC775]/25 px-3 py-1 rounded-xl transition">
                            ₹{item.price}
                          </span>
                          <span className="text-[9px] font-mono text-gray-400 mt-2 block">Prices Exclude Tax</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

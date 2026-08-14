import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCatContext } from '../context/CatContext';
import { Sparkles, ChevronDown, Check, X, Tag, Cat, Filter, Touchpad, HelpCircle } from 'lucide-react';
import QuickFilterChips from './QuickFilterChips';

export default function CategorySlider() {
  const { categories, cats, selectedCategoryId, setSelectedCategoryId } = useCatContext();
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  // Helper to count cats per category
  const getCatCount = (catId) => {
    if (catId === null) return cats.length;
    return cats.filter(c => c.category_id === catId).length;
  };

  const selectedCategoryObj = categories.find(c => c.id === selectedCategoryId);
  const selectedName = selectedCategoryId === null ? 'All Cat Breeds' : (selectedCategoryObj?.name || 'All Cat Breeds');
  const selectedCount = getCatCount(selectedCategoryId);

  return (
    <>
      {/* High-Affordability Interactive Mobile Control Center */}
      <div className="p-3 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80 sticky top-14 z-20 backdrop-blur-xl space-y-2.5">
        <div className="max-w-7xl mx-auto space-y-2">
          
          {/* SECTION 1: PROMINENT CATEGORY SELECTION CARD (CLICK ME DESIGN) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] uppercase font-mono font-extrabold text-amber-400 tracking-wider flex items-center gap-1">
                <Cat className="w-3 h-3 text-amber-400 animate-pulse" />
                1. Select Breed Category
              </span>
              <span className="text-[10px] text-slate-400 font-sans">
                {categories.length} Breeds Available
              </span>
            </div>

            {/* Main Interactive Breed Tile */}
            <button
              onClick={() => setIsCategorySheetOpen(true)}
              className="w-full relative group overflow-hidden p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border-2 border-amber-500/50 hover:border-amber-400 transition-all shadow-lg shadow-amber-500/10 active:scale-[0.99] text-left flex items-center justify-between gap-3"
            >
              {/* Subtle Ambient Gold Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-amber-500/0 opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex items-center gap-3 truncate">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                  <Cat className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-extrabold text-slate-100 font-serif truncate">
                      {selectedName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shrink-0">
                      {selectedCount} {selectedCount === 1 ? 'Cat' : 'Cats'}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-300/80 font-medium">
                    Tap to view all breed options 👇
                  </p>
                </div>
              </div>

              {/* Action Call to Click Badge */}
              <div className="relative z-10 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors shadow-sm">
                <span>CHANGE</span>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Full Native Bottom Sheet Category Picker Modal */}
      <AnimatePresence>
        {isCategorySheetOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategorySheetOpen(false)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-full max-w-lg bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 space-y-4 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
            >
              {/* Sheet Drag Handle */}
              <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto" />

              {/* Sheet Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Cat className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 font-serif gold-gradient-text">
                      Choose Cat Breed
                    </h3>
                    <p className="text-xs text-slate-400">Tap a category to filter listings</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCategorySheetOpen(false)}
                  className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* All Breeds Option Button */}
              <button
                onClick={() => {
                  setSelectedCategoryId(null);
                  setIsCategorySheetOpen(false);
                }}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all active:scale-[0.98] ${
                  selectedCategoryId === null
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-lg shadow-amber-500/15'
                    : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${selectedCategoryId === null ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-amber-400'}`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-extrabold font-serif">All Cat Breeds</h4>
                    <span className="text-xs text-slate-400">View complete cattery collection</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {getCatCount(null)} cats
                  </span>
                  {selectedCategoryId === null && <Check className="w-5 h-5 text-amber-400" />}
                </div>
              </button>

              {/* 2-Column Responsive Category Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {categories.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  const count = getCatCount(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategoryId(cat.id);
                        setIsCategorySheetOpen(false);
                      }}
                      className={`p-3.5 rounded-2xl border-2 flex flex-col justify-between space-y-2 text-left transition-all active:scale-[0.97] ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-lg shadow-amber-500/15'
                          : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-amber-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-extrabold line-clamp-1 font-serif">{cat.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>{count} available</span>
                        <span className="text-amber-400 text-[10px] font-bold">TAP ⚡</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

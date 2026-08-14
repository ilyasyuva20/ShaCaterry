import React, { useState } from 'react';
import Header from '../components/Header';
import CategorySlider from '../components/CategorySlider';
import QuickFilterChips from '../components/QuickFilterChips';
import SmartFilterDrawer from '../components/SmartFilterDrawer';
import CatCard from '../components/CatCard';
import CatDetailModal from '../components/CatDetailModal';
import PwaInstallBanner from '../components/PwaInstallBanner';
import { useCatContext } from '../context/CatContext';
import { RotateCcw, Cat, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { filteredCats, clearFilters, categories, selectedCategoryId } = useCatContext();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);

  const selectedCategoryName = selectedCategoryId
    ? categories.find(c => c.id === selectedCategoryId)?.name
    : 'All Cat Breeds';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-16">
      {/* Sticky Top Header */}
      <Header onOpenFilter={() => setIsFilterOpen(true)} />

      {/* Horizontal Category Chips */}
      <CategorySlider />

      {/* Quick 1-Tap Filter Bar */}
      <QuickFilterChips />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 space-y-4">
        {/* Results Header Banner */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-900 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-slate-200 font-serif tracking-wide">
              {selectedCategoryName}
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              ({filteredCats.length} {filteredCats.length === 1 ? 'listing' : 'listings'})
            </span>
          </div>

          {filteredCats.length < 10 && (
            <span className="text-[11px] text-amber-400/80 font-medium">
              Mobile Native View
            </span>
          )}
        </div>

        {/* Cats Grid Feed */}
        {filteredCats.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredCats.map((cat) => (
              <CatCard
                key={cat.id}
                cat={cat}
                onSelect={(c) => setSelectedCat(c)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 px-4 text-center space-y-4 bg-slate-900/40 rounded-3xl border border-slate-800/80 my-8">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Cat className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-slate-200 font-serif">No Cats Found</h3>
              <p className="text-xs text-slate-400">
                We couldn't find any cat matching your current search or filter criteria.
              </p>
            </div>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gold-gradient-bg text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 hover:opacity-90 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="mt-auto border-t border-slate-900 py-6 text-center text-slate-500 text-xs px-4 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <img src="/sha-cattery-logo.svg" alt="Sha Cattery" className="w-6 h-6 rounded-full border border-amber-500/40" />
          <p className="font-serif text-slate-300 font-bold">Sha Cattery © 2026 — Premium Pedigree Breeders</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <a
            href="https://www.instagram.com/sha_cattery"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 hover:text-pink-300 text-[11px] font-bold flex items-center gap-1 bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/30"
          >
            <span>Follow @sha_cattery on Instagram</span>
          </a>
        </div>
        <p className="text-[10px] text-slate-600">Mobile-First Progressive Web App (PWA)</p>
      </footer>

      {/* Filter Bottom Sheet Drawer */}
      <SmartFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      {/* Cat Profile Modal */}
      {selectedCat && (
        <CatDetailModal
          cat={selectedCat}
          onClose={() => setSelectedCat(null)}
        />
      )}

      {/* PWA Install Banner */}
      <PwaInstallBanner />
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { useCatContext } from '../context/CatContext';

export default function Header({ onOpenFilter }) {
  const { searchQuery, setSearchQuery, filterState, settings } = useCatContext();

  // Calculate active filter count
  const activeFiltersCount = [
    filterState.age,
    filterState.color,
    filterState.eyeColor,
    filterState.gender,
    filterState.statusAvailableOnly
  ].filter(Boolean).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto">
        {/* Top Branding Row */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <Link to="/" className="flex items-center gap-2.5 group">
            {/* Official Circular Logo */}
            <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-amber-500/50 p-0.5 overflow-hidden shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/sha-cattery-logo.svg"
                alt="Sha Cattery Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight gold-gradient-text font-serif">
                  {settings.catteryName || 'Sha Cattery'}
                </h1>
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded-full">
                  PWA
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider font-mono uppercase leading-tight">
                Royal Felines & Pedigree Kittens
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1.5">
            {/* Instagram Profile Direct Button */}
            <a
              href="https://www.instagram.com/sha_cattery"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-amber-500/15 border border-pink-500/30 hover:border-pink-400 text-pink-300 transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm"
              title="Visit Instagram @sha_cattery"
            >
              <svg className="w-4 h-4 fill-current text-pink-400" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="hidden sm:inline">Instagram</span>
            </a>
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Persian, Maine Coon, color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500/50 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-amber-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={onOpenFilter}
            className={`relative p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeFiltersCount > 0
                ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span className="hidden xs:inline">Filter</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-sm">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Check, Sparkles, Filter } from 'lucide-react';
import { useCatContext } from '../context/CatContext';

const COLOR_SUGGESTIONS = ['White', 'Blue', 'Silver', 'Brown', 'Seal Point', 'Chocolate', 'Black'];
const EYE_SUGGESTIONS = ['Blue', 'Amber', 'Green', 'Cyan', 'Copper'];

export default function SmartFilterDrawer({ isOpen, onClose }) {
  const { filterState, setFilterState, clearFilters } = useCatContext();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Bottom Sheet Drawer Container */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-lg bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl shadow-amber-500/10 z-10 max-h-[85vh] flex flex-col"
        >
          {/* Mobile Handle Bar */}
          <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mb-4" />

          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 font-serif">Smart Filters</h3>
                <p className="text-xs text-slate-400">Refine your cat breed preferences</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body - Scrollable */}
          <div className="py-4 space-y-5 overflow-y-auto pr-1 flex-1 text-xs">
            {/* Status Available Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div>
                <h4 className="font-semibold text-slate-200">Show Available Only</h4>
                <p className="text-[11px] text-slate-400">Hide sold out & reserved cats</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterState.statusAvailableOnly}
                  onChange={(e) => setFilterState(prev => ({ ...prev, statusAvailableOnly: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Gender Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {['', 'Male', 'Female'].map((gender) => (
                  <button
                    key={gender || 'any'}
                    type="button"
                    onClick={() => setFilterState(prev => ({ ...prev, gender }))}
                    className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                      filterState.gender === gender
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {gender || 'Any Gender'}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Filter */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Age Bracket</label>
              <select
                value={filterState.age}
                onChange={(e) => setFilterState(prev => ({ ...prev, age: e.target.value }))}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none"
              >
                <option value="">Any Age</option>
                <option value="days">Kittens under 60 days ("54 days", etc.)</option>
                <option value="month">Young (1-5 months)</option>
                <option value="year">Adult (1+ years)</option>
              </select>
            </div>

            {/* Color Tag / Input */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Fur Color</label>
              <input
                type="text"
                placeholder="Type or select color (e.g., White, Pointed, Blue)..."
                value={filterState.color}
                onChange={(e) => setFilterState(prev => ({ ...prev, color: e.target.value }))}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2 text-xs text-slate-200 mb-2 outline-none"
              />
              <div className="flex flex-wrap gap-1.5">
                {COLOR_SUGGESTIONS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setFilterState(prev => ({ ...prev, color: filterState.color === col ? '' : col }))}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
                      filterState.color.toLowerCase() === col.toLowerCase()
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Eye Color Tag Filter */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Eye Color</label>
              <div className="flex flex-wrap gap-1.5">
                {EYE_SUGGESTIONS.map((eye) => (
                  <button
                    key={eye}
                    type="button"
                    onClick={() => setFilterState(prev => ({ ...prev, eyeColor: filterState.eyeColor === eye ? '' : eye }))}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
                      filterState.eyeColor.toLowerCase() === eye.toLowerCase()
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {eye} Eye
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                clearFilters();
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl gold-gradient-bg text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              Apply Filters
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

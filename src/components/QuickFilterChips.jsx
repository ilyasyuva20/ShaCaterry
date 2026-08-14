import React from 'react';
import { useCatContext } from '../context/CatContext';
import { Sparkles, X, Check, Mars, Venus, Eye, Calendar, ShieldCheck, Filter } from 'lucide-react';

export default function QuickFilterChips() {
  const { filterState, setFilterState, clearFilters } = useCatContext();

  const isGenderMale = filterState.gender === 'Male';
  const isGenderFemale = filterState.gender === 'Female';
  const isUnder6Months = filterState.age === 'under6months';
  const isBlueEyes = filterState.eyeColor.toLowerCase() === 'blue';
  const isAvailableOnly = filterState.statusAvailableOnly;

  const hasActiveFilters = isGenderMale || isGenderFemale || isUnder6Months || isBlueEyes || isAvailableOnly;

  const toggleGender = (genderVal) => {
    setFilterState(prev => ({
      ...prev,
      gender: prev.gender === genderVal ? '' : genderVal
    }));
  };

  const toggleUnder6Months = () => {
    setFilterState(prev => ({
      ...prev,
      age: prev.age === 'under6months' ? '' : 'under6months'
    }));
  };

  const toggleBlueEyes = () => {
    setFilterState(prev => ({
      ...prev,
      eyeColor: prev.eyeColor.toLowerCase() === 'blue' ? '' : 'Blue'
    }));
  };

  const toggleAvailableOnly = () => {
    setFilterState(prev => ({
      ...prev,
      statusAvailableOnly: !prev.statusAvailableOnly
    }));
  };

  return (
    <div className="px-3 py-2.5 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md space-y-1.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-1">
        <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400 tracking-wider flex items-center gap-1">
          <Filter className="w-3 h-3 text-emerald-400 animate-pulse" />
          2. Tap Quick Feature Filters
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-[10px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30"
          >
            <X className="w-3 h-3" />
            Clear Active Filters
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {/* Male Quick Filter Button */}
        <button
          onClick={() => toggleGender('Male')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold shrink-0 flex items-center gap-1.5 transition-all shadow-md active:scale-95 border-2 ${
            isGenderMale
              ? 'bg-blue-500/25 text-blue-200 border-blue-400 shadow-blue-500/20'
              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
            <Mars className="w-3.5 h-3.5" />
          </div>
          <span>Male</span>
          {isGenderMale && <Check className="w-3.5 h-3.5 text-blue-400" />}
        </button>

        {/* Female Quick Filter Button */}
        <button
          onClick={() => toggleGender('Female')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold shrink-0 flex items-center gap-1.5 transition-all shadow-md active:scale-95 border-2 ${
            isGenderFemale
              ? 'bg-pink-500/25 text-pink-200 border-pink-400 shadow-pink-500/20'
              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="p-1 rounded-lg bg-pink-500/20 text-pink-400">
            <Venus className="w-3.5 h-3.5" />
          </div>
          <span>Female</span>
          {isGenderFemale && <Check className="w-3.5 h-3.5 text-pink-400" />}
        </button>

        {/* Below 6 Months Quick Filter Button */}
        <button
          onClick={toggleUnder6Months}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold shrink-0 flex items-center gap-1.5 transition-all shadow-md active:scale-95 border-2 ${
            isUnder6Months
              ? 'bg-amber-500/25 text-amber-200 border-amber-400 shadow-amber-500/20'
              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <span>Below 6 Months</span>
          {isUnder6Months && <Check className="w-3.5 h-3.5 text-amber-400" />}
        </button>

        {/* Blue Eyes Quick Filter Button */}
        <button
          onClick={toggleBlueEyes}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold shrink-0 flex items-center gap-1.5 transition-all shadow-md active:scale-95 border-2 ${
            isBlueEyes
              ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400 shadow-cyan-500/20'
              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <span>Blue Eyes</span>
          {isBlueEyes && <Check className="w-3.5 h-3.5 text-cyan-400" />}
        </button>

        {/* Available Only Quick Filter Button */}
        <button
          onClick={toggleAvailableOnly}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold shrink-0 flex items-center gap-1.5 transition-all shadow-md active:scale-95 border-2 ${
            isAvailableOnly
              ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400 shadow-emerald-500/20'
              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span>Available Only</span>
          {isAvailableOnly && <Check className="w-3.5 h-3.5 text-emerald-400" />}
        </button>
      </div>
    </div>
  );
}

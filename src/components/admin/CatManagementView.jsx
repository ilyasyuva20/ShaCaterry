import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Cat as CatIcon,
  Video,
  ShieldCheck
} from 'lucide-react';
import { useCatContext } from '../../context/CatContext';
import CatFormModal from './CatFormModal';

export default function CatManagementView() {
  const { cats, categories, toggleCatStatus, deleteCat, settings } = useCatContext();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [editingCat, setEditingCat] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Quick stats
  const totalCats = cats.length;
  const availableCats = cats.filter(c => c.status === 'Available').length;
  const soldOutCats = cats.filter(c => c.status === 'Sold Out').length;
  const reservedCats = cats.filter(c => c.status === 'Reserved').length;

  // Filtered cats table logic
  const filteredTableCats = cats.filter(cat => {
    if (selectedCategory && cat.category_id !== Number(selectedCategory)) return false;
    if (selectedStatus && cat.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        cat.title.toLowerCase().includes(q) ||
        cat.color.toLowerCase().includes(q) ||
        cat.age.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusCycle = (cat) => {
    const nextStatus =
      cat.status === 'Available'
        ? 'Sold Out'
        : cat.status === 'Sold Out'
        ? 'Reserved'
        : 'Available';
    toggleCatStatus(cat.id, nextStatus);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 font-serif gold-gradient-text">
            Cat Listings Directory
          </h2>
          <p className="text-xs text-slate-400">
            Manage kittens, media uploads, and fast status toggles
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Cat
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Total Cats</span>
            <span className="text-2xl font-black text-slate-100 font-serif">{totalCats}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <CatIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Available</span>
            <span className="text-2xl font-black text-emerald-400 font-serif">{availableCats}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Sold Out</span>
            <span className="text-2xl font-black text-rose-400 font-serif">{soldOutCats}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Reserved</span>
            <span className="text-2xl font-black text-amber-400 font-serif">{reservedCats}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, color, or age..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 outline-none focus:border-amber-500/50"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Sold Out">Sold Out</option>
          <option value="Reserved">Reserved</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Cat / Media</th>
                <th className="px-4 py-3">Breed</th>
                <th className="px-4 py-3">Age / Gender</th>
                <th className="px-4 py-3">Color / Eye</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 text-center">Fast Status Toggle</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTableCats.map((cat) => {
                const catBreed = categories.find(c => c.id === cat.category_id)?.name || 'Unknown';
                return (
                  <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                          <img src={cat.main_image_url} alt="" className="w-full h-full object-cover" />
                          {cat.video_url && (
                            <span className="absolute bottom-0.5 right-0.5 p-0.5 bg-slate-950/80 text-amber-400 rounded">
                              <Video className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-100 line-clamp-1">{cat.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                            {cat.is_vaccinated && (
                              <span className="text-sky-400 flex items-center gap-0.5">
                                <ShieldCheck className="w-3 h-3" /> Vaccinated
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold text-amber-400">
                      {catBreed}
                    </td>

                    <td className="px-4 py-3">
                      <span className="block font-medium">{cat.age}</span>
                      <span className="text-[10px] text-slate-400">{cat.gender}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="block font-medium truncate max-w-[100px]">{cat.color}</span>
                      <span className="text-[10px] text-slate-400">{cat.eye_color} eyes</span>
                    </td>

                    <td className="px-4 py-3 font-serif font-bold text-slate-100">
                      {cat.price > 0 ? `${settings.currency || '$'}${cat.price.toLocaleString()}` : 'N/A'}
                    </td>

                    {/* FAST STATUS TOGGLE (CRITICAL REQUIREMENT) */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleStatusCycle(cat)}
                        title="Click to cycle status: Available -> Sold Out -> Reserved"
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all active:scale-95 shadow-sm ${
                          cat.status === 'Available'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                            : cat.status === 'Sold Out'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                        }`}
                      >
                        {cat.status} ⚡
                      </button>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingCat(cat)}
                          className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                          title="Edit Cat Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${cat.title}?`)) {
                              deleteCat(cat.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredTableCats.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    No cat listings match your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modals */}
      {(isAddModalOpen || editingCat) && (
        <CatFormModal
          catToEdit={editingCat}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingCat(null);
          }}
        />
      )}
    </div>
  );
}

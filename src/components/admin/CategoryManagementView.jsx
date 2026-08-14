import React, { useState } from 'react';
import { Plus, Tag, Trash2, Cat as CatIcon, Sparkles } from 'lucide-react';
import { useCatContext } from '../../context/CatContext';

export default function CategoryManagementView() {
  const { categories, cats, addCategory, deleteCategory } = useCatContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    if (categories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      setError('Category already exists!');
      return;
    }

    await addCategory(newCategoryName);
    setNewCategoryName('');
    setError('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 font-serif gold-gradient-text">
          Breed Categories Management
        </h2>
        <p className="text-xs text-slate-400">
          Manage cat breed chips displayed in the mobile PWA slider
        </p>
      </div>

      {/* Add New Category Form */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-amber-400 font-serif uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          Add New Breed Category
        </h3>

        <form onSubmit={handleAdd} className="flex gap-2 text-xs">
          <div className="flex-1">
            <input
              type="text"
              placeholder="e.g. Ragdoll, Sphynx, Scottish Fold..."
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                setError('');
              }}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-slate-100 outline-none"
            />
            {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 hover:opacity-95 flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </form>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const count = cats.filter(c => c.category_id === cat.id).length;
          return (
            <div
              key={cat.id}
              className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{cat.name}</h4>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <CatIcon className="w-3 h-3 text-slate-500" />
                    {count} {count === 1 ? 'cat listing' : 'cat listings'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (count > 0) {
                    if (!confirm(`Warning: ${count} cat listings belong to this category. Delete anyway?`)) {
                      return;
                    }
                  }
                  deleteCategory(cat.id);
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

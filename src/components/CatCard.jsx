import React from 'react';
import { ShieldCheck, Video, MessageCircle, Mars, Venus, Eye } from 'lucide-react';
import { useCatContext } from '../context/CatContext';
import { generateWhatsAppLink } from '../lib/whatsapp';

export default function CatCard({ cat, onSelect }) {
  const { categories, settings } = useCatContext();

  const categoryObj = categories.find(c => c.id === cat.category_id);
  const categoryName = categoryObj ? categoryObj.name : 'Royal Cat';

  const waLink = generateWhatsAppLink(cat, categoryName, settings);
  const isAvailable = cat.status?.toLowerCase() === 'available';
  const isSoldOut = cat.status?.toLowerCase() === 'sold out';
  const isBooked = cat.status?.toLowerCase() === 'booked' || cat.status?.toLowerCase() === 'reserved';

  const getStatusBadge = () => {
    if (isAvailable) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/30 text-emerald-200 border border-emerald-400/60 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          Available
        </span>
      );
    }
    if (isSoldOut) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/30 text-rose-200 border border-rose-400/60 shadow-sm backdrop-blur-md">
          Sold Out
        </span>
      );
    }
    if (isBooked) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/30 text-amber-200 border border-amber-400/60 shadow-sm backdrop-blur-md">
          Booked
        </span>
      );
    }
    return null;
  };

  return (
    <div
      onClick={() => onSelect(cat)}
      className="group relative bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col cursor-pointer"
    >
      {/* Image Banner Container */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-slate-950">
        <img
          src={cat.main_image_url}
          alt={cat.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Top Badges Row */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-10">
          <div>{getStatusBadge()}</div>

          <div className="flex items-center gap-1">
            {cat.video_url && (
              <span className="p-1 rounded-lg bg-slate-950/80 border border-amber-500/40 text-amber-300 backdrop-blur-md shadow-sm" title="Video available">
                <Video className="w-3.5 h-3.5" />
              </span>
            )}
            {cat.is_vaccinated && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/30 text-sky-200 border border-sky-400/60 backdrop-blur-md">
                <ShieldCheck className="w-3 h-3 text-sky-300" />
                <span className="hidden xs:inline">Vaccinated</span>
              </span>
            )}
          </div>
        </div>

        {/* Category Pill Over Image Bottom */}
        <div className="absolute bottom-2.5 left-2.5 z-10 max-w-[85%]">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-slate-950/90 text-amber-300 border border-amber-500/40 backdrop-blur-md truncate block">
            {categoryName}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1">
            {cat.title}
          </h3>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-300 border-t border-slate-800/80 pt-2">
            <span className="font-semibold text-slate-200">{cat.age}</span>

            <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
              {cat.gender === 'Male' ? (
                <Mars className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <Venus className="w-3.5 h-3.5 text-pink-400" />
              )}
              <span className="text-[11px] font-bold text-slate-200">{cat.gender}</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-300">
              <Eye className="w-3 h-3 text-amber-400" />
              <span className="truncate max-w-[70px] font-medium">{cat.eye_color}</span>
            </div>
          </div>
        </div>

        {/* Price & Action Button Footer */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {cat.price > 0 ? (
            <div>
              <span className="text-[10px] text-slate-400 block leading-tight">Price</span>
              <span className="text-sm font-bold text-amber-300 font-serif">
                {settings.currency || '₹'}{cat.price.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-xs font-semibold text-slate-400">Price on request</span>
          )}

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
              isAvailable
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isAvailable ? 'Buy Now' : 'Interested'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

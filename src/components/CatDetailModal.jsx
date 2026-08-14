import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  Video,
  MessageCircle,
  Mars,
  Venus,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  Calendar,
  Palette,
  Tag,
  Share2
} from 'lucide-react';
import { useCatContext } from '../context/CatContext';
import { generateWhatsAppLink } from '../lib/whatsapp';

export default function CatDetailModal({ cat, onClose }) {
  const { categories, settings } = useCatContext();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!cat) return null;

  const categoryObj = categories.find(c => c.id === cat.category_id);
  const categoryName = categoryObj ? categoryObj.name : 'Royal Cat';

  // Consolidate images & video into media array
  const allImages = [cat.main_image_url, ...(cat.gallery_urls || [])].filter(Boolean);
  const hasVideo = Boolean(cat.video_url);

  // Total slides count: video (if any) + images
  const mediaList = [];
  if (hasVideo) {
    mediaList.push({ type: 'video', url: cat.video_url });
  }
  allImages.forEach(imgUrl => {
    mediaList.push({ type: 'image', url: imgUrl });
  });

  const waLink = generateWhatsAppLink(cat, categoryName, settings.ownerPhone);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cat.title} — ${categoryName}`,
          text: `Check out this gorgeous ${categoryName} on Sha Cattery!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] bg-slate-900 border border-slate-800 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Floating Top Controls */}
          <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-950/70 text-slate-200 border border-slate-700/80 hover:bg-slate-900 backdrop-blur-md transition-all pointer-events-auto shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pointer-events-auto">
              <a
                href="https://www.instagram.com/sha_cattery"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-950/70 text-pink-400 border border-pink-500/50 hover:bg-slate-900 backdrop-blur-md transition-all shadow-md flex items-center justify-center"
                title="Follow @sha_cattery on Instagram"
              >
                <svg className="w-4 h-4 fill-current text-pink-400" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-slate-950/70 text-slate-200 border border-slate-700/80 hover:bg-slate-900 backdrop-blur-md transition-all shadow-md"
                title="Share Cat Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {copied && (
                <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-1 rounded-md">
                  Link Copied!
                </span>
              )}
            </div>
          </div>

          {/* Scrollable Container */}
          <div className="overflow-y-auto flex-1 no-scrollbar pb-24">
            {/* Media Gallery Carousel */}
            <div className="relative w-full aspect-[4/3] bg-slate-950 overflow-hidden">
              {mediaList.length > 0 && (
                <div className="w-full h-full relative">
                  {mediaList[activeMediaIndex].type === 'video' ? (
                    <video
                      src={mediaList[activeMediaIndex].url}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : (
                    <img
                      src={mediaList[activeMediaIndex].url}
                      alt={cat.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}

              {/* Prev / Next Buttons */}
              {mediaList.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 text-slate-200 border border-slate-800 backdrop-blur-md hover:bg-slate-900 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveMediaIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 text-slate-200 border border-slate-800 backdrop-blur-md hover:bg-slate-900 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Thumbnail Strip Overlay */}
              {mediaList.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 px-4 z-20">
                  {mediaList.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        activeMediaIndex === idx ? 'border-amber-400 scale-105 shadow-md' : 'border-slate-700/80 opacity-60'
                      }`}
                    >
                      {item.type === 'video' ? (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-amber-400">
                          <Video className="w-5 h-5" />
                        </div>
                      ) : (
                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Content Body */}
            <div className="p-5 space-y-6">
              {/* Header Title & Status */}
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {categoryName}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      cat.status === 'Available'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : cat.status === 'Sold Out'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {cat.status}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 font-serif">
                  {cat.title}
                </h2>

                {cat.price > 0 && (
                  <div className="mt-2 text-2xl font-black text-amber-400 font-serif">
                    {settings.currency || '₹'}{cat.price.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Attributes Specification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Age</span>
                    <span className="text-xs font-bold text-slate-200">{cat.age}</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    {cat.gender === 'Male' ? <Mars className="w-4 h-4" /> : <Venus className="w-4 h-4 text-pink-400" />}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Gender</span>
                    <span className="text-xs font-bold text-slate-200">{cat.gender}</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Fur Color</span>
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[90px] block">{cat.color}</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Eye Color</span>
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[90px] block">{cat.eye_color}</span>
                  </div>
                </div>
              </div>

              {/* Vaccination Status Pill */}
              <div className="p-3.5 bg-slate-950/40 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className={`w-5 h-5 ${cat.is_vaccinated ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Vaccination Status</h4>
                    <p className="text-[11px] text-slate-400">
                      {cat.is_vaccinated ? 'Fully vaccinated with health card & dewormed' : 'Pending vaccination schedule'}
                    </p>
                  </div>
                </div>
                {cat.is_vaccinated && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>

              {/* Description */}
              {cat.description && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-serif">
                    About This Cat
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                    {cat.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Action Bar (CRITICAL REQUIREMENT) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 z-30">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-3.5 px-6 rounded-2xl text-sm font-extrabold transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl active:scale-[0.98] ${
                cat.status === 'Available'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/25 hover:brightness-110'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-amber-500/25 hover:brightness-110'
              }`}
            >
              <MessageCircle className="w-5 h-5 fill-slate-950" />
              <span>
                {cat.status === 'Available' ? 'Buy Now / Place Order on WhatsApp' : "I'm Interested — Notify Me"}
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

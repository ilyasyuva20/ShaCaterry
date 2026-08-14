import React, { useState } from 'react';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useCatContext } from '../../context/CatContext';
import { uploadMediaFile, isSupabaseConfigured } from '../../lib/supabase';

// Zod Form Validation Schema
const catSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  category_id: z.coerce.number().min(1, 'Please select a valid cat category'),
  age: z.string().min(1, 'Age is required (e.g., "54 days", "2 months")'),
  color: z.string().min(1, 'Color description is required'),
  eye_color: z.string().min(1, 'Eye color is required'),
  gender: z.enum(['Male', 'Female']),
  status: z.enum(['Available', 'Sold Out', 'Reserved']),
  is_vaccinated: z.boolean(),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  description: z.string().optional(),
  main_image_url: z.string().url('Main image must be a valid URL'),
  gallery_urls: z.array(z.string().url()).optional(),
  video_url: z.string().optional()
});

export default function CatFormModal({ catToEdit, onClose }) {
  const { categories, addCat, updateCat } = useCatContext();

  const isEditing = Boolean(catToEdit);

  // Form State
  const [formData, setFormData] = useState({
    title: catToEdit?.title || '',
    category_id: catToEdit?.category_id || (categories[0]?.id || 1),
    age: catToEdit?.age || '',
    color: catToEdit?.color || '',
    eye_color: catToEdit?.eye_color || '',
    gender: catToEdit?.gender || 'Male',
    status: catToEdit?.status || 'Available',
    is_vaccinated: catToEdit?.is_vaccinated ?? true,
    price: catToEdit?.price || '',
    description: catToEdit?.description || '',
    main_image_url: catToEdit?.main_image_url || '',
    gallery_urls: catToEdit?.gallery_urls || [],
    video_url: catToEdit?.video_url || ''
  });

  const [newGalleryInput, setNewGalleryInput] = useState('');
  const [errors, setErrors] = useState({});
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Main Image File Upload (Supabase Storage or Blob URL)
  const handleMainFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMain(true);
    setUploadProgress(25);
    try {
      setUploadProgress(60);
      const result = await uploadMediaFile(file, 'main_images');
      setUploadProgress(100);
      setFormData(prev => ({ ...prev, main_image_url: result.url }));
    } catch (err) {
      console.error('Failed to upload main image:', err);
      alert('Media upload error: ' + err.message);
    } finally {
      setTimeout(() => {
        setUploadingMain(false);
        setUploadProgress(0);
      }, 400);
    }
  };

  // Handle Video File Upload
  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setUploadProgress(30);
    try {
      setUploadProgress(70);
      const result = await uploadMediaFile(file, 'videos');
      setUploadProgress(100);
      setFormData(prev => ({ ...prev, video_url: result.url }));
    } catch (err) {
      console.error('Failed to upload video:', err);
      alert('Video upload error: ' + err.message);
    } finally {
      setTimeout(() => {
        setUploadingVideo(false);
        setUploadProgress(0);
      }, 400);
    }
  };

  // Gallery URLs Management
  const addGalleryUrl = () => {
    if (!newGalleryInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      gallery_urls: [...prev.gallery_urls, newGalleryInput.trim()]
    }));
    setNewGalleryInput('');
  };

  const removeGalleryUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery_urls: prev.gallery_urls.filter((_, i) => i !== index)
    }));
  };

  // Submit Handler with Zod Validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validatedData = {
      ...formData,
      category_id: Number(formData.category_id),
      price: formData.price === '' ? 0 : Number(formData.price),
      video_url: formData.video_url?.trim() || undefined
    };

    // Zod validation
    const result = catSchema.safeParse(validatedData);

    if (!result.success) {
      const formattedErrors = {};
      result.error.issues.forEach(issue => {
        const path = issue.path[0];
        formattedErrors[path] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateCat(catToEdit.id, validatedData);
      } else {
        await addCat(validatedData);
      }
      onClose();
    } catch (err) {
      console.error('Save cat error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-100 font-serif gold-gradient-text">
                {isEditing ? 'Edit Cat Listing' : 'Add New Cat Listing'}
              </h3>
              <p className="text-xs text-slate-400">Fill in details for customer PWA catalog</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content - Scrollable */}
          <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 no-scrollbar text-xs">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Cat Title / Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Snow Princess — White Persian"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2 text-slate-100 outline-none"
                />
                {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Breed Category *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2 text-slate-100 outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-[11px] text-rose-400 mt-1">{errors.category_id}</p>}
              </div>
            </div>

            {/* Spec Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Age *</label>
                <input
                  type="text"
                  placeholder="e.g. 54 days, 2 mos"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2 text-slate-100 outline-none"
                />
                {errors.age && <p className="text-[11px] text-rose-400 mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Fur Color *</label>
                <input
                  type="text"
                  placeholder="e.g. Pure White, Blue"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2 text-slate-100 outline-none"
                />
                {errors.color && <p className="text-[11px] text-rose-400 mt-1">{errors.color}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Eye Color *</label>
                <input
                  type="text"
                  placeholder="e.g. Blue, Amber, Green"
                  value={formData.eye_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, eye_color: e.target.value }))}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2 text-slate-100 outline-none"
                />
                {errors.eye_color && <p className="text-[11px] text-rose-400 mt-1">{errors.eye_color}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2 text-slate-100 outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Status, Price, Vaccination */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Listing Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2 text-slate-100 outline-none"
                >
                  <option value="Available">Available</option>
                  <option value="Sold Out">Sold Out</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Price (Optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 1250"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2 text-slate-100 outline-none"
                />
                {errors.price && <p className="text-[11px] text-rose-400 mt-1">{errors.price}</p>}
              </div>

              <div className="flex items-center sm:pt-6">
                <label className="relative flex items-center gap-3 cursor-pointer p-2 bg-slate-950/60 rounded-xl border border-slate-800 w-full">
                  <input
                    type="checkbox"
                    checked={formData.is_vaccinated}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_vaccinated: e.target.checked }))}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-500"
                  />
                  <span className="text-xs font-semibold text-slate-200">Is Vaccinated?</span>
                </label>
              </div>
            </div>

            {/* Media Upload Section (CRITICAL REQUIREMENT) */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="font-bold text-amber-400 font-serif text-xs uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Media Uploader (Supabase Storage Enabled)
              </h4>

              {/* Main Image URL & File Upload */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Main Image URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.main_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, main_image_url: e.target.value }))}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 flex items-center gap-1.5 shrink-0 transition-all">
                    {uploadingMain ? (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    ) : (
                      <Upload className="w-4 h-4 text-amber-400" />
                    )}
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainFileUpload}
                      className="hidden"
                      disabled={uploadingMain}
                    />
                  </label>
                </div>
                {errors.main_image_url && <p className="text-[11px] text-rose-400 mt-1">{errors.main_image_url}</p>}

                {/* Progress bar */}
                {uploadingMain && (
                  <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}

                {/* Preview */}
                {formData.main_image_url && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <img src={formData.main_image_url} alt="Main preview" className="w-12 h-12 rounded-lg object-cover" />
                    <span className="text-[11px] text-emerald-400 font-medium">Main photo loaded</span>
                  </div>
                )}
              </div>

              {/* Gallery URLs */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Additional Gallery Photos</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Paste extra image URL..."
                    value={newGalleryInput}
                    onChange={(e) => setNewGalleryInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  />
                  <button
                    type="button"
                    onClick={addGalleryUrl}
                    className="px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold hover:bg-amber-500/30 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                {formData.gallery_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.gallery_urls.map((url, idx) => (
                      <div key={idx} className="relative group w-14 h-14 rounded-xl overflow-hidden border border-slate-800">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryUrl(idx)}
                          className="absolute inset-0 bg-slate-950/70 text-rose-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video URL & Video Upload */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-amber-400" />
                  Video File / URL (MP4)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://assets.mixkit.co/videos/..."
                    value={formData.video_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 flex items-center gap-1.5 shrink-0 transition-all">
                    {uploadingVideo ? (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    ) : (
                      <Upload className="w-4 h-4 text-amber-400" />
                    )}
                    <span>Upload MP4</span>
                    <input
                      type="file"
                      accept="video/mp4,video/*"
                      onChange={handleVideoFileUpload}
                      className="hidden"
                      disabled={uploadingVideo}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Description</label>
              <textarea
                rows={3}
                placeholder="Describe coat density, temperament, pedigree certificates..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2 text-slate-100 outline-none"
              />
            </div>

            {/* Form Footer Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-bold shadow-lg shadow-amber-500/20 hover:opacity-95 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{isEditing ? 'Save Changes' : 'Create Listing'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

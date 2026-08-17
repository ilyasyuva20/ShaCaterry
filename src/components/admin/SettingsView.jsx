import React, { useState, useEffect } from 'react';
import { MessageCircle, Database, Save, CheckCircle2, Copy, Check, ShieldCheck, PhoneCall } from 'lucide-react';
import { useCatContext } from '../../context/CatContext';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function SettingsView() {
  const { settings, setSettings, updateSettings, loadSupabaseData } = useCatContext();

  const [formSettings, setFormSettings] = useState({
    ownerPhone: settings.ownerPhone || '',
    catteryName: settings.catteryName || 'Sha Cattery',
    currency: settings.currency || '₹',
    supabaseUrl: settings.supabaseUrl || '',
    supabaseAnonKey: settings.supabaseAnonKey || ''
  });

  useEffect(() => {
    setFormSettings({
      ownerPhone: settings.ownerPhone || '',
      catteryName: settings.catteryName || 'Sha Cattery',
      currency: settings.currency || '₹',
      supabaseUrl: settings.supabaseUrl || '',
      supabaseAnonKey: settings.supabaseAnonKey || ''
    });
  }, [settings]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (updateSettings) {
      updateSettings(formSettings);
    } else {
      setSettings(formSettings);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const sqlSchemaCode = `-- SHA CATTERY SUPABASE SQL SETUP
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO categories (name) VALUES 
('Persian Cat'), ('Siamese Cat'), ('Maine Coon'), 
('Bengal Cat'), ('British Shorthair'), ('Himalayan Cat'),
('Exotic Short Hair'), ('Traditional Long Hair')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS cats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id INT REFERENCES categories(id),
  title VARCHAR(150) NOT NULL,
  age VARCHAR(50) NOT NULL,
  color VARCHAR(100) NOT NULL,
  eye_color VARCHAR(100) NOT NULL,
  gender VARCHAR(20) CHECK (gender IN ('Male', 'Female')),
  is_vaccinated BOOLEAN DEFAULT false,
  status VARCHAR(50) CHECK (status IN ('Available', 'Sold Out', 'Booked')),
  price NUMERIC(10, 2),
  description TEXT,
  main_image_url TEXT NOT NULL,
  gallery_urls TEXT[],
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  owner_phone VARCHAR(50),
  cattery_name VARCHAR(100),
  currency VARCHAR(10),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO site_settings (id, owner_phone, cattery_name, currency)
VALUES (1, '', 'Sha Cattery', '₹')
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_cats_status ON cats(status);
CREATE INDEX IF NOT EXISTS idx_cats_category ON cats(category_id);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl text-xs">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 font-serif gold-gradient-text">
          Business & Supabase Settings
        </h2>
        <p className="text-xs text-slate-400">
          Configure WhatsApp owner number, currency, and Supabase cloud database
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-emerald-300 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* WhatsApp & Branding Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-amber-400 font-serif uppercase tracking-wider flex items-center gap-2">
            <PhoneCall className="w-4 h-4" />
            WhatsApp & Business Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Owner WhatsApp Number *
              </label>
              <div className="relative">
                <MessageCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                <input
                  type="text"
                  placeholder="e.g. 918089579575 (Country code + digits)"
                  value={formSettings.ownerPhone}
                  onChange={(e) => setFormSettings(prev => ({ ...prev, ownerPhone: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl pl-9 pr-3 py-2 text-slate-100 outline-none"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Direct target for buy & inquiry WhatsApp messages</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Cattery Business Name
              </label>
              <input
                type="text"
                value={formSettings.catteryName}
                onChange={(e) => setFormSettings(prev => ({ ...prev, catteryName: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2 text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formSettings.currency}
                onChange={(e) => setFormSettings(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2 text-slate-100 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Supabase Connection Details */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 font-serif uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4" />
              Supabase Cloud Database & Storage
            </h3>

            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              isSupabaseConfigured()
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {isSupabaseConfigured() ? 'Supabase Connected' : 'Local / Mock Mode Active'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyz.supabase.co"
                value={formSettings.supabaseUrl}
                onChange={(e) => setFormSettings(prev => ({ ...prev, supabaseUrl: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2 text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Supabase Anon Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOi..."
                value={formSettings.supabaseAnonKey}
                onChange={(e) => setFormSettings(prev => ({ ...prev, supabaseAnonKey: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2 text-slate-100 outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </form>

      {/* Supabase SQL Runner Viewer */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 font-serif uppercase tracking-wider">
            Supabase SQL Schema Script
          </h3>
          <button
            onClick={copySql}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold border border-slate-700 flex items-center gap-1.5 transition-all text-[11px]"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? 'Copied!' : 'Copy SQL Script'}</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-400">
          Copy and paste this script into your Supabase Dashboard SQL Editor to set up tables and default categories.
        </p>

        <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[11px] font-mono text-amber-200/90 overflow-x-auto max-h-48 leading-relaxed">
          {sqlSchemaCode}
        </pre>
      </div>
    </div>
  );
}

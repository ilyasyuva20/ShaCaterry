import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCatContext } from '../../context/CatContext';

export default function AdminLogin() {
  const { loginAdmin } = useCatContext();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = loginAdmin(password);
    if (!success) {
      setError('Invalid admin password. Try "admin123" or "shacattery"');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-[1.5px] mx-auto shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 font-serif gold-gradient-text">
            Sha Cattery Admin
          </h2>
          <p className="text-xs text-slate-400">
            Enter your passcode to manage listings, categories & media
          </p>
        </div>

        {/* Demo Passcode Hint Alert */}
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Demo Password: <strong className="font-mono text-white">admin123</strong> or <strong className="font-mono text-white">shacattery</strong></span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
                required
              />
            </div>
            {error && (
              <p className="text-[11px] text-rose-400 mt-1.5 font-medium">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Lock className="w-4 h-4" />
            Unlock Dashboard
          </button>
        </form>

        {/* Back Link */}
        <div className="pt-2 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Customer App
          </Link>
        </div>
      </div>
    </div>
  );
}

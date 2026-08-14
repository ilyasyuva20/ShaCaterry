import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cat as CatIcon,
  Tag,
  Settings,
  LogOut,
  ArrowLeft,
  Crown,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useCatContext } from '../context/CatContext';
import AdminLogin from '../components/admin/AdminLogin';
import CatManagementView from '../components/admin/CatManagementView';
import CategoryManagementView from '../components/admin/CategoryManagementView';
import SettingsView from '../components/admin/SettingsView';

export default function AdminPage() {
  const { isAdminAuthenticated, logoutAdmin, settings } = useCatContext();
  const [activeTab, setActiveTab] = useState('cats'); // 'cats' | 'categories' | 'settings'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Admin Top Navigation */}
      <div className="md:hidden sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          <h1 className="font-bold text-sm font-serif gold-gradient-text">Sha Admin</h1>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileSidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0 z-30`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-[1.5px] shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-sm text-slate-100 font-serif gold-gradient-text">
                {settings.catteryName || 'Sha Cattery'}
              </h1>
              <span className="text-[10px] text-slate-400 font-mono">Owner Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('cats');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'cats'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/60'
              }`}
            >
              <CatIcon className="w-4 h-4 text-amber-400" />
              <span>Manage Cats</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('categories');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'categories'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/60'
              }`}
            >
              <Tag className="w-4 h-4 text-amber-400" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'settings'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/60'
              }`}
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom Actions */}
        <div className="pt-6 border-t border-slate-800 space-y-2 text-xs font-semibold">
          <Link
            to="/"
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-950/60 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Admin View Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'cats' && <CatManagementView />}
          {activeTab === 'categories' && <CategoryManagementView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
}

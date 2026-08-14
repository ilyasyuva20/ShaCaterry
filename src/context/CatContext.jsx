import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CATEGORIES, INITIAL_CATS } from '../lib/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const CatContext = createContext(null);

const STORAGE_KEY_CATS = 'sha_cattery_cats_v1';
const STORAGE_KEY_CATEGORIES = 'sha_cattery_categories_v1';
const STORAGE_KEY_SETTINGS = 'sha_cattery_settings_v1';
const STORAGE_KEY_AUTH = 'sha_cattery_auth_v1';

export const CatProvider = ({ children }) => {
  // State initialization
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [cats, setCats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CATS);
    return saved ? JSON.parse(saved) : INITIAL_CATS;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.currency === '$') parsed.currency = '₹';
      return parsed;
    }
    return {
      ownerPhone: '8089579575',
      catteryName: 'Sha Cattery',
      currency: '₹',
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
    };
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  });

  const [loading, setLoading] = useState(false);
  const [dbConnected, setDbConnected] = useState(isSupabaseConfigured());

  // Filter & Search states
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState({
    age: '',
    color: '',
    eyeColor: '',
    gender: '',
    statusAvailableOnly: false
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATS, JSON.stringify(cats));
  }, [cats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_AUTH, String(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  // Fetch live data from Supabase if configured
  const loadSupabaseData = async () => {
    if (!isSupabaseConfigured() || !supabase) return;
    setLoading(true);
    try {
      // Fetch Categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });

      if (!catError && catData && catData.length > 0) {
        setCategories(catData);
      }

      // Fetch Cats
      const { data: catsData, error: catsError } = await supabase
        .from('cats')
        .select('*')
        .order('created_at', { ascending: false });

      if (!catsError && catsData) {
        setCats(catsData);
      }
      setDbConnected(true);
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupabaseData();
  }, []);

  // CRUD Operations for Cats
  const addCat = async (newCatData) => {
    setLoading(true);
    const tempId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cat-${Date.now()}`;
    const newCat = {
      id: tempId,
      created_at: new Date().toISOString(),
      gallery_urls: newCatData.gallery_urls || [],
      is_vaccinated: Boolean(newCatData.is_vaccinated),
      price: newCatData.price ? parseFloat(newCatData.price) : 0,
      ...newCatData
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('cats')
          .insert([{
            category_id: parseInt(newCat.category_id, 10),
            title: newCat.title,
            age: newCat.age,
            color: newCat.color,
            eye_color: newCat.eye_color,
            gender: newCat.gender,
            is_vaccinated: newCat.is_vaccinated,
            status: newCat.status,
            price: newCat.price,
            description: newCat.description,
            main_image_url: newCat.main_image_url,
            gallery_urls: newCat.gallery_urls,
            video_url: newCat.video_url || null
          }])
          .select();

        if (error) throw error;
        if (data && data[0]) {
          setCats(prev => [data[0], ...prev]);
          setLoading(false);
          return data[0];
        }
      } catch (err) {
        console.error('Failed to insert cat to Supabase:', err);
      }
    }

    // Fallback to local state
    setCats(prev => [newCat, ...prev]);
    setLoading(false);
    return newCat;
  };

  const updateCat = async (id, updatedFields) => {
    setLoading(true);
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('cats')
          .update(updatedFields)
          .eq('id', id)
          .select();

        if (error) throw error;
        if (data && data[0]) {
          setCats(prev => prev.map(c => (c.id === id ? data[0] : c)));
          setLoading(false);
          return data[0];
        }
      } catch (err) {
        console.error('Failed to update cat in Supabase:', err);
      }
    }

    setCats(prev => prev.map(c => (c.id === id ? { ...c, ...updatedFields } : c)));
    setLoading(false);
  };

  const toggleCatStatus = async (id, newStatus) => {
    await updateCat(id, { status: newStatus });
  };

  const deleteCat = async (id) => {
    setLoading(true);
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('cats')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (err) {
        console.error('Failed to delete cat from Supabase:', err);
      }
    }

    setCats(prev => prev.filter(c => c.id !== id));
    setLoading(false);
  };

  // CRUD Operations for Categories
  const addCategory = async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert([{ name: trimmed }])
          .select();

        if (!error && data && data[0]) {
          setCategories(prev => [...prev, data[0]]);
          return data[0];
        }
      } catch (err) {
        console.error('Error adding category to Supabase:', err);
      }
    }

    const newCatObj = { id: Date.now(), name: trimmed };
    setCategories(prev => [...prev, newCatObj]);
    return newCatObj;
  };

  const deleteCategory = async (id) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.error('Error deleting category from Supabase:', err);
      }
    }
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Filter helpers
  const clearFilters = () => {
    setSelectedCategoryId(null);
    setSearchQuery('');
    setFilterState({
      age: '',
      color: '',
      eyeColor: '',
      gender: '',
      statusAvailableOnly: false
    });
  };

  // Filtered cats calculation
  const filteredCats = cats.filter(cat => {
    // Category match
    if (selectedCategoryId !== null && cat.category_id !== selectedCategoryId) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const catName = cat.title.toLowerCase();
      const color = cat.color ? cat.color.toLowerCase() : '';
      const breed = categories.find(c => c.id === cat.category_id)?.name.toLowerCase() || '';
      if (!catName.includes(q) && !color.includes(q) && !breed.includes(q)) {
        return false;
      }
    }
    // Age filter
    if (filterState.age) {
      const ageLower = cat.age.toLowerCase();
      if (filterState.age === 'under6months') {
        const isDays = ageLower.includes('day');
        const matchMonth = ageLower.match(/(\d+)\s*month/);
        const months = matchMonth ? parseInt(matchMonth[1], 10) : null;
        const isUnder6Months = months !== null ? months <= 6 : false;
        if (!isDays && !isUnder6Months) return false;
      } else if (!ageLower.includes(filterState.age.toLowerCase())) {
        return false;
      }
    }
    // Color filter
    if (filterState.color && !cat.color.toLowerCase().includes(filterState.color.toLowerCase())) {
      return false;
    }
    // Eye color filter
    if (filterState.eyeColor && !cat.eye_color.toLowerCase().includes(filterState.eyeColor.toLowerCase())) {
      return false;
    }
    // Gender filter
    if (filterState.gender && cat.gender !== filterState.gender) {
      return false;
    }
    // Status available only filter
    if (filterState.statusAvailableOnly && cat.status !== 'Available') {
      return false;
    }

    return true;
  });

  // Admin Auth Helpers
  const loginAdmin = (password) => {
    // Default pass code 'admin123' or any entered
    if (password === 'admin123' || password === 'shacattery') {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
  };

  const value = {
    cats,
    categories,
    settings,
    setSettings,
    loading,
    dbConnected,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    filterState,
    setFilterState,
    clearFilters,
    filteredCats,
    addCat,
    updateCat,
    toggleCatStatus,
    deleteCat,
    addCategory,
    deleteCategory,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    loadSupabaseData
  };

  return <CatContext.Provider value={value}>{children}</CatContext.Provider>;
};

export const useCatContext = () => {
  const context = useContext(CatContext);
  if (!context) {
    throw new Error('useCatContext must be used within a CatProvider');
  }
  return context;
};

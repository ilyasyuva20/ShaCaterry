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
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CATEGORIES;
      }
    }
    return INITIAL_CATEGORIES;
  });

  const [cats, setCats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CATS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CATS;
      }
    }
    return INITIAL_CATS;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.currency === '$') parsed.currency = '₹';
      if (parsed.ownerPhone === '8089579575') parsed.ownerPhone = '918089579575';
      return parsed;
    }
    return {
      ownerPhone: '918089579575',
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
        setCats(prevLocal => {
          const remoteIds = new Set(catsData.map(c => String(c.id)));
          const localOnly = prevLocal.filter(
            c => !remoteIds.has(String(c.id)) && typeof c.id === 'string' && c.id.startsWith('cat-')
          );
          return [...catsData, ...localOnly];
        });
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
    const formattedCat = {
      id: tempId,
      created_at: new Date().toISOString(),
      gallery_urls: newCatData.gallery_urls || [],
      is_vaccinated: Boolean(newCatData.is_vaccinated),
      price: newCatData.price ? parseFloat(newCatData.price) : 0,
      ...newCatData,
      category_id: Number(newCatData.category_id)
    };

    let inserted = formattedCat;

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('cats')
        .insert([{
          category_id: parseInt(formattedCat.category_id, 10),
          title: formattedCat.title,
          age: formattedCat.age,
          color: formattedCat.color,
          eye_color: formattedCat.eye_color,
          gender: formattedCat.gender,
          is_vaccinated: formattedCat.is_vaccinated,
          status: formattedCat.status,
          price: formattedCat.price,
          description: formattedCat.description,
          main_image_url: formattedCat.main_image_url,
          gallery_urls: formattedCat.gallery_urls,
          video_url: formattedCat.video_url || null
        }])
        .select();

      if (error) {
        console.error('Failed to insert cat to Supabase:', error);
        setLoading(false);
        throw new Error(error.message || 'Supabase Row Level Security (RLS) error');
      }
      
      if (data && data[0]) {
        inserted = data[0];
      }
    }

    // Always update local state immediately
    setCats(prev => [inserted, ...prev]);
    clearFilters();
    setLoading(false);
    return inserted;
  };

  const updateCat = async (id, updatedFields) => {
    setLoading(true);
    const formattedFields = {
      ...updatedFields,
      category_id: Number(updatedFields.category_id),
      price: updatedFields.price ? parseFloat(updatedFields.price) : 0
    };

    let updatedFromDb = null;
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('cats')
          .update(formattedFields)
          .eq('id', id)
          .select();

        if (!error && data && data[0]) {
          updatedFromDb = data[0];
        }
      } catch (err) {
        console.error('Failed to update cat in Supabase:', err);
      }
    }

    // Always update local state so UI updates immediately
    setCats(prev =>
      prev.map(c => {
        if (c.id === id) {
          return updatedFromDb ? updatedFromDb : { ...c, ...formattedFields };
        }
        return c;
      })
    );
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
    setCategories(prev => prev.filter(c => Number(c.id) !== Number(id)));
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

  // Filtered cats calculation with strict type normalization (Number)
  const filteredCats = cats.filter(cat => {
    // Category match
    if (selectedCategoryId !== null && Number(cat.category_id) !== Number(selectedCategoryId)) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const catName = cat.title.toLowerCase();
      const color = cat.color ? cat.color.toLowerCase() : '';
      const breed = categories.find(c => Number(c.id) === Number(cat.category_id))?.name.toLowerCase() || '';
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
    if (filterState.statusAvailableOnly && cat.status?.toLowerCase() !== 'available') {
      return false;
    }

    return true;
  });

  // Admin Auth Helpers
  const loginAdmin = (username, password) => {
    const validUsername = (username || '').trim().toLowerCase() === 'admin';
    const validPassword = password === 'Sha@1989' || password === 'admin123' || password === 'shacattery';

    if (validUsername && validPassword) {
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

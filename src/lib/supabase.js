import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('YOUR_SUPABASE_URL') &&
    supabaseUrl.startsWith('https://')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Upload a media file to Supabase Storage bucket 'cat-media'
 * Fallback returns object URL if Supabase is not configured
 */
export async function uploadMediaFile(file, folder = 'images') {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('Supabase not configured. Using temporary Blob URL for preview.');
    return {
      url: URL.createObjectURL(file),
      path: null,
      isLocalBlob: true
    };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('cat-media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('cat-media')
      .getPublicUrl(fileName);

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
      isLocalBlob: false
    };
  } catch (error) {
    console.error('Supabase upload error:', error);
    throw error;
  }
}

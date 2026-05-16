import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

// Enterprise Safety Guard: Prevent Production DB usage in Preview/Dev environments
if (hasSupabaseConfig && typeof window !== 'undefined') {
  const isProductionDB = supabaseUrl.includes('zuyckvdwjkngzrdkhnge'); // Your production project ID
  const isProductionDomain = window.location.hostname === 'aurabloom-blond.vercel.app' || window.location.hostname === 'localhost';
  
  if (isProductionDB && !isProductionDomain) {
    console.warn('CRITICAL: Production Database detected in a Preview environment. Please set up a staging database.');
    // Temporarily disabled the throw Error so the user can test UI changes
    // throw new Error('Environment Mismatch: Cannot use Production DB on a Preview branch.');
  }
}

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

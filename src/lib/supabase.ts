import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to placeholder
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is missing. Please check your .env file and add your Supabase project URL.');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is missing. Please check your .env file and add your Supabase project anonymous key.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
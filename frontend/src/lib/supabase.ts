import { createClient } from '@supabase/supabase-js';

// We use the generated .env placeholders
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Safely create the client only if URL is valid to prevent crashing the React app
export const isSupabaseConfigured = supabaseUrl.startsWith('http');
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null as any;

import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Database type definitions — mirrors the countdowns schema
// ---------------------------------------------------------------------------

export interface Countdown {
  id: string;
  user_id: string;
  emoji: string;
  title: string;
  target_date: string;   // ISO date string (YYYY-MM-DD)
  notes: string | null;
  created_at: string;    // ISO timestamptz string
  updated_at: string;    // ISO timestamptz string
}

export interface CountdownInsert {
  id?: string;
  user_id: string;
  emoji?: string;
  title: string;
  target_date: string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CountdownUpdate {
  emoji?: string;
  title?: string;
  target_date?: string;
  notes?: string | null;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      countdowns: {
        Row: Countdown;
        Insert: CountdownInsert;
        Update: CountdownUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ---------------------------------------------------------------------------
// Environment variable guards
// ---------------------------------------------------------------------------

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl) {
  throw new Error(
    'Missing environment variable: VITE_SUPABASE_URL. ' +
    'Add it to your .env file (e.g. VITE_SUPABASE_URL=https://<project>.supabase.co).'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing environment variable: VITE_SUPABASE_ANON_KEY. ' +
    'Add it to your .env file (e.g. VITE_SUPABASE_ANON_KEY=<your-anon-key>).'
  );
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

/**
 * Supabase client — authenticated operations with RLS enforced via JWT.
 * Auth session is persisted automatically by @supabase/supabase-js.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

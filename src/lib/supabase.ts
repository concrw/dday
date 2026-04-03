import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Database type definitions — mirrors the countdowns schema
// ---------------------------------------------------------------------------

export interface Countdown {
  id: string;
  user_id: string;
  title: string;
  target_date: string;        // ISO date string (YYYY-MM-DD)
  description: string | null;
  share_token: string | null;
  created_at: string;         // ISO timestamptz string
  updated_at: string;         // ISO timestamptz string
}

export interface CountdownInsert {
  id?: string;
  user_id: string;
  title: string;
  target_date: string;
  description?: string | null;
  share_token?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CountdownUpdate {
  title?: string;
  target_date?: string;
  description?: string | null;
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
// Clients
// ---------------------------------------------------------------------------

/**
 * Primary client — used for authenticated operations (RLS enforced via JWT).
 * Auth session is persisted automatically by @supabase/supabase-js.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Anon client — explicit instance for unauthenticated share-token reads.
 * Keeps the intent clear at call sites: no user session, public RLS policies only.
 */
export const supabaseAnon = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

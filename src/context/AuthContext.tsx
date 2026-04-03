import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { LOADING_TEXT } from '../constants/text';

interface AuthContextValue {
  userId: string | null;
}

const AuthContext = createContext<AuthContextValue>({ userId: null });

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initSession() {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        if (mounted) setUserId(session.user.id);
      } else {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (mounted && !error && data.user) {
          setUserId(data.user.id);
        }
      }

      if (mounted) setInitializing(false);
    }

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUserId(session?.user?.id ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <p className="text-[#94A3B8] text-sm">{LOADING_TEXT.initializing}</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ userId }}>
      {children}
    </AuthContext.Provider>
  );
}

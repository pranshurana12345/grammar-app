"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";
import { pullProgress, pushAllProgress } from "@/lib/cloudSync";

const PROGRESS_KEY = "grammar_progress";

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  clearError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On first login, merge cloud data with localStorage
  const handleUserLogin = useCallback(async (loggedInUser: User) => {
    const localRaw = typeof window !== "undefined"
      ? localStorage.getItem(PROGRESS_KEY)
      : null;
    const localProgress = localRaw ? JSON.parse(localRaw) : {};

    // Pull cloud data
    const cloudProgress = await pullProgress();

    if (cloudProgress && Object.keys(cloudProgress).length > 0) {
      // Merge: cloud wins for conflicting keys (cloud is more recent)
      const merged = { ...localProgress, ...cloudProgress };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(merged));
    } else if (Object.keys(localProgress).length > 0) {
      // Push local data up to the cloud for new users
      await pushAllProgress(localProgress);
    }
  }, []);

  useEffect(() => {
    const supabase = getSupabase();

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        handleUserLogin(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        handleUserLogin(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [handleUserLogin]);

  const signIn = async (email: string, password: string) => {
    setError(null);
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
  };

  const signUp = async (email: string, password: string) => {
    setError(null);
    const supabase = getSupabase();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setError("Check your email to confirm your account, then log in.");
    }
  };

  const signOut = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut, clearError: () => setError(null) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

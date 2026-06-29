"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { STUDENTS, type Student } from "@/data/students";
import { syncDown } from "@/lib/storage";

const SESSION_KEY = "grammar_current_student";

type AuthState = {
  student: Student | null;
  loading: boolean;
  login: (id: string, pin: string) => boolean;
  logout: () => void;
  // Legacy aliases used in sidebar / other components
  user: Student | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  student: null,
  loading: true,
  login: () => false,
  logout: () => {},
  user: null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as { id: string };
          const found = STUDENTS.find((s) => s.id === saved.id) ?? null;
          setStudent(found);
          // Pull this student's cloud data before showing the app (instant no-op
          // when Supabase isn't configured).
          if (found) await syncDown(found.id);
        }
      } catch {
        // ignore
      }
      setLoading(false);
    })();
  }, []);

  function login(id: string, pin: string): boolean {
    const found = STUDENTS.find((s) => s.id === id);
    if (!found || found.pin !== pin) return false;
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: found.id }));
    setStudent(found);
    void syncDown(found.id); // pull this account's data in the background
    return true;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setStudent(null);
  }

  return (
    <AuthContext.Provider value={{
      student,
      loading,
      login,
      logout,
      user: student,
      signOut: async () => logout(),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

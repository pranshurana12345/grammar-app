"use client";

import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { signIn, user, loading, error, clearError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [user, loading, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await signIn(email, password);
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#0f172a" }}>
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}>
          <span className="text-white text-3xl font-black">G</span>
        </div>
        <h1 className="text-2xl font-black text-white">GrammarFeed</h1>
        <p className="text-slate-400 text-sm mt-1 font-semibold">AFCAT English Prep</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl p-8" style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
          <h2 className="text-xl font-black text-slate-800 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-400 font-semibold mb-6">Sign in to sync your progress</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
              <span className="text-red-500 text-sm flex-shrink-0 mt-0.5">⚠</span>
              <p className="text-red-700 text-xs font-semibold">{error}</p>
              <button onClick={clearError} className="ml-auto text-red-400 text-sm flex-shrink-0">✕</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 transition-colors bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 transition-colors bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !email || !password}
              className="w-full py-3.5 rounded-xl font-black text-sm text-white transition-all press disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)", boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}
            >
              {submitting ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 font-semibold mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 font-black press">Sign up free</Link>
          </p>
        </div>
      </div>

      <p className="text-slate-600 text-xs mt-6 text-center max-w-xs">
        Your progress syncs to the cloud so you never lose your study history.
      </p>
    </div>
  );
}

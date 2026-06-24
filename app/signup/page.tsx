"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function SignupPage() {
  const { signUp, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) return;
    setSubmitting(true);
    await signUp(email, password);
    setSubmitting(false);
    setDone(true);
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

      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl p-8" style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-3xl">✉️</div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Check your email</h2>
              <p className="text-sm text-slate-500 mb-6">
                We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then log in.
              </p>
              <Link href="/login" className="block w-full py-3.5 rounded-xl font-black text-sm text-white text-center press"
                style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)", boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}>
                Go to Login →
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-black text-slate-800 mb-1">Create account</h2>
              <p className="text-sm text-slate-400 font-semibold mb-6">Free forever · progress saved in the cloud</p>

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
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 transition-colors bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-600 mb-1.5 uppercase tracking-wide">Confirm Password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    placeholder="Repeat password"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-slate-800 outline-none transition-colors bg-slate-50 ${
                      confirm && confirm !== password ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"
                    }`}
                  />
                  {confirm && confirm !== password && (
                    <p className="text-xs text-red-500 font-semibold mt-1">Passwords don&apos;t match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting || !email || !password || password !== confirm}
                  className="w-full py-3.5 rounded-xl font-black text-sm text-white transition-all press disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)", boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}
                >
                  {submitting ? "Creating account…" : "Create Account →"}
                </button>
              </form>

              <p className="text-center text-xs text-slate-400 font-semibold mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 font-black press">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

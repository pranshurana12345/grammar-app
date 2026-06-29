"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { STUDENTS, type Student } from "@/data/students";

export default function LoginPage() {
  const { login, student, loading } = useAuth();
  const router = useRouter();

  const [selected, setSelected] = useState<Student | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!loading && student) router.replace("/");
  }, [student, loading, router]);

  function handleSelectStudent(s: Student) {
    setSelected(s);
    setPin("");
    setError(false);
  }

  function handleDigit(d: string) {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError(false);

    if (next.length === 4 && selected) {
      const ok = login(selected.id, next);
      if (ok) {
        router.replace("/");
      } else {
        setError(true);
        setTimeout(() => { setPin(""); setError(false); }, 800);
      }
    }
  }

  function handleBackspace() {
    setPin((p) => p.slice(0, -1));
    setError(false);
  }

  const initials = (name: string) => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "#0f172a" }}>

      {/* Logo */}
      <div className="mb-10 text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: "linear-gradient(135deg, #2d7ff9, #4f46e5)" }}>
          <span className="text-white text-2xl font-black">G</span>
        </div>
        <h1 className="text-xl font-black text-white">Grammy</h1>
        <p className="text-slate-500 text-sm mt-0.5">AFCAT English Prep</p>
      </div>

      {!selected ? (
        /* ── User picker ── */
        <div className="w-full max-w-sm">
          <p className="text-slate-400 text-sm font-semibold text-center mb-6">Who are you?</p>
          <div className="space-y-2.5">
            {STUDENTS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectStudent(s)}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl press transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-base"
                  style={{ background: s.color }}>
                  {initials(s.name)}
                </div>
                <span className="text-white font-semibold text-[15px]">{s.name}</span>
                <svg className="ml-auto text-slate-600" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ── PIN entry ── */
        <div className="w-full max-w-xs">
          {/* Back + selected user */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setSelected(null)} className="text-slate-500 press">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-2 text-white font-black text-xl"
                style={{ background: selected.color }}>
                {initials(selected.name)}
              </div>
              <p className="text-white font-bold text-base">{selected.name}</p>
              <p className="text-slate-500 text-xs mt-0.5">Enter your 4-digit PIN</p>
            </div>
            <div className="w-5" />
          </div>

          {/* PIN dots */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full transition-all duration-150"
                style={{
                  background: error
                    ? "#ef4444"
                    : i < pin.length
                      ? selected.color
                      : "rgba(255,255,255,0.12)",
                  transform: error ? "scale(1.2)" : "scale(1)",
                }}
              />
            ))}
          </div>

          {/* Error hint */}
          {error && (
            <p className="text-red-400 text-xs text-center mb-4 font-semibold">Wrong PIN. Try again.</p>
          )}

          {/* Number pad */}
          <div className="grid grid-cols-3 gap-3">
            {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((key, i) => {
              if (key === "") return <div key={i} />;
              return (
                <button
                  key={key}
                  onClick={() => key === "⌫" ? handleBackspace() : handleDigit(key)}
                  className="h-16 rounded-2xl flex items-center justify-center press transition-all"
                  style={{
                    background: key === "⌫" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: key === "⌫" ? "#64748b" : "#fff",
                    fontSize: key === "⌫" ? 20 : 22,
                    fontWeight: 700,
                  }}
                >
                  {key}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

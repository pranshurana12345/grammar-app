"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { apiBase } from "@/lib/practice";

export type ChatMsg = { role: "user" | "assistant"; content: string };

// Full-screen AI chat. `context` describes what the student is looking at
// (a rule / practice question / their stats) and is sent with every request;
// `contextPreview` shows that context to the student inside the chat.
// Rendered through a portal to <body> so it sits above reels and the nav.
export default function AskAISheet({
  title, context, contextPreview, open, onClose, seed, suggestions,
}: {
  title: string;
  context: string;
  contextPreview?: string;
  open: boolean;
  onClose: () => void;
  seed?: string;           // optional first user message to auto-send on open
  suggestions?: string[];  // tappable starter questions shown while empty
}) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open && seed && !seededRef.current && messages.length === 0) {
      seededRef.current = true;
      void send(seed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    setError("");
    const next: ChatMsg[] = [...messages, { role: "user", content: t }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch(`${apiBase()}/api/ask/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI is unavailable right now");
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex flex-col" role="dialog" aria-modal="true"
      style={{ background: "#eef2fb", animation: "askai-in 0.28s cubic-bezier(0.2,0.8,0.25,1)" }}>
      <style>{`@keyframes askai-in { from { transform: translateY(28px); opacity: 0.4; } to { transform: translateY(0); opacity: 1; } }
@keyframes askai-pop { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

      {/* ── Header ── */}
      <div className="flex-shrink-0 relative overflow-hidden"
        style={{ background: "linear-gradient(120deg,#1e3a8a 0%,#2d7ff9 55%,#7c3aed 100%)", paddingTop: "env(safe-area-inset-top)" }}>
        <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, white, transparent)" }} />
        <div className="relative flex items-center gap-3 px-4 py-3.5">
          <button onClick={onClose} aria-label="Back"
            className="w-9 h-9 rounded-full flex items-center justify-center press flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.16)" }}>
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}>✨</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[15px] font-black leading-tight truncate">{title}</p>
            <p className="text-blue-200 text-[10.5px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Grammy AI · knows all 101 rules &amp; AFCAT
            </p>
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
        {/* context card — what the AI can see */}
        {contextPreview && (
          <div className="rounded-2xl px-4 py-3 bg-white"
            style={{ border: "1px solid #dbe4f6", borderLeft: "3px solid #2d7ff9", boxShadow: "0 2px 8px -4px rgba(15,23,42,0.10)" }}>
            <p className="text-[9.5px] font-black text-blue-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5.2" stroke="#2d7ff9" strokeWidth="1.3" />
                <path d="M3.8 6.2l1.6 1.6 3-3.6" stroke="#2d7ff9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              AI can see this
            </p>
            <p className="text-[12.5px] text-slate-600 leading-snug font-medium whitespace-pre-wrap"
              style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {contextPreview}
            </p>
          </div>
        )}

        {/* empty state + suggestion chips */}
        {messages.length === 0 && !busy && (
          <div className="pt-6" style={{ animation: "askai-pop 0.35s ease" }}>
            <div className="text-center mb-5">
              <div className="w-16 h-16 mx-auto rounded-3xl flex items-center justify-center text-3xl mb-3"
                style={{ background: "linear-gradient(135deg,#2d7ff9,#7c3aed)", boxShadow: "0 10px 30px -8px rgba(45,127,249,0.5)" }}>🤖</div>
              <p className="text-slate-800 text-[15px] font-black">Ask me anything!</p>
              <p className="text-slate-400 text-[12px] font-semibold mt-1">English or Hinglish — rules, words, AFCAT, strategy…</p>
            </div>
            {suggestions && suggestions.length > 0 && (
              <div className="flex flex-col gap-2 max-w-sm mx-auto">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => void send(s)}
                    className="press text-left bg-white rounded-2xl px-4 py-3 text-[13px] font-semibold text-slate-700 flex items-center justify-between gap-2"
                    style={{ border: "1px solid #dbe4f6", boxShadow: "0 2px 8px -4px rgba(15,23,42,0.08)" }}>
                    <span>{s}</span>
                    <span className="text-blue-400 flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h9M9 4.5L12.5 8 9 11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((m, i) => (
          m.role === "user" ? (
            <div key={i} className="flex justify-end" style={{ animation: "askai-pop 0.25s ease" }}>
              <div className="max-w-[82%] rounded-3xl rounded-br-lg px-4 py-2.5 text-[13.5px] leading-relaxed text-white whitespace-pre-wrap"
                style={{ background: "linear-gradient(135deg,#2d7ff9,#4f46e5)", boxShadow: "0 4px 14px -6px rgba(45,127,249,0.5)" }}>
                {m.content}
              </div>
            </div>
          ) : (
            <div key={i} className="flex items-end gap-2" style={{ animation: "askai-pop 0.25s ease" }}>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[13px] flex-shrink-0 mb-0.5"
                style={{ background: "linear-gradient(135deg,#2d7ff9,#7c3aed)" }}>✨</div>
              <div className="max-w-[82%] bg-white rounded-3xl rounded-bl-lg px-4 py-3 text-[13.5px] leading-relaxed text-slate-800 whitespace-pre-wrap"
                style={{ border: "1px solid #e5eaf6", boxShadow: "0 2px 10px -6px rgba(15,23,42,0.12)" }}>
                {m.content}
              </div>
            </div>
          )
        ))}

        {busy && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[13px] flex-shrink-0 mb-0.5"
              style={{ background: "linear-gradient(135deg,#2d7ff9,#7c3aed)" }}>✨</div>
            <div className="bg-white rounded-3xl rounded-bl-lg px-4 py-3.5 flex gap-1.5 items-center"
              style={{ border: "1px solid #e5eaf6" }}>
              {[0, 1, 2].map((d) => (
                <span key={d} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        {error && (
          <div className="text-center">
            <p className="inline-block bg-rose-50 border border-rose-200 text-rose-600 text-[12px] font-semibold px-4 py-2 rounded-full">{error}</p>
          </div>
        )}
      </div>

      {/* ── Input bar ── */}
      <form className="flex-shrink-0 flex items-center gap-2 px-3 pt-2.5 bg-white border-t border-slate-100"
        style={{ paddingBottom: "calc(0.7rem + env(safe-area-inset-bottom))" }}
        onSubmit={(e) => { e.preventDefault(); void send(input); }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything…"
          className="flex-1 rounded-full bg-slate-100 px-4.5 py-3 text-[14.5px] text-slate-800 outline-none focus:ring-2 focus:ring-blue-300"
          style={{ paddingLeft: "1.1rem" }} />
        <button type="submit" disabled={busy || !input.trim()}
          className="w-11 h-11 rounded-full flex items-center justify-center text-white press disabled:opacity-40 flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#2d7ff9,#4f46e5)", boxShadow: "0 4px 12px -4px rgba(45,127,249,0.6)" }}
          aria-label="Send">
          <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
            <path d="M2 8h11M9 4l4 4-4 4" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>,
    document.body,
  );
}

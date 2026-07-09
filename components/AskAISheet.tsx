"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { apiBase } from "@/lib/practice";

export type ChatMsg = { role: "user" | "assistant"; content: string };

// Bottom-sheet AI chat. `context` describes what the student is looking at
// (a rule or a practice question) and is sent with every request;
// `contextPreview` shows that context to the student inside the chat.
//
// Rendered through a portal to <body> so it always sits above fixed
// containers (reels) and the bottom nav.
export default function AskAISheet({
  title, context, contextPreview, open, onClose, seed,
}: {
  title: string;
  context: string;
  contextPreview?: string;
  open: boolean;
  onClose: () => void;
  seed?: string; // optional first user message to auto-send on open
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
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* sheet */}
      <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white flex flex-col overflow-hidden"
        style={{ height: "78dvh", boxShadow: "0 -12px 40px rgba(0,0,0,0.25)" }}>

        {/* header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 flex-shrink-0">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#2d7ff9,#7c3aed)" }}>✨</div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Ask AI</p>
            <p className="text-[13px] font-bold text-slate-800 truncate">{title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center press" aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 8M11 3l-8 8" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* messages */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* context card — shows the student what the AI can see */}
          {contextPreview && (
            <div className="rounded-2xl px-3.5 py-3"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderLeft: "3px solid #2d7ff9" }}>
              <p className="text-[9.5px] font-black text-blue-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 6.5l2 2 4-5" stroke="#2d7ff9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="6" cy="6" r="5.2" stroke="#2d7ff9" strokeWidth="1.2" />
                </svg>
                AI can see this
              </p>
              <p className="text-[12px] text-slate-600 leading-snug font-medium whitespace-pre-wrap"
                style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {contextPreview}
              </p>
            </div>
          )}

          {messages.length === 0 && !busy && (
            <div className="text-center pt-6">
              <div className="text-4xl mb-2">🤖</div>
              <p className="text-slate-500 text-[13px] font-semibold">Ask me anything about this —<br />in English or Hinglish!</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap ${
                m.role === "user" ? "text-white rounded-br-md" : "bg-slate-100 text-slate-800 rounded-bl-md"
              }`}
                style={m.role === "user" ? { background: "#2d7ff9" } : undefined}>
                {m.content}
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 items-center">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          {error && <p className="text-center text-[12px] font-semibold text-rose-500">{error}</p>}
        </div>

        {/* input */}
        <form className="flex items-center gap-2 px-3 py-3 border-t border-slate-100 flex-shrink-0"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
          onSubmit={(e) => { e.preventDefault(); void send(input); }}>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Type your doubt…"
            className="flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-[14px] text-slate-800 outline-none focus:ring-2 focus:ring-blue-300" />
          <button type="submit" disabled={busy || !input.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white press disabled:opacity-40 flex-shrink-0"
            style={{ background: "#2d7ff9" }} aria-label="Send">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h11M9 4l4 4-4 4" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { rules } from "@/data/rules";
import { apiBase } from "@/lib/practice";

// ── Question Solving Session ────────────────────────────────────────────────
// For working through a real question paper. The student types, SPEAKS or
// PHOTOGRAPHS a question; the AI solves it and — the whole point — ties the
// answer back to one of the app's 101 rules, explains that rule, then shows how
// it decides this particular question.
//
// The reply arrives as labelled plain text (see app/api/solve/route.ts) which we
// parse into cards as it streams.

type Attachment = { thumb: string };
type Msg = { role: "user" | "assistant"; content: string; attachment?: Attachment };

type Solution = {
  q?: string; answer?: string; rule?: string; why?: string; apply?: string; trap?: string;
  /** Set when the AI ran out of room and left some questions unsolved. */
  more?: string;
};

const LABELS: Record<string, keyof Solution> = {
  Q: "q", ANSWER: "answer", RULE: "rule", WHY: "why", APPLY: "apply", TRAP: "trap", MORE: "more",
};
const LABEL_RE = /^\s*(Q|ANSWER|RULE|WHY|APPLY|TRAP|MORE)\s*:\s*(.*)$/i;

/** Split a (possibly still streaming) reply into solution blocks. Returns null
 *  when the text carries no labels at all — that's a conversational follow-up. */
function parseSolutions(text: string): Solution[] | null {
  if (!LABEL_RE.test(text.split("\n").find((l) => LABEL_RE.test(l)) ?? "")) return null;
  return text
    .split(/^\s*-{3,}\s*$/m)
    .map((chunk) => {
      const block: Solution = {};
      let field: keyof Solution | null = null;
      for (const line of chunk.split("\n")) {
        const m = line.match(LABEL_RE);
        if (m) {
          field = LABELS[m[1].toUpperCase()];
          block[field] = m[2].trim();
        } else if (field && line.trim()) {
          block[field] = `${block[field] ?? ""} ${line.trim()}`.trim();
        }
      }
      return block;
    })
    .filter((b) => Object.keys(b).length > 0);
}

/** Match a cited rule back to the real rulebook so we can link to it. Models can
 *  invent rule numbers — an unmatched citation just renders as plain text. */
function findRule(citation = "") {
  const num = citation.match(/rule\s*0*(\d{1,3})/i);
  if (num) return rules.find((r) => r.ruleNumber.toLowerCase() === `rule ${Number(num[1])}`);
  if (/bonus/i.test(citation)) return rules.find((r) => r.ruleNumber === "BONUS");
  return undefined;
}

// Photos go up as data URLs; shrink them first so the upload is quick on mobile
// data and stays well inside the request limit.
async function downscaleImage(file: File, max = 1500, quality = 0.72): Promise<string> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't read that image");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", quality);
}

function pickAudioMime(): string {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c)) return c;
  }
  return "";
}

export default function QuestionSolver({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");      // "Reading photo…" / "Listening…"
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy, status]);

  // Recording timer.
  useEffect(() => {
    if (!recording) { setSeconds(0); return; }
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  // Never leave the mic live if the sheet is closed mid-recording.
  useEffect(() => {
    if (!open && recorderRef.current?.state === "recording") recorderRef.current.stop();
  }, [open]);

  // ── Solve ─────────────────────────────────────────────────────────────────
  async function send(text: string, attachment?: Attachment) {
    const t = text.trim();
    if (!t || busy) return;
    setError("");
    setStatus("");
    const next: Msg[] = [...messages, { role: "user", content: t, attachment }];
    setMessages(next);
    setInput("");
    setPendingImage(null);
    setBusy(true);
    try {
      const res = await fetch(`${apiBase()}/api/solve/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "AI is unavailable right now");
      }
      if (!res.body) throw new Error("AI is unavailable right now");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      let started = false;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        if (!started) { started = true; setBusy(false); }
        setMessages([...next, { role: "assistant", content: reply }]);
      }
      if (!reply.trim()) throw new Error("AI is unavailable right now");
      setMessages([...next, { role: "assistant", content: reply.trim() }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  // ── Camera ────────────────────────────────────────────────────────────────
  async function handleImage(file: File) {
    setError("");
    setStatus("Reading your photo…");
    try {
      const dataUrl = await downscaleImage(file);
      setPendingImage(dataUrl);
      const res = await fetch(`${apiBase()}/api/vision/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't read that photo");
      // Drop it into the box rather than sending straight away, so the student
      // can fix an OCR slip before it's solved.
      setInput((prev) => (prev ? `${prev}\n${data.text}` : data.text));
    } catch (e) {
      setPendingImage(null);
      setError(e instanceof Error ? e.message : "Couldn't read that photo");
    } finally {
      setStatus("");
    }
  }

  // ── Voice ─────────────────────────────────────────────────────────────────
  async function startRecording() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickAudioMime();
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((tr) => tr.stop());
        setRecording(false);
        const type = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        if (blob.size < 1200) { setError("That was too short — hold on a moment longer."); return; }
        setStatus("Writing down what you said…");
        try {
          const ext = type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm";
          const form = new FormData();
          form.append("audio", blob, `clip.${ext}`);
          const res = await fetch(`${apiBase()}/api/transcribe/`, { method: "POST", body: form });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Couldn't hear that");
          setInput((prev) => (prev ? `${prev} ${data.text}` : data.text));
        } catch (e) {
          setError(e instanceof Error ? e.message : "Couldn't hear that");
        } finally {
          setStatus("");
        }
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError("I need microphone permission to listen. Allow it in your browser settings.");
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    else setRecording(false);
  }

  function reset() {
    setMessages([]); setInput(""); setPendingImage(null); setError(""); setStatus("");
  }

  if (!open || !mounted) return null;

  const canSend = !!input.trim() && !busy && !recording;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex flex-col" role="dialog" aria-modal="true"
      style={{ background: "#eef2fb", animation: "solver-in 0.28s cubic-bezier(0.2,0.8,0.25,1)" }}>
      <style>{`@keyframes solver-in { from { transform: translateY(28px); opacity: 0.4; } to { transform: translateY(0); opacity: 1; } }
@keyframes solver-pop { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes solver-pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.12); opacity: 0.75; } }`}</style>

      {/* ── Header ── */}
      <div className="flex-shrink-0 relative overflow-hidden"
        style={{ background: "linear-gradient(120deg,#0f766e 0%,#0d9488 45%,#2d7ff9 100%)", paddingTop: "env(safe-area-inset-top)" }}>
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
            style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}>📝</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[15px] font-black leading-tight truncate">Question Solver</p>
            <p className="text-teal-100 text-[10.5px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" />
              Answer · the rule · why it applies
            </p>
          </div>
          {messages.length > 0 && (
            <button onClick={reset}
              className="press text-[11px] font-black text-white px-3 py-1.5 rounded-full flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.16)" }}>
              New
            </button>
          )}
        </div>
      </div>

      {/* ── Conversation ── */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
        {messages.length === 0 && !busy && (
          <div className="pt-4" style={{ animation: "solver-pop 0.35s ease" }}>
            <div className="text-center mb-5">
              <div className="w-16 h-16 mx-auto rounded-3xl flex items-center justify-center text-3xl mb-3"
                style={{ background: "linear-gradient(135deg,#0d9488,#2d7ff9)", boxShadow: "0 10px 30px -8px rgba(13,148,136,0.5)" }}>🧩</div>
              <p className="text-slate-800 text-[15px] font-black">Solving a question paper?</p>
              <p className="text-slate-400 text-[12px] font-semibold mt-1 px-6 leading-relaxed">
                Send me any question — I&apos;ll answer it, name the rule behind it, and show you exactly how that rule decides it.
              </p>
            </div>
            <div className="max-w-sm mx-auto space-y-2">
              {[
                { icon: "⌨️", title: "Type or paste it", note: "Whole question with all options" },
                { icon: "🎤", title: "Speak it", note: "Tap the mic and read the question out" },
                { icon: "📷", title: "Photograph it", note: "Snap the paper — even a few questions at once" },
              ].map((s) => (
                <div key={s.title} className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3"
                  style={{ border: "1px solid #dbe4f6", boxShadow: "0 2px 8px -4px rgba(15,23,42,0.08)" }}>
                  <span className="text-lg flex-shrink-0">{s.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-black text-slate-700">{s.title}</p>
                    <p className="text-[11px] text-slate-400 font-semibold">{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => void send("Each of the cadets were given a new uniform. (a) Each of the cadets (b) were given (c) a new uniform (d) No error")}
              className="press mt-4 mx-auto block text-[12px] font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-4 py-2">
              Try it with a sample question →
            </button>
          </div>
        )}

        {messages.map((m, i) => (
          m.role === "user"
            ? <UserBubble key={i} msg={m} />
            : <AssistantAnswer key={i} text={m.content} onNavigate={onClose}
                onContinue={i === messages.length - 1 && !busy ? () => void send("continue") : undefined} />
        ))}

        {(busy || status) && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[13px] flex-shrink-0 mb-0.5"
              style={{ background: "linear-gradient(135deg,#0d9488,#2d7ff9)" }}>✨</div>
            <div className="bg-white rounded-3xl rounded-bl-lg px-4 py-3 flex gap-2 items-center"
              style={{ border: "1px solid #e5eaf6" }}>
              <span className="flex gap-1.5">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </span>
              {status && <span className="text-[12px] font-bold text-slate-500">{status}</span>}
            </div>
          </div>
        )}

        {error && (
          <div className="text-center">
            <p className="inline-block bg-rose-50 border border-rose-200 text-rose-600 text-[12px] font-semibold px-4 py-2 rounded-full">{error}</p>
          </div>
        )}
      </div>

      {/* ── Composer ── */}
      <div className="flex-shrink-0 bg-white border-t border-slate-100 px-3 pt-2.5"
        style={{ paddingBottom: "calc(0.7rem + env(safe-area-inset-bottom))" }}>

        {pendingImage && (
          <div className="flex items-center gap-2 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pendingImage} alt="Question" className="w-12 h-12 rounded-xl object-cover" style={{ border: "1px solid #dbe4f6" }} />
            <p className="text-[11px] font-bold text-slate-400 flex-1">Photo read — check the text before sending.</p>
            <button onClick={() => setPendingImage(null)} className="text-slate-300 text-lg px-1 press" aria-label="Remove photo">×</button>
          </div>
        )}

        {recording ? (
          <div className="flex items-center gap-3 px-1 py-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0" style={{ animation: "solver-pulse 1s ease-in-out infinite" }} />
            <p className="flex-1 text-[13px] font-black text-slate-700">
              Listening… {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
            </p>
            <button onClick={stopRecording}
              className="press px-4 py-2.5 rounded-full text-white text-[13px] font-black flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#f43f5e,#e11d48)" }}>
              Stop &amp; use
            </button>
          </div>
        ) : (
          <form className="flex items-end gap-2"
            onSubmit={(e) => { e.preventDefault(); void send(input, pendingImage ? { thumb: pendingImage } : undefined); }}>
            <button type="button" onClick={() => fileRef.current?.click()} disabled={!!status}
              className="w-11 h-11 rounded-full flex items-center justify-center press flex-shrink-0 disabled:opacity-40"
              style={{ background: "#f1f5f9" }} aria-label="Add a photo of the question">
              <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
                <path d="M3 7.5A1.5 1.5 0 014.5 6h1.2a1 1 0 00.86-.5l.6-1A1 1 0 018 4h4a1 1 0 01.86.5l.6 1a1 1 0 00.86.5h1.18A1.5 1.5 0 0117 7.5v7A1.5 1.5 0 0115.5 16h-11A1.5 1.5 0 013 14.5v-7z"
                  stroke="#475569" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="10" cy="10.8" r="2.6" stroke="#475569" strokeWidth="1.5" />
              </svg>
            </button>
            <button type="button" onClick={() => void startRecording()} disabled={!!status}
              className="w-11 h-11 rounded-full flex items-center justify-center press flex-shrink-0 disabled:opacity-40"
              style={{ background: "#f1f5f9" }} aria-label="Speak the question">
              <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
                <rect x="7.5" y="2.5" width="5" height="9.5" rx="2.5" stroke="#475569" strokeWidth="1.5" />
                <path d="M4.5 9.5a5.5 5.5 0 0011 0M10 15v2.5" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={1}
              placeholder="Type or paste the question…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && canSend) {
                  e.preventDefault();
                  void send(input, pendingImage ? { thumb: pendingImage } : undefined);
                }
              }}
              className="flex-1 rounded-3xl bg-slate-100 px-4 py-3 text-[14.5px] text-slate-800 outline-none focus:ring-2 focus:ring-teal-300 resize-none max-h-32" />
            <button type="submit" disabled={!canSend}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white press disabled:opacity-40 flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#0d9488,#2d7ff9)", boxShadow: "0 4px 12px -4px rgba(13,148,136,0.6)" }}
              aria-label="Solve">
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h11M9 4l4 4-4 4" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = ""; // let the same file be picked twice
            if (f) void handleImage(f);
          }} />
      </div>
    </div>,
    document.body,
  );
}

// ── Pieces ──────────────────────────────────────────────────────────────────

function UserBubble({ msg }: { msg: Msg }) {
  return (
    <div className="flex justify-end" style={{ animation: "solver-pop 0.25s ease" }}>
      <div className="max-w-[85%] rounded-3xl rounded-br-lg px-4 py-2.5 text-[13.5px] leading-relaxed text-white whitespace-pre-wrap"
        style={{ background: "linear-gradient(135deg,#0d9488,#2d7ff9)", boxShadow: "0 4px 14px -6px rgba(13,148,136,0.5)" }}>
        {msg.attachment && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={msg.attachment.thumb} alt="Question" className="rounded-xl mb-2 w-full" style={{ maxHeight: 160, objectFit: "cover" }} />
        )}
        {msg.content}
      </div>
    </div>
  );
}

function AssistantAnswer({ text, onNavigate, onContinue }: {
  text: string; onNavigate: () => void; onContinue?: () => void;
}) {
  const blocks = parseSolutions(text);

  // A follow-up answer (no labels) is just a chat bubble.
  if (!blocks) {
    return (
      <div className="flex items-end gap-2" style={{ animation: "solver-pop 0.25s ease" }}>
        <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[13px] flex-shrink-0 mb-0.5"
          style={{ background: "linear-gradient(135deg,#0d9488,#2d7ff9)" }}>✨</div>
        <div className="max-w-[85%] bg-white rounded-3xl rounded-bl-lg px-4 py-3 text-[13.5px] leading-relaxed text-slate-800 whitespace-pre-wrap"
          style={{ border: "1px solid #e5eaf6", boxShadow: "0 2px 10px -6px rgba(15,23,42,0.12)" }}>
          {text}
        </div>
      </div>
    );
  }

  const left = blocks.find((b) => b.more)?.more;
  const solved = blocks.filter((b) => b.answer || b.q);

  return (
    <div className="space-y-3">
      {solved.map((b, i) => (
        <SolutionCard key={i} block={b} index={i} total={solved.length} onNavigate={onNavigate} />
      ))}
      {left && onContinue && (
        <button onClick={onContinue} className="press w-full rounded-2xl py-3 text-[13px] font-black text-teal-700"
          style={{ background: "#ccfbf1", border: "1px solid #5eead4" }}>
          Solve the rest ({left.replace(/[^0-9]/g, "") || "more"}) →
        </button>
      )}
    </div>
  );
}

function SolutionCard({ block, index, total, onNavigate }: {
  block: Solution; index: number; total: number; onNavigate: () => void;
}) {
  const rule = findRule(block.rule);
  return (
    <div className="bg-white rounded-3xl overflow-hidden" style={{ border: "1px solid #e2e8f5", boxShadow: "0 4px 16px -8px rgba(15,23,42,0.15)", animation: "solver-pop 0.3s ease" }}>

      {/* the question being solved */}
      {block.q && (
        <div className="px-4 pt-3.5 pb-3" style={{ background: "#f8fafc", borderBottom: "1px solid #eef2f7" }}>
          {total > 1 && (
            <p className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest mb-1">Question {index + 1} of {total}</p>
          )}
          <p className="text-[12.5px] font-bold text-slate-600 leading-snug">{block.q}</p>
        </div>
      )}

      {/* 1 — the answer */}
      {block.answer && (
        <div className="px-4 py-3.5" style={{ background: "linear-gradient(135deg,#ecfdf5,#f0fdfa)" }}>
          <p className="text-[9.5px] font-black text-emerald-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px]">✓</span>
            Answer
          </p>
          <p className="text-[14.5px] font-black text-emerald-900 leading-snug">{block.answer}</p>
        </div>
      )}

      {/* 2 — the rule it comes from, tappable when it's one of the 101 */}
      {block.rule && (
        rule ? (
          <Link href={`/feed?rule=${rule.id}`} onClick={onNavigate} className="block press">
            <div className="px-4 py-3 flex items-center gap-2.5" style={{ background: "#eff6ff", borderTop: "1px solid #e0e7ff" }}>
              <span className="w-7 h-7 rounded-xl flex items-center justify-center text-[13px] flex-shrink-0"
                style={{ background: rule.sectionColor || "#2d7ff9" }}>📘</span>
              <div className="flex-1 min-w-0">
                <p className="text-[9.5px] font-black text-blue-500 uppercase tracking-widest">Rule used · tap to open</p>
                <p className="text-[13px] font-black text-blue-900 leading-snug">{rule.ruleNumber} — {rule.title}</p>
              </div>
              <span className="text-blue-300 text-lg flex-shrink-0">›</span>
            </div>
          </Link>
        ) : (
          <div className="px-4 py-3 flex items-center gap-2.5" style={{ background: "#f8fafc", borderTop: "1px solid #eef2f7" }}>
            <span className="w-7 h-7 rounded-xl bg-slate-200 flex items-center justify-center text-[13px] flex-shrink-0">📘</span>
            <div className="flex-1 min-w-0">
              <p className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest">Rule used</p>
              <p className="text-[13px] font-black text-slate-700 leading-snug">{block.rule}</p>
            </div>
          </div>
        )
      )}

      {/* 3 — what the rule says, 4 — how it decides this question */}
      <div className="px-4 py-3.5 space-y-3">
        {block.why && (
          <div>
            <p className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest mb-1">What the rule says</p>
            <p className="text-[13px] text-slate-700 leading-relaxed">{block.why}</p>
          </div>
        )}
        {block.apply && (
          <div>
            <p className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest mb-1">How it applies here</p>
            <p className="text-[13px] text-slate-700 leading-relaxed">{block.apply}</p>
          </div>
        )}
        {block.trap && (
          <div className="rounded-2xl px-3.5 py-2.5" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
            <p className="text-[9.5px] font-black text-amber-600 uppercase tracking-widest mb-1">⚠️ Common trap</p>
            <p className="text-[12.5px] text-amber-900 leading-relaxed">{block.trap}</p>
          </div>
        )}
      </div>
    </div>
  );
}

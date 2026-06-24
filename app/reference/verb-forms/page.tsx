"use client";

import { useState, useMemo } from "react";
import { VERB_GROUPS, INVARIANT_NOUNS, IRREGULAR_NOUNS } from "@/data/verbForms";
import Link from "next/link";

type Tab = "verbs" | "invariant" | "irregular";

export default function VerbFormsPage() {
  const [tab, setTab] = useState<Tab>("verbs");
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase().trim();
    return VERB_GROUPS.map((g) => ({
      ...g,
      verbs: g.verbs.filter(
        (v) =>
          !q ||
          v.v1.toLowerCase().includes(q) ||
          v.v2.toLowerCase().includes(q) ||
          v.v3.toLowerCase().includes(q) ||
          v.meaning.toLowerCase().includes(q)
      ),
    })).filter((g) => (activeGroup === "all" || g.id === activeGroup) && g.verbs.length > 0);
  }, [search, activeGroup]);

  const totalVerbs = VERB_GROUPS.reduce((sum, g) => sum + g.verbs.length, 0);

  return (
    <div className="min-h-screen sidebar-offset pb-20" style={{ background: "#f0f4ff" }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20" style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/reference" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm press md:hidden">←</Link>
            <div className="hidden md:flex items-center gap-2">
              <Link href="/reference" className="text-slate-400 text-sm hover:text-slate-600 press">Reference</Link>
              <span className="text-slate-300">/</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800">Verb Forms</h1>
              <p className="text-[11px] text-slate-400 font-semibold">{totalVerbs} irregular verbs · nouns · special cases</p>
            </div>
          </div>

          {/* Tab row */}
          <div className="flex gap-2 mt-3">
            {([["verbs", "⚡ Verb Forms"], ["invariant", "🔁 Same S/P"], ["irregular", "📐 Irregular Nouns"]] as [Tab, string][]).map(([t, label]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold press transition-colors"
                style={tab === t ? { background: "#2563eb", color: "#fff" } : { background: "#f1f5f9", color: "#64748b" }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-4">
        {/* VERB FORMS TAB */}
        {tab === "verbs" && (
          <div>
            {/* Search + filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search verbs (e.g. go, knew, broken)..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 transition-colors"
              />
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveGroup("all")}
                  className="px-3 py-2 rounded-xl text-xs font-bold press"
                  style={activeGroup === "all" ? { background: "#0f172a", color: "#fff" } : { background: "#fff", color: "#64748b", border: "1px solid #e2e8f0" }}
                >
                  All
                </button>
                {VERB_GROUPS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActiveGroup(g.id)}
                    className="px-3 py-2 rounded-xl text-xs font-bold press"
                    style={activeGroup === g.id ? { background: g.color, color: "#fff" } : { background: "#fff", color: "#64748b", border: "1px solid #e2e8f0" }}
                  >
                    {g.label.split(" — ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {search && (
              <p className="text-xs text-slate-400 font-semibold mb-3">
                {filteredGroups.reduce((s, g) => s + g.verbs.length, 0)} results for &quot;{search}&quot;
              </p>
            )}

            {filteredGroups.map((group) => (
              <div key={group.id} className="mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-black text-slate-800">{group.label}</h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-white" style={{ background: group.color }}>
                        {group.pattern}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{group.verbs.length} verbs</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{group.description}</p>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl overflow-hidden bg-white border border-slate-100" style={{ boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>
                  {/* Header row */}
                  <div className="grid grid-cols-4 px-4 py-2.5 text-[11px] font-black text-slate-400 border-b border-slate-100" style={{ background: `${group.color}08` }}>
                    <span>V1 (Base)</span>
                    <span>V2 (Past Simple)</span>
                    <span>V3 (Past Participle)</span>
                    <span className="hidden sm:block">Meaning</span>
                  </div>

                  {group.verbs.map((verb, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-4 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-black text-sm text-slate-800">{verb.v1}</span>
                      <span className="font-bold text-sm" style={{ color: group.color }}>{verb.v2}</span>
                      <span className="font-bold text-sm" style={{ color: group.color }}>{verb.v3}</span>
                      <div className="hidden sm:block">
                        <p className="text-xs text-slate-500">{verb.meaning}</p>
                        {verb.note && (
                          <p className="text-[10px] text-amber-600 font-semibold mt-0.5">⚠ {verb.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile: show notes below table */}
                {group.verbs.some((v) => v.note) && (
                  <div className="sm:hidden mt-2 space-y-1.5">
                    {group.verbs.filter((v) => v.note).map((v, i) => (
                      <div key={i} className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-100">
                        <span className="font-black text-xs text-amber-800">{v.v1}:</span>
                        <span className="text-xs text-amber-700 ml-1">{v.note}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filteredGroups.length === 0 && (
              <div className="text-center py-12">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-slate-500 font-semibold">No verbs found for &quot;{search}&quot;</p>
                <button onClick={() => setSearch("")} className="mt-2 text-blue-600 text-sm font-bold press">Clear search</button>
              </div>
            )}

            {/* AFCAT tip box */}
            <div className="mt-4 px-4 py-4 rounded-2xl bg-amber-50 border border-amber-200">
              <p className="text-xs font-black text-amber-800 mb-1">🎯 AFCAT Quick Strategy</p>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• <strong>AAA group</strong>: Never add -ed (cut/cut/cut, not cutted)</li>
                <li>• <strong>ABB group</strong>: V2 and V3 are same — most common in tense questions</li>
                <li>• <strong>lie/lay/lain</strong> vs <strong>lay/laid/laid</strong> — top error-spotting trap</li>
                <li>• <strong>rise/rose/risen</strong> = goes up alone; <strong>raise/raised/raised</strong> = you lift something</li>
                <li>• flow/flowed/flowed is REGULAR — do not write &quot;flew&quot; for flow</li>
              </ul>
            </div>
          </div>
        )}

        {/* SAME SINGULAR/PLURAL TAB */}
        {tab === "invariant" && (
          <div>
            <div className="px-4 py-3 rounded-2xl bg-blue-50 border border-blue-200 mb-4">
              <p className="text-xs font-black text-blue-800 mb-1">📌 Same in Singular & Plural</p>
              <p className="text-xs text-blue-700">These words do NOT change when they become plural — no &quot;-s&quot; added. Very commonly tested in Subject-Verb Agreement questions.</p>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100" style={{ boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>
              <div className="grid grid-cols-2 px-4 py-2.5 text-[11px] font-black text-slate-400 border-b border-slate-100 bg-blue-50">
                <span>Word</span>
                <span>Example</span>
              </div>
              {INVARIANT_NOUNS.map((n, i) => (
                <div key={i} className="grid grid-cols-2 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <span className="font-black text-sm text-slate-800">{n.word}</span>
                  <span className="text-xs text-slate-500 flex items-center">{n.example}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 px-4 py-4 rounded-2xl bg-amber-50 border border-amber-200">
              <p className="text-xs font-black text-amber-800 mb-1">🎯 AFCAT SVA Rule</p>
              <p className="text-xs text-amber-700">
                With these nouns, the verb agrees with the number being referenced:<br />
                &quot;The sheep <strong>is</strong> in the field.&quot; (one sheep)<br />
                &quot;The sheep <strong>are</strong> in the field.&quot; (many sheep)
              </p>
            </div>
          </div>
        )}

        {/* IRREGULAR NOUNS TAB */}
        {tab === "irregular" && (
          <div>
            <div className="px-4 py-3 rounded-2xl bg-purple-50 border border-purple-200 mb-4">
              <p className="text-xs font-black text-purple-800 mb-1">📌 Irregular Noun Plurals</p>
              <p className="text-xs text-purple-700">These nouns form their plural in unusual ways — not by adding -s or -es. Greek and Latin borrowings often have special plural forms tested in AFCAT.</p>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100" style={{ boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>
              <div className="grid grid-cols-2 px-4 py-2.5 text-[11px] font-black text-slate-400 border-b border-slate-100 bg-purple-50">
                <span>Singular</span>
                <span>Plural</span>
              </div>
              {IRREGULAR_NOUNS.map((n, i) => (
                <div key={i} className="grid grid-cols-2 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <span className="font-black text-sm text-slate-800">{n.singular}</span>
                  <div>
                    <span className="font-bold text-sm text-purple-700">{n.plural}</span>
                    {n.note && <p className="text-[10px] text-slate-400 mt-0.5">{n.note}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 px-4 py-4 rounded-2xl bg-amber-50 border border-amber-200">
              <p className="text-xs font-black text-amber-800 mb-1">🎯 Pattern Tips</p>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• <strong>-um → -a</strong>: datum/data, medium/media, bacterium/bacteria</li>
                <li>• <strong>-us → -i</strong>: alumnus/alumni, cactus/cacti, nucleus/nuclei</li>
                <li>• <strong>-is → -es</strong>: analysis/analyses, basis/bases, crisis/crises</li>
                <li>• <strong>-on → -a</strong>: criterion/criteria, phenomenon/phenomena</li>
                <li>• <strong>-fe/-f → -ves</strong>: knife/knives, life/lives, half/halves</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import {
  aiChat, extractJSON, RULE_INDEX, SECTION_NAMES,
  corsPreflight, jsonResponse, errorResponse,
} from "@/lib/ai";

export const maxDuration = 60;

export type PracticeQuestion = {
  id: string;
  category: string;
  section: string;
  question: string;
  options: { text: string; why: string }[];
  correctIndex: number;
  rule: string;
  explanation: string;
};

const CATEGORIES = [
  "Error Spotting",
  "Fill in the Blank",
  "Sentence Improvement",
  "Synonym",
  "Antonym",
  "Idiom/Phrase",
  "One-Word Substitution",
];

const SYSTEM = `You are an AFCAT (Air Force Common Admission Test) English question setter. You write original multiple-choice questions in the exact style and difficulty of the AFCAT English section.

Question categories (use these exact strings): ${CATEGORIES.join(" | ")}
App topics for the "section" field (use these exact strings): ${SECTION_NAMES.join(" | ")}

Quality bar:
- Each question has exactly 4 options with exactly one correct answer.
- Distractors must be plausible — the kind an average aspirant actually picks.
- "question" holds the full stem. For Error Spotting, split the sentence into labelled parts (A)/(B)/(C)/(D) inside the stem, and make each option that part's text.
- For every option, "why" is one short sentence: for the correct option why it is right; for wrong options exactly why they are wrong.
- "rule" names the grammar rule being tested. Whenever one of the app's rules below applies, cite it by its exact name; for vocabulary/idiom questions give the word/idiom with its meaning instead.
- "explanation" is 2–3 sentences: why the correct answer is right, explicitly reasoning from the rule.
- Vary categories, topics and difficulty within a batch. Never repeat a question from the exclusion list.

Respond with JSON only, exactly this shape:
{"questions":[{"category":"...","section":"...","question":"...","options":[{"text":"...","why":"..."},{"text":"...","why":"..."},{"text":"...","why":"..."},{"text":"...","why":"..."}],"correctIndex":0,"rule":"...","explanation":"..."}]}

The app's rule list (cite these names when applicable):
${RULE_INDEX}`;

export async function OPTIONS() { return corsPreflight(); }

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const count = Math.min(Math.max(Number(body.count) || 5, 1), 8);
    const exclude: string[] = Array.isArray(body.exclude) ? body.exclude.slice(-60) : [];
    const focus: string = typeof body.focus === "string" ? body.focus : "";

    const parts = [
      `Write ${count} fresh AFCAT English MCQs as JSON.`,
      focus
        ? `The student is weak in: ${focus}. Most questions should test these topics.`
        : "Mix the categories — at most 2 questions of the same category.",
      exclude.length
        ? `Do NOT reuse or closely paraphrase any of these already-asked questions:\n${exclude.map((s) => `- ${s}`).join("\n")}`
        : "",
    ].filter(Boolean);

    const raw = await aiChat({
      system: SYSTEM,
      messages: [{ role: "user", content: parts.join("\n\n") }],
      json: true,
      maxTokens: 4000,
      temperature: 0.9, // variety across batches
    });

    const parsed = extractJSON<{ questions: Omit<PracticeQuestion, "id">[] }>(raw);
    const questions: PracticeQuestion[] = (parsed.questions || [])
      .filter((q) =>
        q && typeof q.question === "string" &&
        Array.isArray(q.options) && q.options.length === 4 &&
        q.options.every((o) => o && typeof o.text === "string") &&
        Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex <= 3)
      .map((q, i) => ({
        ...q,
        section: SECTION_NAMES.includes(q.section) ? q.section : "Miscellaneous",
        id: `${Date.now()}-${i}`,
      }));

    if (questions.length === 0) throw new Error("AI returned no usable questions");
    return jsonResponse({ questions });
  } catch (err) {
    return errorResponse(err);
  }
}

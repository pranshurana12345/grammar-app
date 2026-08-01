import QuizPageClient from "./QuizPageClient";

export function generateStaticParams() {
  // rules 0–106 (101–106 were added from the AFCAT paper analysis)
  return Array.from({ length: 107 }, (_, i) => ({ ruleId: String(i) }));
}

export default function QuizPage() {
  return <QuizPageClient />;
}

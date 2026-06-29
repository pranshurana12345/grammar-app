import QuizPageClient from "./QuizPageClient";

export function generateStaticParams() {
  return Array.from({ length: 101 }, (_, i) => ({ ruleId: String(i) }));
}

export default function QuizPage() {
  return <QuizPageClient />;
}

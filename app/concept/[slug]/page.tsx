import { CONCEPTS } from "@/data/concepts";
import ConceptPageClient from "./ConceptPageClient";

export function generateStaticParams() {
  return CONCEPTS.map((c) => ({ slug: c.slug }));
}

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ConceptPageClient slug={slug} />;
}

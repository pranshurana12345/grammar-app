import { SECTIONS } from "@/data/rules";
import SectionTestPageClient from "./SectionTestPageClient";

export function generateStaticParams() {
  return SECTIONS.map((sec) => ({ sectionName: sec.name }));
}

export default async function TestPage({ params }: { params: Promise<{ sectionName: string }> }) {
  const { sectionName } = await params;
  return <SectionTestPageClient sectionName={sectionName} />;
}

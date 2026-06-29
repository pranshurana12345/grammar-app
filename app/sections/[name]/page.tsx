import { SECTIONS } from "@/data/rules";
import SectionPageClient from "./SectionPageClient";

export function generateStaticParams() {
  return SECTIONS.map((sec) => ({ name: sec.name }));
}

export default async function SectionPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  return <SectionPageClient name={name} />;
}
